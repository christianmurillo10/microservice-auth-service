import KafkaService from "../../services/kafka.service";
import kafkaConfig from "../../config/kafka.config";
import { EVENT_USER, EVENT_USER_LOGGED } from "../../shared/constants/events.constant";
import Users from "../../entities/users.entity";

export default class UserKafkaProducer {
  private kafkaService: KafkaService;

  constructor() {
    this.kafkaService = new KafkaService({
      clientId: kafkaConfig.kafka_client_id,
      brokers: [kafkaConfig.kafka_broker]
    });
  };

  publishUserLogged = async (data: Users): Promise<void> => {
    await this.kafkaService.connectProducer();
    await this.kafkaService.initializeProducer(EVENT_USER, EVENT_USER_LOGGED, data);
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