"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { getAvailableUsernameSuggestions } from "../utils/username";
import { ProfileFormData } from "@/modules/links/components/link-form";

// function to check username availablity in the DB
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

// Functions to claim the username
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


export const getCurrentUsername = async ()=>{
    const user = await currentUser();

    const currentUsername = await db.user.findUnique({
        where:{
            clerkId:user?.id    // where clerkID should match with the user ID
        },
        select:{
            username:true,
            bio:true,
        },
    })
    return currentUsername;
}


export const createUserProfile = async (data:ProfileFormData)=>{
    const user = await currentUser();

    if (!user) return { success: false, error: "No authenticated user found" };

    const profile = await db.user.update({
    where:{
        clerkId:user.id
    },
    data:{
        firstName:data.firstName,
        lastName:data.lastName,
        bio:data.bio,
        imageUrl:data.imageUrl,
        username:data.username,


    }
    })

    return {
    sucess:true,
    message:"Profile created successfully",
    data:profile
    }
}

// export const getUserByUsername = async (username:string)=>{

//   const currentUsername = await db.user.findUnique({
//     where:{
//       username:username
//     },
//    include:{
    
//     links:true,
//     socialLinks:true
//    }
   
//   })
//   return currentUsername;
// }