import UsersModel from "../../../models/users.model";
import { EventMessageData } from "../../../shared/types/common.type";
import EventListenerAbstract from "../event-listener.abstract";
import EventListenerService from "../event-listener.interface";
import UsersService from "../../users.service";

export default class UserCreatedEventListenerService extends EventListenerAbstract<EventMessageData<UsersModel>> implements EventListenerService<UsersModel> {
  usersService: UsersService;

  constructor() {
    super();
    this.usersService = new UsersService();
  };

  execute = async (): Promise<void> => {
    if (!this.state) {
      console.error("State cannot be empty!");
      return;
    };

    const user = new UsersModel(this.state.new_details);
    await this.usersService.save(user)
      .catch(err => {
        console.log("Error on creating users", err);
      });

    console.info(`Event Notification: Successfully created user ${user.id}.`);
  };
};