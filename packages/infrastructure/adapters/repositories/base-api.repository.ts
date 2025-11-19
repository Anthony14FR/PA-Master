import { HttpClient } from "../../../application/ports/http/http-client.interface";
import {
  BaseRepository,
  PaginatedResult,
} from "../../../application/ports/repositories/base-repository.interface";

export abstract class BaseApiRepository<TEntity, TDto = any>
  implements BaseRepository<TEntity>
{
  constructor(
    protected readonly apiClient: HttpClient,
    protected readonly basePath: string
  ) {}

  protected abstract toDomain(dto: TDto): TEntity;
  protected abstract toDto(entity: TEntity): Omit<TDto, "id">;

  async exists(id: string): Promise<boolean> {
    try {
      const entity = await this.findById(id);
      return !!entity;
    } catch {
      return false;
    }
  }

  async findById(id: string): Promise<TEntity | undefined> {
    try {
      const res = await this.apiClient.get<TDto>(`${this.basePath}/${id}`);

      if (!res.data) return undefined;

      return this.toDomain(res.data);
    } catch (error: any) {
      if (error.status === 404) return undefined;
      throw error;
    }
  }

  async findAll(
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResult<TEntity>> {
    const res = await this.apiClient.get<{ items: TDto[]; total: number }>(
      this.basePath,
      { page, pageSize }
    );

    if (!res.data) {
      return { items: [], total: 0, page, pageSize };
    }

    return {
      items: res.data.items.map((dto) => this.toDomain(dto)),
      total: res.data.total,
      page,
      pageSize,
    };
  }

  async save(entity: TEntity): Promise<void> {
    const dto = this.toDto(entity);
    await this.apiClient.post<TDto>(this.basePath, dto);
  }

  async update(id: string, entity: Partial<TEntity>): Promise<void> {
    await this.apiClient.put(`${this.basePath}/${id}`, entity);
  }

  async delete(id: string): Promise<void> {
    await this.apiClient.delete(`${this.basePath}/${id}`);
  }
}
