export type Noop = () => void

export type Resolve = (value?: unknown) => void

export type FetchChunkedRequestsParams<
  TPayload,
  TTransformedData,
  TFetcherResponse,
  TTransformedResponse
> = {
  listOfPayloads: TPayload[]
  chunkSize?: number
  chunkDelay?: number
  transformData?: (chunk: TPayload[]) => TTransformedData[]
  fetcher: (payload: TPayload | TTransformedData) => Promise<TFetcherResponse>
  transformResponse?: (
    response: Awaited<TFetcherResponse>[]
  ) => TTransformedResponse[]
  onChunkHasFetched?: (
    currentsChunks: (TTransformedResponse | Awaited<TFetcherResponse>)[]
  ) => void
  onChunkedRequestsFinish?: (
    chunkEnd: (TTransformedResponse | Awaited<TFetcherResponse>)[]
  ) => void
}
