import { Message } from "kafkajs";
import UsersModel from "../../../models/users.model";
import UsersService from "../../../services/users.service";
import NotFoundException from "../../../shared/exceptions/not-found.exception";

const usersService = new UsersService();

const subscribeUserDeleted = async (message: Message): Promise<void> => {
  const value: UsersModel = JSON.parse(message.value?.toString() ?? '{}');
  const userId = value.id!;
  const record = await usersService.getById(userId)
    .catch(err => {
      if (err instanceof NotFoundException) {
        console.log(`User ${userId} not exist!`);
        return;
      }

      throw err;
    });

  if (!record) {
    return;
  }

  await usersService.save({
    ...record,
    ...value
  })
    .catch(err => {
      console.log("Error on deleting users", err);
    });
  console.info(`Event Notification: Successfully deleted user ${userId}.`);
};

export default subscribeUserDeleted;