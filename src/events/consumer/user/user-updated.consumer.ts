import UsersModel from "../../../models/users.model";
import UsersService from "../../../services/users.service";
import NotFoundException from "../../../shared/exceptions/not-found.exception";
import { EventMessageData } from "../../../shared/types/common.type";

const usersService = new UsersService();

const subscribeUserUpdated = async (value: EventMessageData<UsersModel>): Promise<void> => {
  const userId = value.new_details.id!;
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

  const data = {
    ...record,
    id: value.new_details.id,
    name: value.new_details.name,
    username: value.new_details.username,
    email: value.new_details.email,
    password: value.new_details.password,
    access_type: value.new_details.access_type,
    is_active: value.new_details.is_active,
    business_id: value.new_details.business_id,
    created_at: value.new_details.created_at,
    updated_at: value.new_details.updated_at,
  } as UsersModel;

  await usersService.save(data)
    .catch(err => {
      console.log("Error on updating users", err);
    });
  console.info(`Event Notification: Successfully updated user ${data.id}.`);
};

export default subscribeUserUpdated;