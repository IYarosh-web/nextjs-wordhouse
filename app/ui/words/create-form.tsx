'use client';

import { createWord, State } from "@/app/lib/actions";
import { useActionState } from "react";
import { Button } from "../button";
import { Input } from "@/src/shared/ui/input";

export default function Form() {
  const initialState: State = { message: null, errors: {} };
  const userId = "410544b2-4001-4271-9855-fec4b6a6442a";

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
          <Input
            id="title"
            name="title"
            placeholder="Title"
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
        <label htmlFor="translations" className="mb-2 block text-sm font-medium">
          Translation
        </label>
        <Input
          id="translation"
          name="translations"
          placeholder="Translation"
        />
      </div>
      <div id="translation-error" aria-live="polite" aria-atomic="true">
        {state?.errors?.description &&
          state.errors.description.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <label htmlFor="description" className="mb-2 block text-sm font-medium">
          Description
        </label>
        <Input
          id="description"
          name="description"
          placeholder="Description"
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