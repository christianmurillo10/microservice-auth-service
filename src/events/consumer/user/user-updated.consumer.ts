import { Message } from "kafkajs";
import Users from "../../../models/users.model";
import UsersService from "../../../services/users.service";
import NotFoundException from "../../../shared/exceptions/not-found.exception";

const usersService = new UsersService();

const subscribeUserUpdated = async (message: Message): Promise<void> => {
  const value = JSON.parse(message.value?.toString() ?? '{}');
  const record = await usersService.getById(value.id)
    .catch(err => {
      if (err instanceof NotFoundException) {
        console.log(`User ${value.id} not exist!`);
        return;
      }

      throw err;
    });

  if (!record) {
    return;
  }

  const data = {
    ...record,
    id: value.id,
    name: value.name,
    username: value.username,
    email: value.email,
    password: value.password,
    access_type: value.access_type,
    is_active: value.is_active,
    business_id: value.business_id,
    created_at: value.created_at,
    updated_at: value.updated_at,
  } as Users;

  await usersService.save(data)
    .catch(err => {
      console.log("Error on updating users", err);
    });
  console.info(`Event Notification: Successfully updated user ${data.id}.`);
};

export default subscribeUserUpdated;