import { EachMessagePayload } from "kafkajs";
import KafkaService from "../../../services/kafka.service";
import kafkaConfig from "../../../config/kafka.config";
import { EVENT_USER, EVENT_USER_CREATED, EVENT_USER_UPDATED } from "../../../shared/constants/events.constant";
import subscribeUserCreated from "./user-created.consumer";
import subscribeUserUpdated from "./user-updated.consumer";

export default class UserKafkaConsumer {
  private kafkaService: KafkaService;

  constructor() {
    this.kafkaService = new KafkaService({
      clientId: kafkaConfig.kafka_client_id,
      brokers: [kafkaConfig.kafka_broker]
    });
  };

  private eachMessageHandler = async (payload: EachMessagePayload) => {
    const { message } = payload;

    if (!message.key) {
      return;
    };

    if (message.key.toString() === EVENT_USER_CREATED) {
      await subscribeUserCreated(message);
    };


    if (message.key.toString() === EVENT_USER_UPDATED) {
      await subscribeUserUpdated(message);
    };
  };

  execute = async (): Promise<void> => {
    const topics = [EVENT_USER];
    await this.kafkaService.initializeConsumer(
      topics,
      "auth-service-group",
      this.eachMessageHandler
    );
  };
};