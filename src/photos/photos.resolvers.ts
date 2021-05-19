import client from "../client";
import { Resolvers } from "../types";

const resolvers: Resolvers = {
  Photo: {
    user: ({ userId }) =>
      client.user.findUnique({
        where: {
          id: userId,
        },
      }),
    hashtags: ({ id }) =>
      client.hashtag.findMany({
        where: {
          photos: {
            some: {
              id,
            },
          },
        },
      }),
    likes: ({ id }) =>
      client.like.count({
        where: {
          photoId: id,
        },
      }),
    comments: ({ id }) =>
      client.comment.count({
        where: {
          photoId: id,
        },
      }),
    isMine: ({ userId }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return userId === loggedInUser.id;
    },
  },
  Hashtag: {
    photos: ({ id }, { page }) => {
      return client.hashtag
        .findUnique({
          where: {
            id,
          },
        })
        .photos({
          skip: (page - 1) * 5,
          take: 5,
        });
    },
    totalPhotos: ({ id }) =>
      client.photo.count({
        where: {
          hashtags: {
            some: {
              id,
            },
          },
        },
      }),
  },
};

export default resolvers;
