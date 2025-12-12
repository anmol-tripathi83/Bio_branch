"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { LinkFormData } from "../components/link-form";
import { SocialLinkFormData } from "../components/social-link-modal";


// LINK RELETED ACTIONS -

// server action to create the link 
export const createLinkByUser = async(data:LinkFormData)=>{
    const user = await currentUser();

    if (!user) return { success: false, error: "No authenticated user found" };

    // link has been created and it is connected to currently loggedin user who link created
    const link = await db.link.create({
        data:{
            title: data.title,
            url: data.url,
            description: data.description,
            clickCount: 0,
            user: {
                connect: {
                    clerkId: user.id
                }
            }
        }
      
    });

    return {
        success:true,
        message:"Link created successfully",
        data:link
    }
}

// get all the user's link to render for the ui
export const getAllLinkForUser = async()=>{
    const user = await currentUser();

    const links = await db.link.findMany({
        where:{
            user:{
                clerkId:user?.id
            }
        },
        select:{
            id:true,
            title:true,
            description:true,
            url:true,
            clickCount:true,
            createdAt:true,
            
        }
    });

    return {
        success:true,
        message:"Gets All Link successfully",
        data:links
    }
}

// to preview at right sidebar of my-tree page
export const getPreviewData = async()=>{
    const user = await currentUser();

    if (!user) {
        return {
            success: false,
            message: "No authenticated user found",
            data: []
        };
    }
    const links = await db.link.findMany({
        where: {
            user: {
                clerkId: user.id
            }
        },
        include: {
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                    username: true,
                    bio: true,
                    imageUrl: true,
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return {
        success: true,
        message: "Gets All Link successfully",
        data: links
    }
}

// Axction to delete the existing link
export const deleteLink = async(linkId:string)=>{
    const user = await currentUser();

    if (!user) return { success: false, error: "No authenticated user found" };

    await db.link.delete({where:{id:linkId}});
    return {success:true, message:"Link deleted successfully!"}
}

// Action to edit the existing link and update it
export const editLink = async(data:LinkFormData,linkId:string)=>{
    const user = await currentUser();

    if (!user) return { success: false, error: "No authenticated user found" };

    await db.link.update({where:{id:linkId , user:{clerkId:user.id}},data:data});
    return {success:true, message:"Link updated successfully!"}
}



// # SOCIAL LINK RELATED ACTIONS -

// Action to create social link
export const addSocialLink = async(data:SocialLinkFormData)=>{
    const user = await currentUser();

    if (!user) return { success: false, error: "No authenticated user found" };

    const socialLink = await db.socialLink.create({
        data:{
            platform: data.platform,
            url: data.url,
            user: {
                connect: {
                    clerkId: user.id
                }
            }
        }
    })

    return {
        success:true,
        message:"Social link added successfully",
        data:socialLink
    }
}

// Action to edit the existing social link and update it
export const editSocialLink = async(data:SocialLinkFormData,socialLinkId:string)=>{
    const user = await currentUser();

    if (!user) return { success: false, error: "No authenticated user found" };

    await db.socialLink.update({where:{id:socialLinkId , user:{clerkId:user.id}},data:data});
    return {success:true, message:"Social link updated successfully!"}
}

// Action to Delete the existing social links
export const deleteSocialLink = async(socialLinkId:string)=>{
    const user = await currentUser();

    if (!user) return { success: false, error: "No authenticated user found" };

    await db.socialLink.delete({where:{id:socialLinkId}});
    return {success:true, message:"Social link deleted successfully!"}
}


