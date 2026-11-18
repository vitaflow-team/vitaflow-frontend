/** A page link or the gap ("…") between two non-adjacent links. */
export type PaginationItem = { kind: 'page'; page: number } | { kind: 'gap' };
