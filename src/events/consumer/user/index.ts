import { KafkaMessage } from "kafkajs";
import {
  EVENT_USER_CREATED,
  EVENT_USER_UPDATED,
  EVENT_USER_DELETED,
  EVENT_USER_PASSWORD_CHANGED,
  EVENT_USER_BULK_DELETED
} from "../../../shared/constants/events.constant";
import subscribeUserCreated from "./user-created.consumer";
import subscribeUserUpdated from "./user-updated.consumer";
import subscribeUserDeleted from "./user-deleted.consumer";
import subscribeUserBulkDeleted from "./user-bulk-deleted.consumer";
import subscribeUserPasswordChanged from "./user-password-changed.consumer";

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
    case EVENT_USER_BULK_DELETED:
      await subscribeUserBulkDeleted(value.data);
      break;
    case EVENT_USER_PASSWORD_CHANGED:
      await subscribeUserPasswordChanged(value.data);
      break;
  };
};

export default userConsumer;