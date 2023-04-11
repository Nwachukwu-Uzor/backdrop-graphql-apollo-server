import { UserModel, BankAccountModel } from "../models/index.js";
import { paystackTestSecret } from "../../config/config.js";

const PAYSTACK_AUTHORIZATION_HEADER = `Bearer ${paystackTestSecret}`;
const MAXIMUM_ALLOW_LEVENSHTEIN_DISTANCE = 2;

export const resolvers = {
  Query: {
    async getUser(_parent, { id }) {
      return await UserModel.findById(id);
    },
    async getUsers(_parent, _args) {
      return await UserModel.find();
    },
    async getUsers(_parent, { user_id }) {
      return await BankAccountModel.findOne({ user_id });
    },
    async getBanks(_parent, _args) {
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
        
    },
  },
};
