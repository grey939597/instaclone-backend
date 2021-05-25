import { Resolvers } from "aws-sdk/clients/appsync";
import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";

// triggers를 listen (NEW_MESSAGE event를 listen)
const resolvers = {
  Subscription: {
    roomUpdates: {
      subscribe: () => pubsub.asyncIterator(NEW_MESSAGE),
    },
  },
};

export default resolvers;
