'use client';

import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

import { Word } from "@/app/lib/definitions";
import { useRouter } from "next/navigation";

type Props = {
  word: Word;
}

function ViewWordModal({
  word
}: Props) {
  const router = useRouter();

  const close = () => {
    router.back();
  };

  return (
    <Dialog
      open
      onClose={close}
      className="relative z-50"
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel>
          <DialogTitle>{word.title}</DialogTitle>
          <Description>{word.description}</Description>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default ViewWordModal;