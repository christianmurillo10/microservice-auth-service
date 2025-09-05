import OrganizationEntity from "../entities/organization.entity";
import {
  CountArgs,
  CreateArgs,
  FindAllArgs,
  FindAllByBetweenCreatedAtArgs,
  FindByIdArgs,
  FindByNameArgs,
  SoftDeleteArgs,
  SoftDeleteManyArgs,
  UpdateArgs
} from "../shared/types/repository.type";
import { GenericObject } from "../shared/types/common.type";
import { CreateOrganizationDTO, UpdateOrganizationDTO } from "../dtos/organization.dto";

export default interface OrganizationRepository {
  findAll: (args: FindAllArgs) => Promise<OrganizationEntity[]>;

  findAllBetweenCreatedAt: (args: FindAllByBetweenCreatedAtArgs) => Promise<OrganizationEntity[]>;

  findById: (args: FindByIdArgs<string>) => Promise<OrganizationEntity | null>;

  findByName: (args: FindByNameArgs) => Promise<OrganizationEntity | null>;

  create: (args: CreateArgs<CreateOrganizationDTO>) => Promise<OrganizationEntity>;

  update: (args: UpdateArgs<string, UpdateOrganizationDTO>) => Promise<OrganizationEntity>;

  softDelete: (args: SoftDeleteArgs<string>) => Promise<OrganizationEntity>;

  softDeleteMany: (args: SoftDeleteManyArgs<string>) => Promise<GenericObject>;

  count: (args?: CountArgs) => Promise<number>;
};