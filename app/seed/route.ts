import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';
import { users } from '../lib/placeholder-data';

const client = await db.connect();

async function seedWords() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS words (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      translations TEXT NOT NULL,
      description TEXT,
      source VARCHAR(255),
      created_at DATE NOT NULL,
      updated_at DATE NOT NULL,
      user_id UUID,
      CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `;

  return null
}

async function seedUsers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}


async function deleteWords() {
  await client.sql`
    DROP TABLE IF EXISTS words;
  `;
  console.log("Table words was deleted");
}

async function deleteUsers() {
  await client.sql`
    DROP TABLE IF EXISTS users
  `;
  console.log('Table users was deleted');
}

export async function GET(request: Request) {
  const params = new URL(request.url);
  const entityId = params.searchParams.get("entity");
  switch (entityId) {
    case 'words': 
      await seedWords();
      return Response.json({ message: "Words has been seeded" }, { status: 200 });
    case 'users': 
      await seedUsers();
      return Response.json({ message: "Users has been seeded" }, { status: 200 });
    default:
      return Response.json({ error: "Unknown entity" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const params = new URL(request.url);
  const entityId = params.searchParams.get("entity");
  switch (entityId) {
    case 'words':
      await deleteWords();
      return Response.json({ message: "Words has beed deleted" }, { status: 200 });
    case 'users':
      await deleteUsers();
      return Response.json({ message: "Users has beed deleted" }, { status: 200 });
    default:
      return Response.json({ error: "Unknown entity" }, { status: 400 });
  }
}