import { fetchWord } from "../data";

export async function useWord(id: string) {
  return await fetchWord(id);
}