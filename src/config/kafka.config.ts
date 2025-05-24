export default {
  kafka_broker: process.env.KAFKA_BROKER || "localhost:9092",
  kafka_client_id: process.env.KAFKA_CLIENT_ID || "auth-service",
  kafka_group_id: process.env.KAFKA_GROUP_ID || "auth-service-group"
};