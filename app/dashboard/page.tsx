import { fetchAllExamples, fetchAllTags, fetchAllWords } from "../lib/data";
import Form from "../ui/words/create-form";

async function DashboardPage() {
  const words = await fetchAllWords();
  const tags = await fetchAllTags();
  const examples = await fetchAllExamples();
  console.log({ words, tags, examples });

  return (
    <div>
      <h1>Dashboard page</h1>
      <Form />
    </div>
  )
}

export default DashboardPage;
