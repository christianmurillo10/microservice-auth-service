import { Message } from "kafkajs";
import UsersModel from "../../../models/users.model";
import UsersService from "../../../services/users.service";

const usersService = new UsersService();

const subscribeUserCreated = async (message: Message): Promise<void> => {
  const value = JSON.parse(message.value?.toString() ?? '{}');
  const data = {
    id: value.new_details.id,
    name: value.new_details.name,
    username: value.new_details.username,
    email: value.new_details.email,
    password: value.new_details.password,
    access_type: value.new_details.access_type,
    business_id: value.new_details.business_id,
    is_active: value.new_details.is_active,
    created_at: value.new_details.created_at,
    updated_at: value.new_details.updated_at,
  } as UsersModel;

  await usersService.save(data)
    .catch(err => {
      console.log("Error on creating users", err);
    });
  console.info(`Event Notification: Successfully created user ${data.id}.`);
};

export default subscribeUserCreated;