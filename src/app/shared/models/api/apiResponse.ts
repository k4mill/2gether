/*
    This file was NOT automatically generated and will NOT be overwritten.
*/

export type ApiResponse<T> = T extends any[]
  ? ApiResponsePaginated<T>
  : ApiResponseSingle<T>;

export interface ApiResponseSingle<T> {
  data: T;
  message: string;
  statusCode: number;
}

export interface ApiResponsePaginated<T> extends ApiResponseSingle<T> {
  total: number;
}
