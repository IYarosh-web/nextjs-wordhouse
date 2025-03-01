import { fetchWord } from "../lib/data";
import WordModal from "../ui/dashboard/word-modal";


type Props = {
  searchParams: Record<string, string> | null | undefined;
};

async function DashboardPage({ searchParams }: Props) {
  const wordId = searchParams?.word || "";
  const word = await fetchWord(wordId);
  return (
    <div>
      <h1>Dashboard page</h1>
      {wordId && word && <WordModal word={word} />}
    </div>
  )
}

export default DashboardPage;
