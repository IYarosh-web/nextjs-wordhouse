import { fetchWord } from "../lib/data";
import AddWordModal from "../ui/words/add-word-modal";
import ViewWordModal from "../ui/words/view-word-modal";

type Props = {
  searchParams: Record<string, string> | null | undefined;
};

async function DashboardPage({ searchParams }: Props) {
  const wordId = searchParams?.word || "";
  const newWord = (searchParams || {})['new-word'] || "";
  const word = await fetchWord(wordId);
  return (
    <div>
      <h1>Dashboard page</h1>
      {wordId && word && <ViewWordModal word={word} />}
      {newWord && <AddWordModal />}
    </div>
  )
}

export default DashboardPage;
