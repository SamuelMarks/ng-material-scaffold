export interface ILoginResp {
  access_token: string;
}

export interface IAuthReq {
  username: string;
  password: string;
  grant_type?: string;
}
