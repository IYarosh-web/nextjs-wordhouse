import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';
import { invoices, customers, revenue, users, words } from '../lib/placeholder-data';

const client = await db.connect();

async function seedWords() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS words (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      source VARCHAR(255) NOT NULL,
      created_at DATE NOT NULL,
      updated_at DATE NOT NULL,
      user_id UUID,
      CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `;

  const insertedWords = await Promise.all(
    words.map(
      (word) => client.sql`
        INSERT INTO words (id, title, description, source, created_at, updated_at, user_id)
        VALUES (gen_random_uuid (), ${word.title}, ${word.description}, ${word.source}, ${word.createdAt}, ${word.updatedAt}, ${users[0].id})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedWords;
}

async function seedExamples() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS examples (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      CONSTRAINT word_id FOREIGN KEY (id)
      REFERENCES words(id),
      sentence TEXT NOT NULL,
      created_at DATE NOT NULL
    );
  `;
}

async function seedTags() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS tags (
      id VARCHAR(255) NOT NULL PRIMARY KEY
    );
  `;

  await client.sql`
    CREATE TABLE IF NOT EXISTS tagsToWords (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      word_id UUID,
      tag_id VARCHAR(255),
      CONSTRAINT fk_word FOREIGN KEY (word_id) REFERENCES words(id),
      CONSTRAINT fk_tag FOREIGN KEY (tag_id) REFERENCES tags(id)
    );
  `;
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

async function seedInvoices() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => client.sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedInvoices;
}

async function seedCustomers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => client.sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCustomers;
}

async function deleteWords() {
  await client.sql`
    DROP TABLE IF EXISTS words;
  `;
  console.log("words dropped");
}

async function deleteTagsToWords() {
  await client.sql`
    DROP TABLE IF EXISTS tagsToWords;
  `;
  console.log("Tags to words dropped");
}

async function deleteExamples() {
  await client.sql`
    DROP TABLE IF EXISTS examples;
  `;
  console.log("examples dropped");
}

async function seedRevenue() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => client.sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedRevenue;
}

async function getWords() {
  const result = await client.sql`
    SELECT * FROM words;
  `;

  console.log(result.rows);

  return result.rows;
}

export async function GET() {
  console.log("Seed route");
  // return Response.json({
  //   message:
  //     'Uncomment this file and remove this line. You can delete this file when you are finished.',
  // });
  try {
    await client.sql`BEGIN`;
    await seedUsers();
    // await seedCustomers();
    // await seedInvoices();
    // await seedRevenue();
    // await seedWords();
    // await seedTags();
    // await seedExamples();
    // await deleteTagsToWords();
    // await deleteExamples();
    // await deleteWords();
    // await getWords();
    await client.sql`COMMIT`;

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
