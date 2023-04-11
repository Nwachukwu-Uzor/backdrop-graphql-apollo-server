import { ApolloServer } from "@apollo/server";
import { resolvers, typeDefs } from "./src/graphql/index.js";

import { connectDB } from "./config/db.js";

const server = new ApolloServer({ resolvers, typeDefs });

connectDB(server);
