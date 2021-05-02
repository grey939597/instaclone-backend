export default {
  Query: {
    seeFollowers: async (_, { username, page }, { client }) => {
      try {
        // User가 존재하는지 확인
        const ok = await client.user.findUnique({
          where: { username },
          select: { id: true },
        });
        if (!ok) {
          return {
            ok: false,
            error: "User not found.",
          };
        }
        // Offset Pagenation
        const followers = await client.user
          .findUnique({
            where: { username },
          })
          .followers({
            skip: (page - 1) * 5,
            take: 5,
          });
        const totalFollowers = await client.user.count({
          where: {
            following: {
              some: {
                username,
              },
            },
          },
        });
        return {
          ok: true,
          followers,
          totalPages: Math.ceil(totalFollowers / 5),
        };
      } catch (error) {
        return {
          ok: false,
          error: "Error occured.",
        };
      }
    },
  },
};
