import { PubSub } from "apollo-server-express";

// Subscription을 위해서 pubsub class 필요
// Publish - Subscribe Engine : Apollo-server 내장
// Production 때는 Redis PubSub 사용
const pubsub = new PubSub();

export default pubsub;
