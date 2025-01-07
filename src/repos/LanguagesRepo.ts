import EnvVars from '@src/constants/EnvVars';
import prisma from '@src/prisma';
import type { PaginationOptions } from '@src/types/QueryOptions';

const getAll = async (opts?: PaginationOptions) => {
  const skip = opts?.page ?? 0 * EnvVars.Bandwidth.MAX_DOCS_PER_FETCH;
  const take = opts?.limit;

  const languages = await prisma.language.findMany({ skip, take });

  return languages;
};

const getOne = async (id: string) => {
  return await prisma.language.findUnique({ where: { id } });
};

const persistByNames = async (names: string[]) => {
  const languagesCount = await prisma.language.count({
    where: { name: { in: names } },
  });

  return languagesCount === names.length;
};

const persists = async (id: string) => {
  const language = await prisma.language.findUnique({ where: { id } });

  return !!language;
};

export default {
  getAll,
  getOne,
  persistByNames,
  persists,
} as const;
