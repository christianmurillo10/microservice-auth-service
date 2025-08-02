import OrganizationModel from "../models/organization.model";
import {
  CountArgs,
  CreateArgs,
  FindAllArgs,
  FindAllBetweenCreatedAtArgs,
  FindByApiKeyArgs,
  FindByIdArgs,
  FindByNameArgs,
  SoftDeleteArgs,
  SoftDeleteManyArgs,
  UpdateArgs
} from "../shared/types/repository.type";
import { GenericObject } from "../shared/types/common.type";

export default interface OrganizationRepository {
  findAll: (args: FindAllArgs) => Promise<OrganizationModel[]>;

  findAllBetweenCreatedAt: (args: FindAllBetweenCreatedAtArgs) => Promise<OrganizationModel[]>;

  findById: (args: FindByIdArgs<string>) => Promise<OrganizationModel | null>;

  findByName: (args: FindByNameArgs) => Promise<OrganizationModel | null>;

  findByApiKey: (args: FindByApiKeyArgs) => Promise<OrganizationModel | null>;

  create: (args: CreateArgs<OrganizationModel>) => Promise<OrganizationModel>;

  update: (args: UpdateArgs<string, OrganizationModel>) => Promise<OrganizationModel>;

  softDelete: (args: SoftDeleteArgs<string>) => Promise<OrganizationModel>;

  softDeleteMany: (args: SoftDeleteManyArgs<string>) => Promise<GenericObject>;

  count: (args?: CountArgs) => Promise<number>;
};