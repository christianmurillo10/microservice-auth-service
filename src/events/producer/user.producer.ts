import { IHeaders } from "kafkajs";
import KafkaService from "../../services/kafka.service";
import kafkaConfig from "../../config/kafka.config";
import { EVENT_USER, EVENT_USER_LOGGED_IN, EVENT_USER_LOGGED_OUT } from "../../shared/constants/events.constant";
import { EventMessageData } from "../../shared/types/common.type";
import { UserLoggedIn, UserLoggedOut } from "../../shared/types/events/users.type";

export default class UserKafkaProducer {
  private kafkaService: KafkaService;

  constructor() {
    this.kafkaService = new KafkaService({
      clientId: kafkaConfig.kafka_client_id,
      brokers: [kafkaConfig.kafka_broker]
    });
  };

  publishUserLoggedIn = async (data: EventMessageData<UserLoggedIn>, headers?: IHeaders): Promise<void> => {
    await this.kafkaService.connectProducer();
    await this.kafkaService.initializeProducer(EVENT_USER, EVENT_USER_LOGGED_IN, data, headers);
    await this.kafkaService.disconnectProducer();
  };

  publishUserLoggedOut = async (data: EventMessageData<UserLoggedOut>, headers?: IHeaders): Promise<void> => {
    await this.kafkaService.connectProducer();
    await this.kafkaService.initializeProducer(EVENT_USER, EVENT_USER_LOGGED_OUT, data, headers);
    await this.kafkaService.disconnectProducer();
  };
};