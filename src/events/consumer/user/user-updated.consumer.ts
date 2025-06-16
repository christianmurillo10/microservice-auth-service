import UsersModel from "../../../models/users.model";
import UsersService from "../../../services/users.service";
import NotFoundException from "../../../shared/exceptions/not-found.exception";
import { EventMessageData } from "../../../shared/types/common.type";

const usersService = new UsersService();

const subscribeUserUpdated = async (value: EventMessageData<UsersModel>): Promise<void> => {
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
    ...value.new_details
  });
  await usersService.save(user)
    .catch(err => {
      console.log("Error on updating users", err);
    });
  console.info(`Event Notification: Successfully updated user ${user.id}.`);
};

export default subscribeUserUpdated;