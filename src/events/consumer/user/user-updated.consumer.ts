import { Message } from "kafkajs";
import UsersRepository from "../../../repositories/users.repository";
import Users from "../../../entities/users.entity";

const usersRepository = new UsersRepository();

const subscribeUserUpdated = async (message: Message): Promise<void> => {
  const value = JSON.parse(message.value?.toString() ?? '{}');
  const record = await usersRepository.findById(value.id);
  const data = new Users({
    ...record,
    id: value.id,
    name: value.name,
    username: value.username,
    email: value.email,
    password: value.password,
    is_active: value.is_active,
    business_id: value.business_id,
    created_at: value.created_at,
    updated_at: value.updated_at,
  });
  await usersRepository.update({
    id: value.id,
    params: data
  });
  console.info(`Event Notification: Successfully updated user ${data.id}.`);
};

export default subscribeUserUpdated;