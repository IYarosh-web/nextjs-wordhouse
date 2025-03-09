import clsx from "clsx";
import Link from "next/link";

export function AddWordButton() {
  return (
    <Link
      href={`?new-word=true`}
      className={clsx(
        'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
      )}
    >
      <p className="hidden md:block">Add word</p>
    </Link>
  )
}