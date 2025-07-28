export const businessSubsets = {
  id: true,
  name: true,
  apiKey: true,
  domain: true,
  logoPath: true,
  preferredTimezone: true,
  currency: true,
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
  businessId: true,
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
  description: true,
  businessId: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true
};

export const permissionSubsets = {
  id: true,
  name: true,
  description: true,
  businessId: true,
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