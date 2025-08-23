import UserEntity from "../../../entities/user.entity";
import EventListenerAbstract from "../event-listener.abstract";
import EventListenerService from "../event-listener.interface";
import UserService from "../../user.service";
import NotFoundException from "../../../shared/exceptions/not-found.exception";

export default class UserPasswordChangedEventListenerService extends EventListenerAbstract<UserEntity> implements EventListenerService<UserEntity> {
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

    const userId = this.state.newDetails.id!;
    const user = await this.userService.getById(userId)
      .catch(err => {
        if (err instanceof NotFoundException) {
          console.log(`User ${userId} not exist!`);
          return;
        }

        throw err;
      });

    if (!user) {
      return;
    }

    user.changePassword(this.state.newDetails.password);
    await this.userService.save(user)
      .catch(err => {
        console.log("Error on changing user password", err);
      });

    console.info(`Event Notification: Successfully changed user password ${user.id}.`);
  };
};