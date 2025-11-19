import { HttpClient } from "../../../application/ports/http/http-client.interface";
import { CategoryEntity } from "../../../domain/entities/category.entity";
import { BaseApiRepository } from "./base-api.repository";

interface CategoryDto {
  id: number;
  name: string;
}

export class CategoryRepository extends BaseApiRepository<
  CategoryEntity,
  CategoryDto
> {
  constructor(api: HttpClient) {
    super(api, "/categories");
  }

  protected toDomain(dto: CategoryDto): CategoryEntity {
    return CategoryEntity.from(dto);
  }

  protected toDto(entity: CategoryEntity): CategoryDto {
    return {
      id: entity.id,
      name: entity.name,
    };
  }

  public async findByName(name: string): Promise<CategoryEntity | undefined> {
    const res = await this.apiClient.get<CategoryDto[]>(this.basePath, {
      params: { name },
    });
    return res.data?.[0];
  }
}
