import UserModel from "../../../models/user.model";
import EventListenerAbstract from "../event-listener.abstract";
import EventListenerService from "../event-listener.interface";
import UserService from "../../user.service";

export default class UserCreatedEventListenerService extends EventListenerAbstract<UserModel> implements EventListenerService<UserModel> {
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

    const user = new UserModel(this.state.newDetails);
    await this.userService.save(user)
      .catch(err => {
        console.log("Error on creating user", err);
      });

    console.info(`Event Notification: Successfully created user ${user.id}.`);
  };
};