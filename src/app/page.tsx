import StartGameForm from "@/components/start-game-form";
import SubmitButton from "@/components/submit-button";
import { joinGame } from "@/server/services/game-service";
import { getCurrentUser } from "@/server/services/session-service";
import { ServerError } from "@/types/server-error";

export default async function Home() {
  const { user, error } = getCurrentUser();
  return (
    <div className="min-h-svh gap-10 flex flex-col items-center justify-center bg-tik-bg">
      <h1 className="text-4xl md:text-5xl lg:text-7xl uppercase text-tik-orange font-finger text-center">
        { user ? `Welcome 👋`  : "Choose a username"} 
      </h1>
      <h1 className="text-4xl md:text-5xl lg:text-7xl uppercase text-tik-orange font-finger text-center">
      {user && user.username}
      </h1>
      <StartGameForm user={user} />
    </div>
  );
}
