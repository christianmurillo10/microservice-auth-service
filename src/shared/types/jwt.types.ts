type AuthData = {
  id: string,
  last_login_at: string,
  name: string,
  username: string,
  email: string,
  image_path: string,
  is_role_based_access: number
};

export type JwtParams = {
  id: string,
  type: string,
  expiresIn: string,
  data: object
};

export type JWT = {
  id: string,
  type: string,
  data: AuthData,
  iat: number,
  exp: number
};