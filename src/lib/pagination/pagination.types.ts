export type PageResult<T> = {
  items: T[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export type PageResponseDto<T> = {
  content: T[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  last: boolean
}

export function mapPageResult<TDto, TDomain>(
  page: PageResponseDto<TDto>,
  mapper: (item: TDto) => TDomain,
): PageResult<TDomain> {
  return {
    items: page.content.map(mapper),
    page: page.pageNumber,
    pageSize: page.pageSize,
    totalItems: page.totalElements,
    totalPages: page.totalPages,
    hasNext: !page.last,
    hasPrevious: page.pageNumber > 0,
  }
}
