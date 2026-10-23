/**
 * Credentials for authentication requests.
 */
export interface AuthCredentials {
  username: string;
  password: string;
}

/**
 * OAuth token response payload.
 */
export interface AuthTokenResponse {
  access_token: string;
  refresh_token?: string;
}
