import {Redis} from "ioredis";


export const getItemIndex = async (
    key: string,
    item: string,
    redis: Redis,
    chunkSize = 100
  ) => {
   
    const totalLength = await redis.llen(key);
  
    if (totalLength === 0) return -1; 
  
    let start = 0;
  
    while (true) {
     
      const chunk = await redis.lrange(key, start, start + chunkSize - 1);
  
      if (chunk.length === 0) break; 
  
      const indexInChunk = chunk.indexOf(item);
      if (indexInChunk !== -1) {
        const leftIndex = start + indexInChunk;
        return totalLength - 1 - leftIndex;
      }
  
      
      start += chunkSize;
    }
  
    return -1; 
  };
  
  
  