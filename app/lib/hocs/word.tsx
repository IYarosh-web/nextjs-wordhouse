import { JSX } from "react";
import { fetchWord } from "../data";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function WordHOC(Component: any, wordId: string) {
  const word = await fetchWord(wordId);

  // eslint-disable-next-line react/display-name
  return (props: JSX.IntrinsicAttributes) => <Component {...props} word={word} />
}