export type CreateOrganizationDTO = {
  name: string;
  logoPath?: string | null;
  isActive?: boolean;
};

export type UpdateOrganizationDTO = Partial<CreateOrganizationDTO>;

export type OrganizationDTO = CreateOrganizationDTO & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};