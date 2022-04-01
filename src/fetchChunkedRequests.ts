const noop = (): void => { };

const delayForEachChunk = (delay: number): Promise<void> => new Promise(resolve => setTimeout(() => resolve(), delay));

enum ChunkDefaults {
  CHUNK_SIZE = 10,
  CHUNK_DELAY = 1_000,
}

type Tnoop = () => void;

type TResolve = (value?: unknown) => void;

interface IFetchChunkedRequestsParams {
  listOfPayloads: any[];
  chunkSize?: number;
  chunkDelay?: number;
  fetcher?: (payload: any) => Promise<any>;
  transformChunkends?: (chunkends: any) => any;
  transformResponse?: (response: any) => any;
  onChunkHasFetched?: (currentsChunks: any) => void;
  onChunkedRequestsFinish?: (chunkEnd: any) => void;
}

export const fetchChunkedRequests = async ({
  listOfPayloads,
  chunkSize = ChunkDefaults.CHUNK_SIZE,
  chunkDelay = ChunkDefaults.CHUNK_DELAY,
  fetcher = () => Promise.resolve(),
  transformChunkends = (chunkends: any) => chunkends,
  transformResponse = (response: any) => response,
  onChunkHasFetched = noop,
  onChunkedRequestsFinish = noop,
}: IFetchChunkedRequestsParams) => {
  let payloadsFetcheds: any[] = [];
  let currentChunked = 0;

  const chunkedsPayloads = listOfPayloads.reduce((acc, _, index) => {
    if (index % chunkSize === 0) {
      const chunked = listOfPayloads.slice(index, index + chunkSize);
      return [...acc, chunked];
    }
    return acc;
  }, []);

  const LIMIT = chunkedsPayloads.length - 1;

  const fetchCurrentChunkedRequests = async (fetchNextChunk: (resolve: TResolve) => void, resolveNextChunk: TResolve) => {
    // Transform chunked payloads and invoke fetcher
    const payloadsToFetch = transformChunkends(chunkedsPayloads[currentChunked]).map(fetcher);

    // Fetch all payloads in the current chunk
    const response = await Promise.all(payloadsToFetch);

    // If the response is not an array, it means that the API is down
    if (!response || response.length === 0 || !Array.isArray(response)) {
      return true
    }


    // Transform the response
    const transformedData = transformResponse(response);

    // Delay for each chunk, this is for server timeout
    await delayForEachChunk(chunkDelay);

    payloadsFetcheds = [...payloadsFetcheds, ...transformedData];

    onChunkHasFetched(payloadsFetcheds);


    // Call next chunk
    if (currentChunked < LIMIT) {
      // If the current chunk is the last chunk, resolve the promise
      currentChunked++;
      fetchNextChunk(resolveNextChunk)
      return false;
    }

    // Finish
    return true;
  }

  let resolveAllRequest: TResolve;

  const fetchAllChunkedsRequests = (currentResolve?: Tnoop, initialization: boolean = false) => new Promise(async (resolve) => {
    if (initialization) resolveAllRequest = resolve;

    const hasFinish = await fetchCurrentChunkedRequests(fetchAllChunkedsRequests, resolve);

    if (hasFinish && currentResolve) {
      resolveAllRequest();
      currentResolve();
    }
  })

  await fetchAllChunkedsRequests(undefined, true);

  onChunkedRequestsFinish(payloadsFetcheds);

  return payloadsFetcheds;
}
