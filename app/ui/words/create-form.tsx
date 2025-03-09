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
            aria-describedby="title-error"
          />
        </div>
        <div id="title-error" aria-live="polite" aria-atomic="true">
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
      <div id="description-error" aria-live="polite" aria-atomic="true">
        {state?.errors?.description &&
          state.errors.description.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
      <Button type="submit">Add word</Button>
    </form>
  )
}