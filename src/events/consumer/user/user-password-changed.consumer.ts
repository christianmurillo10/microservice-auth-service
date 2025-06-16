import UsersModel from "../../../models/users.model";
import UsersService from "../../../services/users.service";
import NotFoundException from "../../../shared/exceptions/not-found.exception";
import { EventMessageData } from "../../../shared/types/common.type";

const usersService = new UsersService();

const subscribeUserPasswordChanged = async (value: EventMessageData<UsersModel>): Promise<void> => {
  const userId = value.new_details.id!;
  const existingUser = await usersService.getById(userId)
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
    password: value.new_details.password,
    updated_at: value.new_details.updated_at
  });
  await usersService.save(user)
    .catch(err => {
      console.log("Error on changing users password", err);
    });
  console.info(`Event Notification: Successfully changed user password ${user.id}.`);
};

export default subscribeUserPasswordChanged;