import { ApolloServer } from "@apollo/server";
import { resolvers, typeDefs } from "./src/graphql/index.js";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import cors from "cors";
import http from "http";

import { port } from "./config/config.js";
import { connectDB } from "./config/db.js";

import { auth } from "./src/middlewares/auth.js";

const app = express();

connectDB();

const httpServer = http.createServer(app);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  "/graphql",
  cors(),
  express.json(),
  expressMiddleware(server, { context: auth })
);

app.use(express.urlencoded({ extended: true }));
app.get("/health-check", (req, res) =>
  res.status(200).json({ message: "Application is running fine" })
);

await new Promise((resolve) => httpServer.listen({ port }, resolve));
console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
