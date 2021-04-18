import jwt from "jsonwebtoken";
import client from "../client";

export const getUser = async (token) => {
  try {
    if (!token) {
      return null;
    }
    // token 검증, return decoded token
    const { id } = await jwt.verify(token, process.env.SECRET_KEY);
    const user = await client.user.findUnique({ where: { id } });
    return user ? user : null;
  } catch (e) {
    return null;
  }
};

// 함수를 return 하는 함수
// 함수 (root, args, context, info) => { ... } 를 return
export const protectedResolver = (ourResolver) => (
  root,
  args,
  context,
  info
) => {
  // loggedInUser가 없으면 { ok: false, error: "..." }을 return
  if (!context.loggedInUser) {
    return {
      ok: false,
      error: "Please log in to perform this action.",
    };
  }
  // loggedInUser가 있으면 ourResolver (실행할 resolver)를 return
  return ourResolver(root, args, context, info);
};

// export default function protectedResolver(ourResolver) {
//   return function (root, args, context, info) {
//     if (!context.loggedInUser) {
//       return {
//         ok: false,
//         error: "Please log in to perform this action.",
//       };
//     }
//     return ourResolver(root, args, context, info);
//   };
// }
