import KafkaService from "../../services/kafka.service";
import kafkaConfig from "../../config/kafka.config";
import { EVENT_USER, EVENT_USER_LOGGED_IN, EVENT_USER_LOGGED_OUT } from "../../shared/constants/events.constant";
import { UserLoggedIn, UserLoggedOut } from "../../shared/types/events/users.type";

export default class UserKafkaProducer {
  private kafkaService: KafkaService;

  constructor() {
    this.kafkaService = new KafkaService({
      clientId: kafkaConfig.kafka_client_id,
      brokers: [kafkaConfig.kafka_broker]
    });
  };

  publishUserLoggedIn = async (data: UserLoggedIn): Promise<void> => {
    await this.kafkaService.connectProducer();
    await this.kafkaService.initializeProducer(EVENT_USER, EVENT_USER_LOGGED_IN, data);
    await this.kafkaService.disconnectProducer();
  };

  publishUserLoggedOut = async (data: UserLoggedOut): Promise<void> => {
    await this.kafkaService.connectProducer();
    await this.kafkaService.initializeProducer(EVENT_USER, EVENT_USER_LOGGED_OUT, data);
    await this.kafkaService.disconnectProducer();
  };

  execute = async (): Promise<void> => {
    await this.kafkaService.connectAdmin();
    await this.kafkaService.createTopics([
      {
        topic: EVENT_USER,
        numPartitions: 2,
        replicationFactor: 1
      }
    ]);
  };
};