export type CreatePermissionDTO = {
  action: string;
  resource: string;
  organizationId: string;
};

export type UpdatePermissionDTO = Partial<CreatePermissionDTO>;