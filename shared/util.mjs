import { open } from 'node:fs/promises';

export const readInput = async (filePath="input.data") =>{
    const inputFile = await open(filePath)
    const result = await inputFile.readFile({encoding:"utf8"})
    await inputFile.close();
    return result;
}
