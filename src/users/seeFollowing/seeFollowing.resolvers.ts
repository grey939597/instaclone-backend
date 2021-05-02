export default {
  Query: {
    seeFollowing: async (_, { username, lastId }, { client }) => {
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

        const following = await client.user
          .findUnique({
            where: {
              username,
            },
          })
          .following({
            skip: lastId ? 1 : 0,
            take: 5,
            ...(lastId && { cursor: { id: lastId } }),
          });

        return {
          ok: true,
          following,
        };
      } catch (err) {
        return {
          ok: false,
          error: "Error occured.",
        };
      }
    },
  },
};
