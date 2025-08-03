export const organizationSubsets = {
  id: true,
  name: true,
  logoPath: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true
};

export const userSubsets = {
  id: true,
  name: true,
  username: true,
  email: true,
  password: true,
  accessType: true,
  organizationId: true,
  isActive: true,
  isLogged: true,
  lastLoggedAt: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true
};

export const sessionSubsets = {
  id: true,
  accessType: true,
  accessToken: true,
  refreshToken: true,
  userId: true,
  refreshTokenExpiresAt: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true
};

export const roleSubsets = {
  id: true,
  name: true,
  organizationId: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true
};

export const permissionSubsets = {
  id: true,
  action: true,
  resource: true,
  organizationId: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true
};

export const userRoleSubsets = {
  id: true,
  userId: true,
  roleId: true,
  assignedAt: true
};

export const rolePermissionSubsets = {
  id: true,
  roleId: true,
  permissionId: true,
  grantedAt: true
};

export const userPermissionSubsets = {
  id: true,
  userId: true,
  permissionId: true,
  grantedAt: true
};