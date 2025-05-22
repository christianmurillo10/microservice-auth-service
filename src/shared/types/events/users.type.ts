export type TUserLoggedIn = {
  id: string,
  is_logged: boolean,
  last_logged_at: Date
};

export type TUserLoggedOut = {
  id: string,
  is_logged: boolean
};