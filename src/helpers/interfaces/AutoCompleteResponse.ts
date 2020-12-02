export interface Datum {
  name: string;
}

export interface Pagination {
  count: number;
  offset: number;
}

export interface Meta {
  status: number;
  msg: string;
  response_id: string;
}

export interface AutoCompleteResponse {
  data: Datum[];
  pagination: Pagination;
  meta: Meta;
}
