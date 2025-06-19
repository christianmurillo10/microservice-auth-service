import {
  EVENT_USER_BULK_DELETED,
  EVENT_USER_CREATED,
  EVENT_USER_DELETED,
  EVENT_USER_PASSWORD_CHANGED,
  EVENT_USER_UPDATED
} from "../../../shared/constants/events.constant";
import InvalidEventTypeEventListenerService from "../invalid-event-type.service";
import UserBulkDeletedEventListenerService from "./user-bulk-deleted.service";
import UserCreatedEventListenerService from "./user-created.service";
import UserDeletedEventListenerService from "./user-deleted.service";
import UserPasswordChangedEventListenerService from "./user-password-changed.service";
import UserUpdatedEventListenerService from "./user-updated.service";

export default class UserEventListenerServiceFactory {
  public static createInstance(type: string) {
    switch (type) {
      case EVENT_USER_CREATED:
        return new UserCreatedEventListenerService();
      case EVENT_USER_UPDATED:
        return new UserUpdatedEventListenerService();
      case EVENT_USER_DELETED:
        return new UserDeletedEventListenerService();
      case EVENT_USER_BULK_DELETED:
        return new UserBulkDeletedEventListenerService();
      case EVENT_USER_PASSWORD_CHANGED:
        return new UserPasswordChangedEventListenerService();
      default:
        return new InvalidEventTypeEventListenerService();
    };
  };
};