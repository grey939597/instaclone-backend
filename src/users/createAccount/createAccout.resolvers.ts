import * as bcrypt from "bcrypt";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password },
      { client }
    ) => {
      try {
        // (1) check if username or email are already on DB.
        const existingUser = await client.user.findFirst({
          where: {
            OR: [
              {
                username,
              },
              {
                email,
              },
            ],
          },
        });
        if (existingUser) {
          throw new Error("This username/password is already taken.");
        }

        // (2) hash password : hash, salt
        // https://www.npmjs.com/package/bcrypt
        const uglyPassword = await bcrypt.hash(password, 10);

        // (3) save and return the user
        await client.user.create({
          data: {
            username,
            email,
            firstName,
            lastName,
            password: uglyPassword,
          },
        });
        return {
          ok: true,
        };
      } catch (error) {
        return {
          ok: false,
          error: "Can't create account.",
        };
      }
    },
  },
};

export default resolvers;
