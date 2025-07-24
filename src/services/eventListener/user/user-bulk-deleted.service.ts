import EventListenerAbstract from "../event-listener.abstract";
import EventListenerService from "../event-listener.interface";
import UserService from "../../user.service";
import UserModel from "../../../models/user.model";
import NotFoundException from "../../../shared/exceptions/not-found.exception";

export default class UserBulkDeletedEventListenerService extends EventListenerAbstract<Record<string, string[]>> implements EventListenerService<Record<string, string[]>> {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  };

  execute = async (): Promise<void> => {
    if (!this.state) {
      console.error("State cannot be empty!");
      return;
    };

    const userIds = this.state.newDetails.ids;

    for (const userId of userIds) {
      const existingUser = await this.userService.getById(userId)
        .catch(err => {
          if (err instanceof NotFoundException) {
            console.log(`User ${userId} not exist!`);
            return;
          }

          throw err;
        });

      if (!existingUser) {
        return;
      }

      const user = new UserModel({
        ...existingUser,
        deletedAt: new Date()
      });
      await this.userService.save(user)
        .catch(err => {
          console.log("Error on deleting user", err);
        });
    }

    console.info("Event Notification: Successfully bulk deleted user.");
  };
};