import { MESSAGE_DATA_NOT_EXIST } from "../shared/constants/message.constant";
import AccessTypesRepository from "../shared/repositories/access-types.repository";
import AccessTypes from "../shared/entities/access-types.entity";
import NotFoundException from "../shared/exceptions/not-found.exception";
import { CountAllArgs, GetAllArgs } from "../shared/types/service.type";
import { formatToUpperUnderscore } from "../shared/helpers/common.helper";

export default class AccessTypesService {
  private repository: AccessTypesRepository;

  constructor() {
    this.repository = new AccessTypesRepository();
  };

  getAll = async (args?: GetAllArgs): Promise<AccessTypes[]> => {
    const record = await this.repository.findAll({
      condition: args?.condition,
      query: args?.query,
      exclude: ["deleted_at"]
    });

    return record;
  };

  getById = async (id: string): Promise<AccessTypes> => {
    const record = await this.repository.findById({ id: id });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByName = async (name: string): Promise<AccessTypes> => {
    const record = await this.repository.findByName({ name: name });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  save = async (data: AccessTypes): Promise<AccessTypes> => {
    let record: AccessTypes;
    let newData = new AccessTypes(data);
    let option = {
      params: newData,
      exclude: ["deleted_at"]
    };

    if (data.id) {
      // Update
      record = await this.repository.update({
        id: data.id,
        ...option
      });
    } else {
      // Create
      option.params.id = formatToUpperUnderscore(data.name);
      record = await this.repository.create(option);
    }

    return record;
  };

  delete = async (id: string): Promise<AccessTypes> => {
    return await this.repository.softDelete({ id: id });
  };

  deleteMany = async (ids: string[]): Promise<void> => {
    this.repository.softDeleteMany({ ids: ids });
  };

  count = async (args: CountAllArgs): Promise<number> => {
    return await this.repository.count(args);
  };
};