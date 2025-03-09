'use client';

import { Dialog, DialogPanel } from "@headlessui/react";

import { useRouter } from "next/navigation";
import Form from "./create-form";

function AddWordModal() {
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
          <Form />
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default AddWordModal;