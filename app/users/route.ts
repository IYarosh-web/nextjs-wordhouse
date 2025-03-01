import { db } from '@vercel/postgres';

const client = await db.connect();

export async function GET() {
  try {
    const data = await client.sql`SELECT * FROM users`;
    const users = data.rows;

    return Response.json(users);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}