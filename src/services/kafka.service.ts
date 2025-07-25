import { ConsumerConfig, EachMessagePayload, IHeaders, Kafka, KafkaConfig, logLevel, Message, Producer } from "kafkajs";

export default class KafkaService {
  private kafka: Kafka;
  private producer: Producer;
  private consumers: Map<string, any> = new Map();

  constructor(kafkaConfig: KafkaConfig) {
    this.kafka = new Kafka({ ...kafkaConfig, logLevel: logLevel.ERROR });
    this.producer = this.kafka.producer();
  };

  connectProducer = async () => {
    try {
      console.info("Connecting producer...")
      await this.producer.connect();
      console.info("Producer connected successfully connected successfully")
    } catch (error) {
      console.error("Failed to connect kafka producer:", error);
    }
  };

  initializeProducer = async (
    topic: string,
    event: string,
    data: unknown,
    key?: string,
    headers?: IHeaders
  ) => {
    try {
      const msg: Message = {
        key: key,
        value: JSON.stringify({
          eventType: event,
          timeStamp: new Date().toISOString(),
          data
        }),
        headers
      }
      await this.producer.send({
        topic: topic,
        messages: [msg]
      })
      console.info(`Message sent to topic ${topic}`)
    } catch (error) {
      console.error("failed to initialise producer")
    }
  };

  disconnectProducer = async () => {
    try {
      console.info("Disconnecting producer...")
      await this.producer.disconnect();
      console.info("Producer disconnected successfully")
    } catch (error) {
      console.error("Failed to disconnect kafka producer:", error);
    }
  };

  initializeConsumer = async (
    topics: string[],
    groupId: string,
    eachMessageHandler: (payload: EachMessagePayload) => Promise<void>
  ) => {
    try {
      console.info(`Initializing kafka consumer for groupId: ${groupId}`);
      const consumerConfig: ConsumerConfig = { groupId: groupId };
      const consumer = this.kafka.consumer(consumerConfig);

      console.info("Connecting kafka consumer");
      await consumer.connect();
      console.info("Connected kafka consumer");

      for (const topic of topics) {
        await consumer.subscribe({ topic, fromBeginning: true });
        console.info(`Subscribed to topic: ${topic}`);
      }

      await consumer.run({
        eachMessage: async (payload) => {
          await eachMessageHandler(payload);
        },
      });

      topics.forEach(topic => this.consumers.set(topic, consumer));
    } catch (error) {
      console.error("Failed to initialize kafka consumer:", error);
    }
  };

  disconnectConsumer = async (topic: string) => {
    const consumer = this.consumers.get(topic);
    if (consumer) {
      try {
        console.info(`Disconnecting kafka consumer for topic: ${topic}`);
        await consumer.disconnect();
        console.info(`Disconnected kafa consumer: ${topic}`);
        this.consumers.delete(topic);
      } catch (error) {
        console.error(`Failed to disconnect kafka consumer for topic: ${topic}`, error);
      }
    } else {
      console.info(`No consumer found for topic: ${topic}`);
    }
  };
};