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

    switch (message.key.toString()) {
      case EVENT_USER_CREATED:
        await subscribeUserCreated(message);
        break;
      case EVENT_USER_UPDATED:
        await subscribeUserUpdated(message);
        break;
    };
  };

  execute = async (): Promise<void> => {
    await this.kafkaService.initializeConsumer(
      EVENT_USER,
      "auth-service-group",
      this.eachMessageHandler
    );
  };
};