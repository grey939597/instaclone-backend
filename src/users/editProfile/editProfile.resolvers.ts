import { existsSync, mkdirSync, createWriteStream } from "fs";
import * as bcrypt from "bcrypt";
import { Resolver, Resolvers } from "../../types";
import { protectedResolver } from "../users.utils";

const resolverFn: Resolver = async (
  _,
  { firstName, lastName, username, email, password: newPassword, bio, avatar },
  { loggedInUser, client }
) => {
  let avatarUrl = null;
  if (avatar) {
    const { filename, createReadStream } = await avatar;
    const readStream = createReadStream(); // 파일 읽기
    const directoryName = `${process.cwd()}/uploads`; // current working directory
    if (!existsSync(directoryName)) {
      mkdirSync(directoryName);
    }
    const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
    const writeStream = createWriteStream(`${directoryName}/${newFilename}`); // 파일 쓰기
    readStream.pipe(writeStream); // 읽기-쓰기 연결, 파일 저장
    avatarUrl = `http://localhost:4000/static/${newFilename}`;
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
      ...(avatarUrl && { avatar: avatarUrl }),
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
