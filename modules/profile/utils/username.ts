import { db } from "@/lib/db";
// why use server we are not using because ultimately this function is called in action/index.ts where use server is used therefore db se interact kar skte h 

export async function getAvailableUsernameSuggestions(base: string, count = 3, maxTries = 10) { // default value is given if not given as a argument
    const suggestions: string[] = [];
    for (let i = 1; suggestions.length < count && i < maxTries; i++) {   // 10 baar loop chalana chahte h untill 3 suggestions found
        const candidate = `${base}${i}`;    // anmol1 in first iteration

        // check whether the candidate name is already is in DB
        const exists = await db.user.findUnique({ where: { username: candidate } });
        
        if (!exists) suggestions.push(candidate); // if not exist
    }
    return suggestions; 
}