type AuthData = {
  id: string,
  last_logged_at: string,
  name: string,
  username: string,
  email: string,
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