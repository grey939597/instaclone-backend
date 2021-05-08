export default {
  Query: {
    searchUsers: async (_, { keyword, lastId }, { client }) =>
      client.user.findMany({
        where: {
          username: {
            startsWith: keyword.toLowerCase(),
          },
        },
        skip: lastId ? 1 : 0,
        take: 5,
        ...(lastId && { cursor: { id: lastId } }),
      }),
  },
};
