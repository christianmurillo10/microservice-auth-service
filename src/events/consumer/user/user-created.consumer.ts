import UsersModel from "../../../models/users.model";
import UsersService from "../../../services/users.service";
import { EventMessageData } from "../../../shared/types/common.type";

const usersService = new UsersService();

const subscribeUserCreated = async (value: EventMessageData<UsersModel>): Promise<void> => {
  const user = new UsersModel(value.new_details);
  await usersService.save(user)
    .catch(err => {
      console.log("Error on creating users", err);
    });
  console.info(`Event Notification: Successfully created user ${user.id}.`);
};

export default subscribeUserCreated;