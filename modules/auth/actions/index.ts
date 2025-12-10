"use server";

import { db } from "@/lib/db";   // now this file access to talk with DB

import { currentUser } from "@clerk/nextjs/server";    // provided by cleark to get the details of current logged in user

// onBoarding the user : Server action feature just like TRPC(remote procedural call)
export const onBoardUser = async () => {
    try {
        const user = await currentUser();

        if (!user) {
            return { success: false, error: "No authenticated user found" };
        }

        const { id, firstName, lastName, imageUrl, emailAddresses } = user;

        // Use upsert to create or update user
        const newUser = await db.user.upsert({
            where: {
                clerkId: id
            },
            update: {
                firstName: firstName || null,
                lastName: lastName || null,
                imageUrl: imageUrl || null,
                email: emailAddresses[0]?.emailAddress || "",
                
            },
            create: {
                clerkId: id,
                firstName: firstName || null,
                lastName: lastName || null,
                imageUrl: imageUrl || null,
                email: emailAddresses[0]?.emailAddress || "",
                
            }
        });

        console.log("User onboarded successfully:", newUser.id);
        
        return { 
            success: true, 
            user: newUser,
            message: "User onboarded successfully" 
        };

    } catch (error) {
        console.error("Error onboarding user:", error);
        return { 
            success: false, 
            error: "Failed to onboard user" 
        };
    }
};