import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "../../prisma/client";
import type { Organization as OrganizationRecord } from "../../prisma/client";
import OrganizationEntity from "../../entities/organization.entity";
import OrganizationRepository from "../organization.interface";
import {
  FindAllArgs,
  FindAllByBetweenCreatedAtArgs,
  FindByIdArgs,
  FindByNameArgs,
  CreateArgs,
  UpdateArgs,
  SoftDeleteArgs,
  SoftDeleteManyArgs,
  CountArgs
} from "../../shared/types/repository.type";
import { GenericObject } from "../../shared/types/common.type";
import { parseQueryFilters, setSelectExclude } from "../../shared/helpers/common.helper";
import { organizationSubsets } from "../../shared/helpers/select-subset.helper";
import { CreateOrganizationDTO, UpdateOrganizationDTO } from "../../dtos/organization.dto";

function toEntity(organization: OrganizationRecord): OrganizationEntity {
  return new OrganizationEntity(organization);
};

export default class PrismaOrganizationRepository implements OrganizationRepository {
  private client;

  readonly logoPath = "public/images/organization/";

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.organization;
  };

  findAll = async (
    args: FindAllArgs
  ): Promise<OrganizationEntity[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findMany({
      select: {
        ...organizationSubsets,
        ...exclude
      },
      where: {
        deletedAt: null,
        ...args.condition,
        ...parseQueryFilters(args.query?.filters)
      },
      orderBy: {
        ...args.query?.sorting
      },
      take: args.query?.pageSize,
      skip: args.query?.page && args.query?.pageSize ?
        (args.query?.page - 1) * args.query?.pageSize :
        undefined
    });

    return res.map(item => toEntity(item));
  };

  findAllBetweenCreatedAt = async (
    args: FindAllByBetweenCreatedAtArgs
  ): Promise<OrganizationEntity[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const betweenCreatedAt = args.dateFrom && args.dateTo
      ? { createdAt: { gte: new Date(args.dateFrom), lte: new Date(args.dateTo) } }
      : undefined;
    const res = await this.client.findMany({
      select: {
        ...organizationSubsets,
        ...exclude
      },
      where: {
        ...args.condition,
        ...betweenCreatedAt,
      }
    });

    return res.map(item => toEntity(item));
  };

  findById = async (
    args: FindByIdArgs<string>
  ): Promise<OrganizationEntity | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...organizationSubsets,
        ...exclude
      },
      where: {
        id: args.id,
        deletedAt: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return toEntity(res);
  };

  findByName = async (
    args: FindByNameArgs
  ): Promise<OrganizationEntity | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...organizationSubsets,
        ...exclude
      },
      where: {
        name: args.name,
        deletedAt: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return toEntity(res);
  };

  create = async (
    args: CreateArgs<CreateOrganizationDTO>
  ): Promise<OrganizationEntity> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.create({
      select: {
        ...organizationSubsets,
        ...exclude
      },
      data: {
        ...args.params,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    return toEntity(data);
  };

  update = async (
    args: UpdateArgs<string, UpdateOrganizationDTO>
  ): Promise<OrganizationEntity> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...organizationSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        ...args.params,
        updatedAt: new Date(),
      }
    });

    return toEntity(data);
  };

  softDelete = async (
    args: SoftDeleteArgs<string>
  ): Promise<OrganizationEntity> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...organizationSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        deletedAt: new Date(),
      }
    });

    return toEntity(data);
  };

  softDeleteMany = async (
    args: SoftDeleteManyArgs<string>
  ): Promise<GenericObject> => {
    const data = await this.client.updateMany({
      where: {
        id: {
          in: args.ids
        }
      },
      data: {
        deletedAt: new Date(),
      }
    });

    return data;
  };

  count = async (
    args?: CountArgs
  ): Promise<number> => {
    const data = this.client.count({
      where: {
        deletedAt: null,
        ...args?.condition,
        ...parseQueryFilters(args?.query?.filters)
      }
    });

    return data;
  };
};