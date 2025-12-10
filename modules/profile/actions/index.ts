"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { getAvailableUsernameSuggestions } from "../utils/username";

export const checkProfileUsernameAvailability = async (username: string) => {
    // if username is not given
    if (!username) return { available: false, suggestions: [] };

    // otherwise search it in DB
    const user = await db.user.findUnique({ where: { username } });

    // means not present then we dont have to return suggestions becasue user can use it
    if (!user) return { available: true };

    // if username is already present
    const suggestions = await getAvailableUsernameSuggestions(username, 3, 10);
    
    return { available: false, suggestions };
};


export const claimUsername = async (username: string) => {
  const loggedInUser = await currentUser();

  if (!loggedInUser) return { success: false, error: "No authenticated user found" };
  
  const user = await db.user.update({
    where:{
        clerkId: loggedInUser.id
    },
    data: {
        username: username
    }
  });

  if (!user) return { success: false, error: "No authenticated user found" };

  return { success: true };
}
