import axios from 'axios';
import { fetchChunkedRequests } from '../fetchChunkedRequests';
import { LIST_OF_PAYLOADS } from './payload';

// Example:
const example = async () => {
  try {
    const allDataFetched = await fetchChunkedRequests(
      {
        listOfPayloads: LIST_OF_PAYLOADS,
        chunkSize: 10,
        chunkDelay: 1000,
        fetcher: async payload => {
          const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${payload.id}`);
          return response.data;
        },
        transformChunkends: chunkends => chunkends,
        transformResponse: response => response,
        onChunkHasFetched: currentsChunks => {
          console.log(`Chunk has been fetched`, currentsChunks);
        },
        onChunkedRequestsFinish: allDataFetched => {
          console.log(`Chunked requests finished`, allDataFetched);
        }
      }
    );

    console.log('allDataFetched', allDataFetched);
  } catch (error) {
    console.error(error);
  } finally {
    console.log('All requests have been finished');
  }
}

example();
