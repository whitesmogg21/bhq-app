export function paginationUtil<T>(array: T[], itemsPerPage: number): T[][] {
    if (!Array.isArray(array) || typeof itemsPerPage !== "number" || itemsPerPage <= 0) {
        return [];
    }
    
    const paginatedArray: T[][] = [];
    for (let i = 0; i < array.length; i += itemsPerPage) {
        paginatedArray.push(array.slice(i, i + itemsPerPage));
    }

    return paginatedArray;
}
