import { delayForEachChunk } from './utils'
import type { Params, Resolve, Noop } from './types'

const DEFAULT_CHUNK_SIZE = 10
const DEFAULT_CHUNK_DELAY = 1_000

const fetchChunkedRequests = async <
  TPayload,
  TTransformedData,
  TFetcherResponse,
  TTransformedResponse
>({
  listOfPayloads,
  chunkSize = DEFAULT_CHUNK_SIZE,
  chunkDelay = DEFAULT_CHUNK_DELAY,
  fetcher,
  transformData,
  transformResponse,
  onChunkHasFetched,
  onChunkedRequestsFinish
}: Params<
  TPayload,
  TTransformedData,
  TFetcherResponse,
  TTransformedResponse
>) => {
  let payloadsFetched: (Awaited<TFetcherResponse> | TTransformedResponse)[] = []
  let currentChunked: number = 0

  // Partition the list of payloads into chunks
  const chunkedPayloads: Array<TPayload[]> = listOfPayloads.reduce(
    (acc: Array<TPayload[]>, _, index: number) => {
      if (index % chunkSize === 0) {
        const chunked: TPayload[] = listOfPayloads.slice(
          index,
          index + chunkSize
        )
        return [...acc, chunked]
      }
      return acc
    },
    []
  )

  const chunkLimit = chunkedPayloads.length - 1

  const fetchCurrentChunkedRequests = async (
    fetchNextChunk: (resolve: Resolve) => void,
    resolveNextChunk: Resolve
  ) => {
    // Transform chunked payloads and invoke fetcher
    const data =
      typeof transformData === 'function'
        ? transformData(chunkedPayloads[currentChunked])
        : chunkedPayloads[currentChunked]

    const payloadsToFetch = data.map((current) => {
      if (typeof fetcher !== 'function') {
        throw new Error('Fetcher is not defined')
      }
      if (typeof current === 'undefined') {
        throw new Error('Current chunked is not defined')
      }
      return fetcher(current)
    })

    // Fetch all payloads in the current chunk
    const response = await Promise.all(payloadsToFetch)

    // If the response is not an array, throw an error
    if (!response || !Array.isArray(response)) {
      throw new Error(
        'The response is not an array, check your fetcher function and try again'
      )
    }

    // Transform the response
    const transformedData =
      typeof transformResponse === 'function'
        ? transformResponse(response)
        : response

    // Delay for each chunk, this is for server timeout
    if (typeof chunkDelay !== 'number') {
      await delayForEachChunk(chunkDelay)
    }

    payloadsFetched = [...payloadsFetched, ...transformedData]

    onChunkHasFetched?.(payloadsFetched)

    // Call next chunk
    if (currentChunked < chunkLimit) {
      // If the current chunk is the last chunk, resolve the promise
      currentChunked++
      fetchNextChunk(resolveNextChunk)
      return false
    }

    // Finish
    return true
  }

  let resolveAllRequest: Resolve

  const fetchAllChunksRequests = (
    currentResolve?: Noop,
    initialization: boolean = false
  ) =>
    // eslint-disable-next-line no-async-promise-executor
    new Promise(async (resolve, reject) => {
      try {
        if (initialization) resolveAllRequest = resolve

        const hasFinish = await fetchCurrentChunkedRequests(
          fetchAllChunksRequests,
          resolve
        )
        if (hasFinish && currentResolve) {
          resolveAllRequest()
          currentResolve()
        }
      } catch (error) {
        reject(new Error(error))
      }
    })

  await fetchAllChunksRequests(undefined, true)

  onChunkedRequestsFinish?.(payloadsFetched)

  return payloadsFetched
}

export default fetchChunkedRequests
