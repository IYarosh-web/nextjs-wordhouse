import { sql } from '@vercel/postgres';
import {
  Word,
} from './definitions';

export async function fetchWords() {
  try {
    const data = await sql<Word>`SELECT * FROM words`;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch words.');
  }
}

export async function fetchWord(id: string) {
  try {
    if (!id) return null;

    const data = await sql<Word>`SELECT * FROM words WHERE id = ${id};`;

    return data.rows[0];
  } catch (error) {
    console.error("Database error: ", error);
    throw new Error('Failed to fetch word.');
  }
}