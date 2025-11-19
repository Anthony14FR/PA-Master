export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages?: number;
}

export class PaginatedViewModel {
    static map<TEntity, TViewModel>(
        paginatedEntity: PaginatedResult<TEntity>,
        mapper: (entity: TEntity) => TViewModel
    ): PaginatedResult<TViewModel> {
        return {
            items: paginatedEntity.items.map(mapper),
            total: paginatedEntity.total,
            page: paginatedEntity.page,
            pageSize: paginatedEntity.pageSize,
            totalPages: Math.ceil(paginatedEntity.total / paginatedEntity.pageSize)
        };
    }
}