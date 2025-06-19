import UsersModel from "../../../models/users.model";
import { EventMessageData } from "../../../shared/types/common.type";
import EventListenerAbstract from "../event-listener.abstract";
import EventListenerService from "../event-listener.interface";
import UsersService from "../../users.service";
import NotFoundException from "../../../shared/exceptions/not-found.exception";

export default class UserPasswordChangedEventListenerService extends EventListenerAbstract<EventMessageData<UsersModel>> implements EventListenerService<UsersModel> {
  usersService: UsersService;

  constructor() {
    super();
    this.usersService = new UsersService();
  };

  execute = async (): Promise<void> => {
    if (!this.state) {
      console.error("State must not be empty!");
      return;
    };

    const userId = this.state.new_details.id!;
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
      password: this.state.new_details.password,
      updated_at: this.state.new_details.updated_at
    });
    await this.usersService.save(user)
      .catch(err => {
        console.log("Error on changing users password", err);
      });

    console.info(`Event Notification: Successfully changed user password ${user.id}.`);
  };
};