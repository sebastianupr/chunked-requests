export declare type Tnoop = () => void;
export declare type TResolve = (value?: unknown) => void;
export interface IFetchChunkedRequestsParams<TPayload> {
    listOfPayloads: TPayload[];
    chunkSize?: number;
    chunkDelay?: number;
    fetcher: <T>(payload: TPayload) => Promise<T>;
    transformChunkends?: (chunkends: TPayload[]) => TPayload[];
    transformResponse?: (response: any) => any;
    onChunkHasFetched?: (currentsChunks: any) => void;
    onChunkedRequestsFinish?: (chunkEnd: any) => void;
}
