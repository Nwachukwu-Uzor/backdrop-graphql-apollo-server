import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import { tokenSecret, tokenIssuer } from "../../config/config.js";

export const auth = ({ req, res }) => {
  try {
    const authHeader = req?.headers?.authorization;
    if (!authHeader) {
      return { user: null };
    }
    const token = authHeader.split("Bearer ")[1];

    if (!token) {
      return { user: null };
    }

    const user = jwt.verify(token, tokenSecret);

    if (!user) {
      return { user: null };
    }

    return { user };
  } catch (error) {
    return { user: null };
  }
};
// export const auth = (context) => {
//   const authHeader = context?.req?.headers?.authorization;
//   if (!authHeader) {
//     throw new GraphQLError("UnAuthorized: Access token is required", {
//       extensions: {
//         code: "UNAUTHORIZED",
//         http: {
//           status: 401,
//         },
//       },
//     });
//   }
//   const token = authHeader.split("Bearer")[1];

//   if (!token) {
//     throw new GraphQLError(
//       "UnAuthorized: Access token must be of scheme [Bearer Token]",
//       {
//         extensions: {
//           code: "UNAUTHORIZED",
//           http: {
//             status: 401,
//           },
//         },
//       }
//     );
//   }

//   const user = jwt.verify(token, tokenSecret, { issuer: tokenIssuer });

//   if (!user) {
//     throw new GraphQLError("UnAuthorized: Invalid token", {
//       extensions: {
//         code: "UNAUTHORIZED",
//         http: {
//           status: 401,
//         },
//       },
//     });
//   }
//   return user;
// };
