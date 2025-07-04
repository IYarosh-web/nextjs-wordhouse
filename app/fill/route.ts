import { db } from '@vercel/postgres';
import { users, words } from '../lib/placeholder-data';

const client = await db.connect();

async function fillWords() {
  const result = await Promise.all(
    words.map(word => 
      client.sql`
        INSERT INTO words (id, title, translations, description, source, created_at, updated_at, user_id)
        VALUES (gen_random_uuid (), ${word.title}, ${JSON.stringify(word.translations)}, ${word.description}, ${word.source}, ${word.updated_at}, ${word.created_at}, ${word.user_id})
        ON CONFLICT (id) DO NOTHING
      `
    )
  );

  return result;
}

async function fillUsers() {
  const result = await Promise.all(
    users.map(user => 
      client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (gen_random_uuid (), ${user.id}, ${JSON.stringify(user.name)}, ${user.email}, ${user.password})
        ON CONFLICT (id) DO NOTHING
      `
    )
  );

  return result;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const entity = url.searchParams.get('entity');

  switch (entity) {
    case 'words':
      await fillWords();
      return Response.json({ message: "Words has been filled" }, { status: 200 });
    case 'users':
      await fillUsers();
      return Response.json({ message: "Users has been filled" }, { status: 200 });
    default:
      return Response.json({ error: "Unknown entity" }, { status: 400 });
  }
}