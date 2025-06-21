import EventListenerAbstract from "../event-listener.abstract";
import EventListenerService from "../event-listener.interface";
import UsersService from "../../users.service";
import UsersModel from "../../../models/users.model";
import NotFoundException from "../../../shared/exceptions/not-found.exception";

export default class UserBulkDeletedEventListenerService extends EventListenerAbstract<Record<string, string[]>> implements EventListenerService<Record<string, string[]>> {
  private usersService: UsersService;

  constructor() {
    super();
    this.usersService = new UsersService();
  };

  execute = async (): Promise<void> => {
    if (!this.state) {
      console.error("State cannot be empty!");
      return;
    };

    const userIds = this.state.new_details.ids;

    for (const userId of userIds) {
      const existingUser = await this.usersService.getById(userId)
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

      const user = new UsersModel({
        ...existingUser,
        deleted_at: new Date()
      });
      await this.usersService.save(user)
        .catch(err => {
          console.log("Error on deleting users", err);
        });
    }

    console.info("Event Notification: Successfully bulk deleted users.");
  };
};