import _ from "lodash";
import { MESSAGE_DATA_NOT_EXIST } from "../shared/constants/message.constant";
import PrismaOrganizationRepository from "../repositories/prisma/organization.repository";
import { CreateOrganizationDTO, UpdateOrganizationDTO } from "../dtos/organization.dto";
import OrganizationEntity from "../entities/organization.entity";
import NotFoundException from "../shared/exceptions/not-found.exception";
import { CountAllArgs, GetAllArgs, GetAllBetweenCreatedAtArgs } from "../shared/types/service.type";
import { setUploadPath, uploadFile } from "../shared/helpers/upload.helper";

export default class OrganizationService {
  private repository: PrismaOrganizationRepository;

  constructor() {
    this.repository = new PrismaOrganizationRepository();
  };

  getAll = async (args?: GetAllArgs): Promise<OrganizationEntity[]> => {
    const record = await this.repository.findAll({
      condition: args?.condition,
      query: args?.query,
      exclude: ["deletedAt"]
    });

    return record;
  };

  getAllBetweenCreatedAt = async (args: GetAllBetweenCreatedAtArgs): Promise<OrganizationEntity[]> => {
    const record = await this.repository.findAllBetweenCreatedAt({
      ...args,
      exclude: ["deletedAt"]
    });

    return record;
  };

  getById = async (id: string): Promise<OrganizationEntity> => {
    const record = await this.repository.findById({
      id,
      exclude: ["deletedAt"]
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByName = async (name: string): Promise<OrganizationEntity> => {
    const record = await this.repository.findByName({
      name,
      exclude: ["deletedAt"]
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  create = async (params: CreateOrganizationDTO): Promise<OrganizationEntity> =>
    this.repository.create({
      params,
      exclude: ["deletedAt"]
    });

  update = async (id: string, params: UpdateOrganizationDTO): Promise<OrganizationEntity> => this.repository.update({
    id: id,
    params,
    exclude: ["deletedAt"]
  });

  delete = async (id: string): Promise<OrganizationEntity> => {
    const record = await this.repository.softDelete({ id: id });
    return record
  };

  deleteMany = async (ids: string[]): Promise<void> => {
    await this.repository.softDeleteMany({ ids: ids });
  };

  count = async (args: CountAllArgs): Promise<number> => {
    return await this.repository.count(args);
  };

  uploadLogo = async (file: Express.Multer.File): Promise<string> => {
    const uploadPath = setUploadPath(file, this.repository.logoPath);
    uploadFile(uploadPath, file);
    return uploadPath;
  };
};