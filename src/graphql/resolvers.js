import { GraphQLError } from "graphql";
import axios from "axios";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel, BankAccountModel } from "../models/index.js";
import {
  paystackTestSecret,
  tokenIssuer,
  tokenSecret,
} from "../../config/config.js";
import { levenshteinDistance } from "../utils/index.js";

const PAYSTACK_AUTHORIZATION_HEADER = `Bearer ${paystackTestSecret}`;
const MAXIMUM_ALLOW_LEVENSHTEIN_DISTANCE = 2;

export const resolvers = {
  Query: {
    async getUser(_parent, { id }) {
      return await UserModel.findById(id);
    },
    async getUsers(_parent, _args) {
      const users = await UserModel.find();
      return users;
    },
    async getAccount(_parent, { user_id }) {
      return await BankAccountModel.findOne({
        user: user_id,
      }).populate("user");
    },
    async getBanks(_parent, _args, contextValue) {
      console.log(contextValue);
      try {
        const response = await axios.get("https://api.paystack.co/bank", {
          headers: {
            Authorization: PAYSTACK_AUTHORIZATION_HEADER,
          },
        });

        if (response?.status !== 200) {
          throw new Error(`Something went wrong`);
        }

        return response?.data?.data;
      } catch (error) {
        throw new Error(
          `Something went wrong ${error?.response?.data?.message}`
        );
      }
    },
  },
  Mutation: {
    async addUser(_, { email, password, phone }) {
      const user = new UserModel({
        email,
        phone,
        password,
      });
      return user.save();
    },
    async deleteUser(_, { id }) {
      return await UserModel.findByIdAndDelete(id);
    },
    async addAccount(_, args) {
      try {
        const user = await UserModel.findById(args?.user_id);
        // Check if the user Id provided belongs to a user
        if (!user) {
          throw new Error("No user found with the id provided");
        }

        const response = await axios.get(
          `https://api.paystack.co/bank/resolve?account_number=${args?.user_account_number}&bank_code=${args?.user_bank_code}`,
          {
            headers: {
              Authorization: PAYSTACK_AUTHORIZATION_HEADER,
            },
          }
        );

        if (response?.status !== 200) {
          throw new Error(`Something went wrong`);
        }

        const isLevenshteinDistanceWithinAllowableLimit =
          MAXIMUM_ALLOW_LEVENSHTEIN_DISTANCE >=
          levenshteinDistance(
            args?.user_account_name?.toUpperCase(),
            response?.data?.data?.account_name?.toUpperCase()
          );

        if (!isLevenshteinDistanceWithinAllowableLimit) {
          throw new Error(
            "Account name provided doesn't match the account name linked to this account number"
          );
        }

        const newAccount = new BankAccountModel({
          user_account_name: response?.data?.data?.account_name,
          user_id: args?.user_id,
          user_account_number: args?.user_account_number,
          user_bank_code: args?.user_bank_code,
          user_bank_id: response?.data?.data?.bank_id,
        });

        return newAccount.save();
      } catch (error) {
        if (error?.response) {
          throw new Error(
            `Something went wrong ${error?.response?.data?.message}`
          );
        }
        throw new Error(`Something went wrong: ${error?.message}`);
      }
    },
    async loginUser(_, { email, password }) {
      try {
        const user = await UserModel.findOne({ email });
        if (!user) {
          throw new Error("Login Failed: Username or Password incorrect");
        }

        const isPasswordCorrect = await bcrypt.compare(
          password,
          user?.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Login Failed: Username or Password incorrect");
        }

        const token = jwt.sign(
          {
            user_id: user._id,
            email: user._doc.email,
            phone: user._doc.phone,
          },
          tokenSecret,
          { issuer: tokenIssuer, expiresIn: "2h" }
        );

        return {
          user: {
            id: user._id,
            ...user._doc,
          },
          token,
        };
      } catch (error) {
        throw new Error(error?.message);
      }
    },
  },
};
