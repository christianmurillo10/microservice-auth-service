import { Message } from "kafkajs";
import UsersModel from "../../../models/users.model";
import UsersService from "../../../services/users.service";

const usersService = new UsersService();

const subscribeUserCreated = async (message: Message): Promise<void> => {
  const value: UsersModel = JSON.parse(message.value?.toString() ?? '{}');
  const userId = value.id!;
  await usersService.save(value)
    .catch(err => {
      console.log("Error on creating users", err);
    });
  console.info(`Event Notification: Successfully created user ${userId}.`);
};

export default subscribeUserCreated;