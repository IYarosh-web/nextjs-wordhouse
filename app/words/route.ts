import { db } from '@vercel/postgres';

const client = await db.connect();


export async function GET() {
  try {
    const data = await client.sql`SELECT * FROM words`;
    const words = data.rows;

    return Response.json(words);
  } catch (error) {
    console.error("Database error: ", error);
    throw new Error("Failed to fetch words");
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.formData();

    const title = data.get("title") as string;
    const description = data.get("description") as string;
    const userId = "410544b2-4001-4271-9855-fec4b6a6442a";
    const created = new Date();

    await client.sql`
      INSERT INTO words (
        id,
        title,
        description,
        created_at,
        user_id
      ) VALUES (
        gen_random_uuid(),
        ${title},
        ${description},
        ${created.toISOString()},
        ${userId}
      )
        ON CONFLICT DO NOTHING
    `;

    return Response.json({ message: "Word created" }, { status: 200 });
  } catch (error) {
    console.error("Database error: ", error);
    throw new Error("Failed to create word")
  }
}