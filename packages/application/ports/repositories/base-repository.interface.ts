export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface BaseRepository<T> {
  exists(id: string): Promise<boolean>;
  findById(id: string): Promise<T | undefined>;
  findAll(page?: number, pageSize?: number): Promise<PaginatedResult<T>>;
  save(entity: T): Promise<void>;
  update(id: string, entity: Partial<T>): Promise<void>;
  delete(id: string): Promise<void>;
}