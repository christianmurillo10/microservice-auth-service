export type CreateRoleDTO = {
  name: string;
  organizationId: string;
};

export type UpdateRoleDTO = Partial<CreateRoleDTO>;