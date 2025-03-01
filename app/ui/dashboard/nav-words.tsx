'use client'

import Link from 'next/link';
import clsx from 'clsx';
import { Word } from '@/app/lib/definitions';

type Props = {
  words: Word[]
}

export default function NavWords({
  words
}: Props) {
  return (
    <>
      {words.map((word) => {
        return (
          <Link
            key={word.id}
            href={`?word=${word.id}`}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
            )}
          >
            <p className="hidden md:block">{word.title}</p>
          </Link>
        );
      })}
    </>
  );
}
