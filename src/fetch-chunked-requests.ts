import { noop, delayForEachChunk } from './utils'
import { IFetchChunkedRequestsParams } from './types'
import type { TResolve, Tnoop } from './types'

const DEFAULT_CHUNK_SIZE = 10
const DEFAULT_CHUNK_DELAY = 1_000

const fetchChunkedRequests = async <TPayload = any, TFetcherResponse = any>({
  listOfPayloads,
  chunkSize = DEFAULT_CHUNK_SIZE,
  chunkDelay = DEFAULT_CHUNK_DELAY,
  fetcher,
  transformChunkends,
  transformResponse,
  onChunkHasFetched = noop,
  onChunkedRequestsFinish = noop
}: IFetchChunkedRequestsParams<TPayload>) => {
  let payloadsFetcheds: any[] = []
  let currentChunked: number = 0

  // Parition the list of payloads into chunks
  const chunkedsPayloads: Array<TPayload[]> = listOfPayloads.reduce(
    (acc: Array<TPayload[]>, _, index: number) => {
      if (index % chunkSize === 0) {
        const chunked: TPayload[] = listOfPayloads.slice(
          index,
          index + chunkSize
        )
        return [...acc, chunked]
      }
      return [...acc]
    },
    []
  )

  const LIMIT = chunkedsPayloads.length - 1

  const fetchCurrentChunkedRequests = async (
    fetchNextChunk: (resolve: TResolve) => void,
    resolveNextChunk: TResolve
  ) => {
    // Transform chunked payloads and invoke fetcher
    const transformedChunkends =
      typeof transformChunkends === 'function'
        ? transformChunkends(chunkedsPayloads[currentChunked])
        : chunkedsPayloads[currentChunked]

    const payloadsToFetch = transformedChunkends.map((current) => {
      if (typeof fetcher !== 'function') {
        throw new Error('Fetcher is not defined')
      }
      if (typeof current === 'undefined') {
        throw new Error('Current chunked is not defined')
      }
      return fetcher<TFetcherResponse>(current)
    })

    // Fetch all payloads in the current chunk
    const response = await Promise.all(payloadsToFetch)

    // If the response is not an array, it means that the API is down
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
    await delayForEachChunk(chunkDelay)

    payloadsFetcheds = [...payloadsFetcheds, ...transformedData]

    onChunkHasFetched(payloadsFetcheds)

    // Call next chunk
    if (currentChunked < LIMIT) {
      // If the current chunk is the last chunk, resolve the promise
      currentChunked++
      fetchNextChunk(resolveNextChunk)
      return false
    }

    // Finish
    return true
  }

  let resolveAllRequest: TResolve

  const fetchAllChunkedsRequests = (
    currentResolve?: Tnoop,
    initialization: boolean = false
  ) =>
    // eslint-disable-next-line no-async-promise-executor
    new Promise(async (resolve) => {
      if (initialization) resolveAllRequest = resolve

      const hasFinish = await fetchCurrentChunkedRequests(
        fetchAllChunkedsRequests,
        resolve
      )
      if (hasFinish && currentResolve) {
        resolveAllRequest()
        currentResolve()
      }
    })

  await fetchAllChunkedsRequests(undefined, true)

  onChunkedRequestsFinish(payloadsFetcheds)

  return payloadsFetcheds
}

export default fetchChunkedRequests
