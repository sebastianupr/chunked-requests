import axios from 'axios'
import fetchChunkedRequests from '../fetch-chunked-requests'
import { LIST_OF_PAYLOADS } from './payload'

type TPayload = {
  id: number
}

const example = async () => {
  try {
    console.log('Runing example...')
    const fetcher = async (payload: TPayload) => {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts/${payload.id}`
      )
      return response.data
    }

    const allDataFetched = await fetchChunkedRequests<TPayload, any>({
      listOfPayloads: LIST_OF_PAYLOADS,
      chunkSize: 10,
      chunkDelay: 1000,
      fetcher,
      transformChunkends: (chunkends) =>
        chunkends.filter(({ id }) => typeof id === 'number'),
      transformResponse: (response) => response,
      onChunkHasFetched: (currentsChunks) => {
        console.log('Chunk has been fetched', currentsChunks)
      },
      onChunkedRequestsFinish: (allDataFetched) => {
        console.log('Chunked requests finished', allDataFetched)
      }
    })

    console.log('allDataFetched', allDataFetched)
  } catch (error) {
    console.error(error)
  } finally {
    console.log('All requests have been finished')
  }
}

example()
