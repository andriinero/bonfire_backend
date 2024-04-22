type TOptions = {
  limit: number;
  select: string;
  populate: { path: string; select: string };
};

export type TParticipantsQueryOptions = {
  populate: { path: 'participants'; select: '-password' };
  select: 'participants';
};

export type TQueryOptions = Partial<TOptions>;

export const DEFAULT_QUERY_OPTS: Readonly<TQueryOptions> = {
  limit: 25,
  select: '',
  populate: { path: '', select: '' },
};
