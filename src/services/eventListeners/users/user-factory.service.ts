import {
  EVENT_USER_BULK_DELETED,
  EVENT_USER_CREATED,
  EVENT_USER_DELETED,
  EVENT_USER_PASSWORD_CHANGED,
  EVENT_USER_UPDATED
} from "../../../shared/constants/events.constant";

export default class UserEventListenerServiceFactory {
  public static createInstance(event: string) {
    switch (event) {
      case EVENT_USER_CREATED:
        break;
      case EVENT_USER_UPDATED:
        break;
      case EVENT_USER_DELETED:
        break;
      case EVENT_USER_BULK_DELETED:
        break;
      case EVENT_USER_PASSWORD_CHANGED:
        break;
    };
  };
};