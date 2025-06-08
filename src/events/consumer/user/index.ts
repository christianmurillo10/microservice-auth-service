import { KafkaMessage } from "kafkajs";
import {
  EVENT_USER_CREATED,
  EVENT_USER_UPDATED,
  EVENT_USER_DELETED
} from "../../../shared/constants/events.constant";
import subscribeUserCreated from "./user-created.consumer";
import subscribeUserUpdated from "./user-updated.consumer";
import subscribeUserDeleted from "./user-deleted.consumer";

const userConsumer = async (message: KafkaMessage) => {
  const value = JSON.parse(message.value?.toString() ?? '{}');

  if (!value) {
    return;
  };

  switch (value.eventType) {
    case EVENT_USER_CREATED:
      await subscribeUserCreated(value.data);
      break;
    case EVENT_USER_UPDATED:
      await subscribeUserUpdated(value.data);
      break;
    case EVENT_USER_DELETED:
      await subscribeUserDeleted(value.data);
      break;
  };
};

export default userConsumer;