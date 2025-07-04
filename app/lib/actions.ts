'use server';

import { z } from "zod";
import { sql } from '@vercel/postgres';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const WordSchema = z.object({
  title: z.string(),
  description: z.string(),
  translations: z.string(),
});

export type State = {
  errors?: {
    title?: string[];
    description?: string[];
    translations?: string[];
  };
  message?: string | null;
};

export async function createWord(
  userId: string,
  prevState: State,
  formData: FormData,
) {

  const validatedFields = WordSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    translations: formData.get('translations'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields. Failed to create word",
    };
  }

  const {
    title,
    description,
    translations,
  } = validatedFields.data;

  const created = new Date();

  try {
    await sql`
      INSERT INTO words (
        id,
        title,
        description,
        translations,
        created_at,
        updated_at,
        user_id
      ) VALUES (
        gen_random_uuid(),
        ${title},
        ${description},
        ${translations},
        ${created.toISOString()},
        ${created.toISOString()},
        ${userId}
      )
        ON CONFLICT DO NOTHING
    `;
  } catch (err) {
    console.log("Err", err);
    return {
      message: `Database error: Failed to create word: ${err}`
    }
  }

  revalidatePath("/dashboard/invoices");
  redirect('/dashboard/invoices');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}