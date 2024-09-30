import { PaymentsType } from "../model/payments";

export type SearchRequest = {
  query: string;
  debug: boolean;
};

export type SearchResponse = {
  error: string | null;
  results: PaymentsType[];
};
