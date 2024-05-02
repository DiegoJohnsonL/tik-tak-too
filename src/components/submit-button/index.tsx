"use client";

import { cn } from "@/utils";
import { useFormStatus } from "react-dom";

export default function SubmitButton({ className, children, value }: any) {
  const { pending } = useFormStatus();

  return (
    <button
      className={cn(
        "px-4 py-2 text-md md:text-lg lg:text-xl text-tik-orange font-finger text-center bg-tik-winning border border-tik-orange rounded-lg",
        className
      )}
      type="submit"
      name="action"
      disabled={pending}
      value={value}>
      {children}
    </button>
  );
}
