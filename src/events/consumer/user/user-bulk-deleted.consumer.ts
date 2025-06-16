import UsersModel from "../../../models/users.model";
import UsersService from "../../../services/users.service";
import NotFoundException from "../../../shared/exceptions/not-found.exception";
import { EventMessageData } from "../../../shared/types/common.type";

const usersService = new UsersService();

const subscribeUserBulkDeleted = async (value: EventMessageData<Record<string, string[]>>): Promise<void> => {
  const userIds = value.new_details.ids!;

  for (const userId of userIds) {
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
      deleted_at: new Date()
    });
    await usersService.save(user)
      .catch(err => {
        console.log("Error on deleting users", err);
      });
  }

  console.info("Event Notification: Successfully bulk deleted users.");
};

export default subscribeUserBulkDeleted;