type PaginateOptions = { page: number, limit: number, total: number }

export const paginator = ({ page, limit, total }: PaginateOptions) => {

    const lastPage = Math.ceil(total / limit);

    return {
        total,
        lastPage,
        currentPage: page,
        perPage: limit,
        prev: page > 0 ? page - 1 : null,
        next: page < lastPage ? page + 1 : null,
    };

};