import { cookies } from "next/headers";

export function getCurrentUser() {
    const userCookie = cookies().get("user")?.value;

    if (!userCookie) {
        return {
          error: "No user found",
        };
    }
    const user = JSON.parse(userCookie);
    return {
      user: {
        id: user.id,
        username: user.username,
      } as { id: string; username: string},
    };    
}