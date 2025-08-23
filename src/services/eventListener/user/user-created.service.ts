import UserEntity from "../../../entities/user.entity";
import EventListenerAbstract from "../event-listener.abstract";
import EventListenerService from "../event-listener.interface";
import UserService from "../../user.service";

export default class UserCreatedEventListenerService extends EventListenerAbstract<UserEntity> implements EventListenerService<UserEntity> {
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

    const { newDetails } = this.state;
    const user = new UserEntity(
      newDetails.id,
      newDetails.name,
      newDetails.username,
      newDetails.email,
      newDetails.password,
      newDetails.accessType,
      newDetails.organizationId,
      newDetails.isActive,
      newDetails.isLogged,
      newDetails.lastLoggedAt,
      newDetails.createdAt,
      newDetails.updatedAt,
      newDetails.deletedAt
    );
    await this.userService.save(user)
      .catch(err => {
        console.log("Error on creating user", err);
      });

    console.info(`Event Notification: Successfully created user ${user.id}.`);
  };
};