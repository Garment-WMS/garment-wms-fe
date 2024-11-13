export enum HTTP_MESSAGE {
  UNAUTHORIZED = 'Unauthorized',
  EXPIRED = 'Token expired',
  INVALID_TOKEN = 'Invalid Token!',
  INVALID_PW = 'Password not match',
  INVALID_EMAIL = 'Email not found',
}

export enum HTTP_STATUS_CODE {
  OK = 200,
  CREATED = 201,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}
