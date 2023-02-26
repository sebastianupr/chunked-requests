# Chunked requests library for JavaScript (Node and Browser)

Make easily chunked requests to a server.

## Description

This library allows you to make chunked requests to a server. It is useful when you want to send a large amount of data to a server, but you don't want to send it all at once. This library will send the data in chunks, and the server will receive the data in chunks.

## Installation

```bash
npm install chunked-request
```

## Usage

```javascript
const fetcher = async ({ id }) => {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  )
  return response.data
}

const request = async () => {
  try {
    const allDataFetched = await fetchChunkedRequests({
      listOfPayloads: Array.from({ length: 100 }, (_, index) => ({ id: index + 1 })),
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

request()
```

## API

### fetchChunkedRequests

```javascript
fetchChunkedRequests({
  listOfPayloads,
  chunkSize,
  chunkDelay,
  fetcher,
  transformData,
  transformResponse,
  onChunkHasFetched,
  onChunkedRequestsFinish
})
```

#### listOfPayloads

Type: `Array`

The list of payloads to send to the server.

#### chunkSize

Type: `Number`

The size of each chunk.

#### chunkDelay

Type: `Number`

The delay between each chunk.

#### fetcher

Type: `Function`

The function that will be called to fetch the data. It receives the payload as a parameter.

#### transformData

Type: `Function`

The function that will be called to transform the data before sending it to the server. It receives the chunk as a parameter.

#### transformResponse

Type: `Function`

The function that will be called to transform the response from the server. It receives the response as a parameter.

#### onChunkHasFetched

Type: `Function`

The function that will be called when a chunk has been fetched. It receives the current chunks as a parameter.

#### onChunkedRequestsFinish

Type: `Function`

The function that will be called when all the chunks have been fetched. It receives the all data fetched as a parameter.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Author

Sebastián Urbano - [LinkedIn](https://www.linkedin.com/in/sebastianupr/)

## License

MIT License

Copyright (c) 2023 Sebastián Urbano
