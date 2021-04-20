import { existsSync, mkdirSync, createWriteStream } from "fs";
import * as bcrypt from "bcrypt";
import { Resolver, Resolvers } from "../../types";
import { protectedResolver } from "../users.utils";

const resolverFn: Resolver = async (
  _,
  { firstName, lastName, username, email, password: newPassword, bio, avatar },
  { loggedInUser, client }
) => {
  const { filename, createReadStream } = await avatar;
  const readStream = createReadStream(); // 파일 읽기
  const path = `${process.cwd()}/uploads`; // current working directory
  if (!existsSync(path)) {
    mkdirSync(path);
  }
  const writeStream = createWriteStream(`${path}/${filename}`); // 파일 쓰기
  readStream.pipe(writeStream); // 읽기-쓰기 연결
  if (!loggedInUser) {
    return {
      ok: false,
      error: "You need to login.",
    };
  }
  let uglyPassword = null;
  if (newPassword) {
    uglyPassword = await bcrypt.hash(newPassword, 10);
  }

  const updatedUser = await client.user.update({
    where: { id: loggedInUser.id },
    data: {
      firstName,
      lastName,
      username,
      email,
      bio,
      ...(uglyPassword && { password: uglyPassword }),
    },
  });

  if (updatedUser.id) {
    return {
      ok: true,
    };
  } else {
    return {
      ok: false,
      error: "Could not update profile.",
    };
  }
};

const resolvers: Resolvers = {
  Mutation: {
    editProfile: protectedResolver(resolverFn),
  },
};

export default resolvers;
