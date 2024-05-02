"use client";

import { start } from "@/server/services/game-service";
import SubmitButton from "../submit-button";
import { useFormState, useFormStatus } from "react-dom";

const initialState = {
  error: ""
}

export default function StartGameForm({
  user,
}: {
  user: { id: string; username: string } | undefined;
}) {

  const [state, formAction] = useFormState(start, initialState);
  const { pending } = useFormStatus();
  console.log(state);

  return (
    <form action={formAction}>
      <div className="flex flex-col gap-6">
        <div>
          {!user && (
            <>
              <input
                type="text"
                name="username"
                required={user ? false : true}
                className="px-4 py-2 text-md md:text-lg lg:text-xl text-tik-orange font-finger text-center bg-tik-bg  focus:outline-0 ring-1 ring-tik-winning focus:ring-tik-orange rounded-lg"
              />
              <p aria-live="polite" className="pt-2 text-red-400">
                {state?.error}
              </p>
            </>
          )}
        </div>
        {!pending ? (
          <>
            <SubmitButton value="create">Create Game</SubmitButton>
            <SubmitButton value="join">Join Game</SubmitButton>
          </>
        ) : (
          <p className="text-tik-orange"> Loading... </p>
        )}
      </div>
    </form>
  );
}
