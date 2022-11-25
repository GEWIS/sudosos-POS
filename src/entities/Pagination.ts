export interface Paginated<T> {
  records: T[];
  _pagination: Pagination;
}

export interface Pagination {
  take: number,
  skip: number,
  count: number,
}