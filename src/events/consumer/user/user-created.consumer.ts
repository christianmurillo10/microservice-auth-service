import { Message } from "kafkajs";
import UsersRepository from "../../../repositories/users.repository";
import Users from "../../../entities/users.entity";

const usersRepository = new UsersRepository();

const subscribeUserCreated = async (message: Message): Promise<void> => {
  const value = JSON.parse(message.value?.toString() ?? '{}');
  const data = new Users({
    id: value.id,
    name: value.name,
    username: value.username,
    email: value.email,
    password: value.password,
    access_type: value.access_type,
    business_id: value.business_id,
    is_active: value.is_active,
    created_at: value.created_at,
    updated_at: value.updated_at,
  });
  await usersRepository.create({ params: data });
  console.info(`Event Notification: Successfully created user ${data.id}.`);
};

export default subscribeUserCreated;