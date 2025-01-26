'use client';

import { createWord, State } from "@/app/lib/actions";
import { useActionState } from "react";
import { Button } from "../button";

export default function Form() {
  const initialState: State = { message: null, errors: {} };
  const userId = "1";

  const [state, formAction] = useActionState(
    createWord.bind(null, userId),
    initialState
  );

  console.log({ state });

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <label htmlFor="title" className="mb-2 block text-sm font-medium">
          Word
        </label>
        <div className="relative">
          <input
            id="title"
            name="title"
            placeholder="Title"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10"
            // aria-describedby="word-error"
          />
        </div>
        <div id="word-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.title &&
            state.errors.title.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <label htmlFor="description" className="mb-2 block text-sm font-medium">
          Description
        </label>
        <input
          id="description"
          name="description"
          placeholder="Description"
          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10"
        />
      </div>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <label htmlFor="source" className="mb-2 block text-sm font-medium">
          Description
        </label>
        <input
          id="source"
          name="source"
          placeholder="Source"
          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10"
        />
      </div>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <label htmlFor="examples[0]" className="mb-2 block text-sm font-medium">
          Description
        </label>
        <input
          id="examples[0]"
          name="examples"
          placeholder="Example 1"
          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10"
        />
        <input
          id="examples[1]"
          name="examples"
          placeholder="Example 2"
          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10"
        />
      </div>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <label htmlFor="tags[0]" className="mb-2 block text-sm font-medium">
          Description
        </label>
        <input
          id="tags[0]"
          name="tags"
          placeholder="Tag 1"
          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10"
        />
        <input
          id="tags[1]"
          name="tags"
          placeholder="Tag"
          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10"
        />
      </div>
      <Button type="submit">Add word</Button>
    </form>
  )
}