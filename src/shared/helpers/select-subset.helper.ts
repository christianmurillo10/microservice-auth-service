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