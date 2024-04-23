export type TQueryOptions<T> = {
  limit?: number;
  sort?: { [key in keyof T]?: 1 | -1 };
  page?: number;
};
