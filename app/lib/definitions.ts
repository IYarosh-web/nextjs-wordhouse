// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Word = {
  id: string;
  title: string;
  translations: string[];
  description?: string;
  source?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export type WordForm = {
  title: string;
  description: string;
}
