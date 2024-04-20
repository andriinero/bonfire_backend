export type TQueryOptions = {
  limit?: number;
  select?: string;
  populate?: { path: string; select: string };
};

export const DEFAULT_QUERY_OPTS: Readonly<TQueryOptions> = {
  limit: 25,
  select: '',
  populate: { path: '', select: '' },
};
