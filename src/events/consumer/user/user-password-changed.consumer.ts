import UsersModel from "../../../models/users.model";
import UsersService from "../../../services/users.service";
import NotFoundException from "../../../shared/exceptions/not-found.exception";
import { EventMessageData } from "../../../shared/types/common.type";

const usersService = new UsersService();

const subscribeUserPasswordChanged = async (value: EventMessageData<UsersModel>): Promise<void> => {
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
    password: value.new_details.password,
    updated_at: value.new_details.updated_at,
  } as UsersModel;

  await usersService.save(data)
    .catch(err => {
      console.log("Error on change users password", err);
    });
  console.info(`Event Notification: Successfully changed user password ${data.id}.`);
};

export default subscribeUserPasswordChanged;