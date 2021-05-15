import { Resolver, Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolverFn: Resolver = async (_, { id }, { client, loggedInUser }) => {
  try {
    const photo = await client.photo.findUnique({
      where: {
        id,
      },
    });
    if (!photo) {
      return {
        ok: false,
        error: "Photo not found.",
      };
    }

    const likeWhere = {
      photoId_userId: {
        photoId: id,
        userId: loggedInUser.id,
      },
    };
    // 사진에 현재 유저가 좋아요를 눌렀는지 확인
    const like = await client.like.findUnique({
      where: likeWhere,
    });
    if (like) {
      // 좋아요가 있으면 좋아요 삭제
      await client.like.delete({
        where: likeWhere,
      });
    } else {
      // 좋아요가 없으면 좋아요 생성
      await client.like.create({
        data: {
          user: {
            connect: {
              id: loggedInUser.id,
            },
          },
          photo: {
            connect: {
              id: photo.id,
            },
          },
        },
      });
    }

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Error occured.",
    };
  }
};

const resolvers: Resolvers = {
  Mutation: {
    toggleLike: protectedResolver(resolverFn),
  },
};

export default resolvers;
