import mongoose from "mongoose";
import { startStandaloneServer } from "@apollo/server/standalone";
import { mongoDbUri, port } from "./config.js";

export const connectDB = async (/**server*/) => {
  try {
    const connection = await mongoose.connect(mongoDbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    if (!connection) {
      return;
    }
    console.log(`Database connection successfully established`);
    // const serverStart = await startStandaloneServer(server, {
    //   listen: { port },
    // });
    // if (!serverStart) {
    //   return;
    // }

    // console.log(`Server is running on ${serverStart?.url}`);
  } catch (error) {
    throw error;
  }
};
