export type CreateOrganizationDTO = {
  name: string;
  logoPath?: string | null;
  isActive?: boolean;
};

export type UpdateOrganizationDTO = Partial<CreateOrganizationDTO>;
