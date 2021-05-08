export default {
  User: {
    totalFollowing: ({ id }, _, { client }) =>
      client.user.count({
        where: {
          followers: {
            some: {
              id,
            },
          },
        },
      }),
    totalFollowers: ({ id }, _, { client }) =>
      client.user.count({
        where: {
          following: {
            some: {
              id,
            },
          },
        },
      }),
    isMe: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return id === loggedInUser.id;
    },
    isFollowing: async ({ id }, _, { client, loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      // 로그인 된 유저의 Following List에 parent user의 id를 가진 유저가 존재하는지 확인
      const exists = await client.user.count({
        where: {
          username: loggedInUser.username,
          following: {
            some: {
              id,
            },
          },
        },
      });
      return Boolean(exists);
      // const exists = await client.user
      //   .findUnique({
      //     where: {
      //       username: loggedInUser.username,
      //     },
      //   })
      //   .following({
      //     where: { id },
      //   });
      // return exists.length !== 0;
    },
  },
};
