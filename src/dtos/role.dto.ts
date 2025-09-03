export type CreateRoleDto = {
  name: string;
  organizationId: string;
};

export type UpdateRoleDto = Partial<CreateRoleDto>;