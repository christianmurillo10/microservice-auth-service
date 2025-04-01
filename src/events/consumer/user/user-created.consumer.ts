import { Message } from "kafkajs";
import UsersRepository from "../../../repositories/users.repository";

const usersRepository = new UsersRepository();

const subscribeUserCreated = async (message: Message): Promise<void> => {
  const value = JSON.parse(message.value?.toString() ?? '{}');
  const data = {
    id: value.id,
    name: value.name,
    username: value.username,
    email: value.email,
    password: value.password,
    access_token: null,
    access_type: value.access_type,
    is_active: value.is_active,
    is_logged: value.is_logged,
    access_token_expired_at: null,
    last_logged_at: value.last_logged_at,
    created_at: value.created_at,
    updated_at: value.updated_at,
    deleted_at: null
  }
  await usersRepository.create({ params: data });
  console.info(`Event Notification: Successfully created user ${data.id}.`);
};

export default subscribeUserCreated;