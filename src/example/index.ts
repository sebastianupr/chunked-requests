import axios from 'axios'
import fetchChunkedRequests from '../fetch-chunked-requests'
import { LIST_OF_PAYLOADS } from './payload'

type Post = {
  userId: number
  id: number
  title: string
  body: string
}

const fetcher = async ({ id }: (typeof LIST_OF_PAYLOADS)['0']) => {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  )
  return response.data as Post[]
}

const example = async () => {
  try {
    console.log('Running example... 🚀')

    const allDataFetched = await fetchChunkedRequests({
      listOfPayloads: LIST_OF_PAYLOADS,
      chunkSize: 10,
      chunkDelay: 1000,
      fetcher,
      transformData: (chunks) =>
        chunks.filter(({ id }) => typeof id === 'number'),
      transformResponse: (response) => response,
      onChunkHasFetched: (currentsChunks) => {
        console.log('Chunk has been fetched', currentsChunks)
      },
      onChunkedRequestsFinish: (allDataFetched) => {
        console.log('Chunked requests finished', allDataFetched)
      }
    })

    console.log('All data fetched!!! 🥳', allDataFetched)
  } catch (error) {
    console.error('Error with fetch 😢 ', error)
  }
}

example()
