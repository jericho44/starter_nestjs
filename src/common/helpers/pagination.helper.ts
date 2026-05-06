export interface PaginationResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

export const paginate = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginationResult<T> => {
  const lastPage = Math.ceil(total / limit);
  return {
    data,
    meta: {
      total,
      page,
      lastPage,
    },
  };
};
