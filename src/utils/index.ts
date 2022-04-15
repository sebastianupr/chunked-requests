export const noop = (): void => {}

export const delayForEachChunk = (delay: number): Promise<void> => new Promise(resolve => setTimeout(() => resolve(), delay))
