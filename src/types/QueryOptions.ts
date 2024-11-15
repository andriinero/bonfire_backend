export type PaginationOptions = {
  limit?: number;
  page?: number;
};

export const defaultPaginationOptions: PaginationOptions = {
  limit: 25,
  page: 0,
};
