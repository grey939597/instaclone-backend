import { gql } from "apollo-server-core";

export default gql`
  type Query {
    seePhotoComments(id: Int!, lastId: Int): [Comment]
  }
`;
