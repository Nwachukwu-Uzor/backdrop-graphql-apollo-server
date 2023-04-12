import * as dotenv from "dotenv";

dotenv.config();

export const port = process.env.PORT || 5000;
export const mongoDbUri =
  process.env.NODE_ENV === "development"
    ? process.env.MONGO_DB_LOCAL_URI
    : process.env.MONGO_DB_LIVE_URI;
export const paystackTestSecret = process.env.PAYSTACK_API_TEST_SECRET;
export const tokenIssuer = process.env.TOKEN_ISSUER
export const tokenSecret = process.env.TOKEN_SECRET
