import { IFetchChunkedRequestsParams } from './types';
declare const fetchChunkedRequests: <TPayload = any, TFetcherResponse = any>({ listOfPayloads, chunkSize, chunkDelay, fetcher, transformChunkends, transformResponse, onChunkHasFetched, onChunkedRequestsFinish }: IFetchChunkedRequestsParams<TPayload>) => Promise<any[]>;
export default fetchChunkedRequests;
