export function parsePagination(searchParams: URLSearchParams) {
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("page_size") || "20", 10);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  return { page, pageSize, from, to };
}

export function sanitizeLike(value: string) {
  return value.replace(/%/g, "\\%").replace(/_/g, "\\_");
}

