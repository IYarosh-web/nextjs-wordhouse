'use server';

import { z } from "zod";
import { sql } from '@vercel/postgres';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const ExampleSchema = z.object({
  sentence: z.string(),
});

const TagSchema = z.object({
  slug: z.string(),
});

const WordSchema = z.object({
  title: z.string(),
  examples: z.array(ExampleSchema),
  description: z.string(),
  tags: z.array(TagSchema),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
 
export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
  
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  revalidatePath("/dashboard/invoices");
  redirect('/dashboard/invoices');
}

export async function createWord(formData: FormData, userId: string) {
  const {
    title,
    examples,
    description,
    source,
    tags,
  } = WordSchema.parse({
    title: formData.get("title"),
    examples: formData.get("examples"),
    description: formData.get("description"),
    source: formData.get("source"),
    tags: formData.get("tags"),
  });

  // const savedExamples = [];
  // for (const example of examples) {
  //   const data = new FormData();

  //   data.append("sentence", example.sentence);

  //   await createExample(data);
  // }

  // const savedTags = []
  // for (const tag of tags) {
  //   const data = new FormData();

  //   data.append("title", tag.title);

  //   await createTag(data);
  // }

  // // Create word

  // // Connect word with tags

  // // Connect word with examples


  await sql`
    WITH ins_word AS (
      INSERT INTO words(
        id,
        title,
        description,
        source,
        created_at,
        updated_at,
        user_id
      )
        VALUES
      (
        gen_random_uuid (),
        ${title},
        ${description},
        ${source},
        EXTRACT(EPOCH FROM CURRENT_DATE)::BIGINT,
        EXTRACT(EPOCH FROM CURRENT_DATE)::BIGINT,
        ${userId}
      )
        ON CONFLICT DO NOTHING
        RETURNING id as word_id
    ), ins_examples AS (
      INSERT INTO examples(
        id,
        word_id,
        sentence,
        created_at
      )
        VALUES
      ${examples.map(example => `(
        gen_random_uuid (),
        SELECT word_id FROM ins_word,
        ${example.sentence},
        EXTRACT(EPOCH FROM CURRENT_DATE)::BIGINT
        ON CONFLICT DO NOTHING
      )`).join(",\n")}
    ), ins_tags AS (
      INSERT INTO tags(
        id
      )
        VALUES
      ${tags.map(tag => `(
        ${tag.slug}
      )`).join(",\n")}
      ON CONFLICT DO NOTHING
    ), ins_tags_word AS (
      INSERT INTO tagsToWords (
        id,
        word_id,
        tag_i
      )
    )
  `
}

export async function createExample(formData: FormData) {
  const {
    sentence,
  } = ExampleSchema.parse({
    sentence: formData.get("sentence"),
  });

  await sql`
    INSERT INTO examples (id, sentence, created_at)
    VALUES (gen_random_uuid (), ${sentence}, EXTRACT(EPOCH FROM CURRENT_DATE)::BIGINT)
    RETURNING id
  `;
}

export async function createTag(formData: FormData) {
  const {
    title,
  } = TagSchema.parse({
    title: formData.get("title"),
  });

  await sql`
    INSERT INTO tags (id, title)
    VALUES (gen_random_uuid (), ${title})
    RETURNING id
  `;
}

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;
 
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch {
    return {
      message: 'Database Error: Failed to Update Invoice', 
    };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  throw new Error('Failed to Delete Invoice');
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch {
    return {
      message: 'Database Error: Failed to Delete Invoice',
    };
  }
  revalidatePath('/dashboard/invoices');
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