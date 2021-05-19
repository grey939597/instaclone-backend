import { gql } from "apollo-server-core";

export default gql`
  type Query {
    seeFollowers(username: String!, page: Int!): MutationResponse!
  }
`;
