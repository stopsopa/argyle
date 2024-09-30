import { PaymentsType } from "../model/payments";

import { NlpReturnType } from "../modules/nlp";

export type SearchRequest = {
  query: string;
  debug: boolean;
};

export type SearchResponse = {
  error: string | null;
  results: PaymentsType[];
  nlp: NlpReturnType;
  query: string | null;
};
