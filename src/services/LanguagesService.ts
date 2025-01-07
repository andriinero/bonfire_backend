import LanguagesRepo from '@src/repos/LanguagesRepo';
import { PaginationOptions } from '@src/types/QueryOptions';

const getAll = async (opts: PaginationOptions) => {
  return await LanguagesRepo.getAll(opts);
};

const getOneById = async (id: string) => {
  return await LanguagesRepo.getOne(id);
};

const persistByNames = async (names: string[]) => {
  return await LanguagesRepo.persistByNames(names);
};

export default { getAll, getOneById, persistByNames } as const;
