import { gql } from "apollo-server-core";

export default gql`
  type Query {
    seeFollowing(username: String!, lastId: Int): MutationResponse!
  }
`;
