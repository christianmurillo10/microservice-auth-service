import UserEntity from "../../../entities/user.entity";
import UserEventListenerServiceAbstract from "../event-listener.abstract";
import EventListenerService from "../event-listener.interface";
import UserService from "../../user.service";
import NotFoundException from "../../../shared/exceptions/not-found.exception";

export default class UserUpdatedEventListenerService extends UserEventListenerServiceAbstract<UserEntity> implements EventListenerService<UserEntity> {
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

    const newUser = {
      ...existingUser,
      ...this.state.newDetails
    };
    const user = new UserEntity(
      newUser.id,
      newUser.name,
      newUser.username,
      newUser.email,
      newUser.password,
      newUser.accessType,
      newUser.organizationId,
      newUser.isActive,
      newUser.isLogged,
      newUser.lastLoggedAt,
      newUser.createdAt,
      newUser.updatedAt,
      newUser.deletedAt
    );
    await this.userService.save(user)
      .catch(err => {
        console.log("Error on updating user", err);
      });

    console.info(`Event Notification: Successfully updated user ${user.id}.`);
  };
};