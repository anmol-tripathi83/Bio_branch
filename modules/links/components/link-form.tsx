"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Instagram, Youtube, Mail, Archive, FolderPlus, Camera, Edit3, X } from "lucide-react";

import { useUser } from "@clerk/nextjs";  //in client component, useUser hook provided by cleark whereas currentUser() function to get details for current user in server component

// Zod schemas
interface Profile {
  firstName: string;
  lastName: string;
  username: string;
  bio?: string;
  imageUrl?: string;
}

interface Props {
    username: string;
    bio: string;
}

const LinkForm = ({ username, bio }: Props) => {
    const currentUser = useUser();   // get from cleark
    
    const [profile, setProfile] = React.useState<Profile>({    // Its type Profile is shown above
        firstName: currentUser.user?.firstName || "",
        lastName: currentUser.user?.lastName || "",
        username: username || "",
        bio: bio || "",
        imageUrl:        // if image exist then okay otherwise random avatar is being used 
        currentUser.user?.imageUrl ||
        `https://avatar.iran.liara.run/username?username=[${currentUser.user?.firstName}+${currentUser.user?.lastName}]`,
    });

    const [editingProfile, setEditingProfile] = React.useState(false);  // state to edit the profile

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            {/* Profile Section */}
            <Card className="border-2 border-dashed border-gray-200 hover:border-green-400 transition-colors">
                <CardContent className="p-6">
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                            <AvatarImage
                            src={profile.imageUrl || "/placeholder.svg"}
                            alt={profile.username}
                            />
                            <AvatarFallback className="text-lg font-semibold bg-gray-100 text-gray-600">
                            {profile.username.slice(0, 2).toUpperCase() || "UN"}
                            </AvatarFallback>
                        </Avatar>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Camera size={14} />
                        </Button>
                    </div>

                    <div className="flex-1 space-y-2">
                        {editingProfile ? (
                            <></>
                        ) : (
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-lg">
                                    {   profile.username || "Add username..."}   {/** if username exist then username otherwise add username */}
                                    </h3>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0"
                                        onClick={() => setEditingProfile(true)}
                                    >
                                        <Edit3 size={12} />
                                    </Button>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {profile.bio || "Add bio..."}   {/**if bio exist then bio appear otherwise "add bio" */}
                                </p>
                            </div>
                        )} 
                    </div>
                </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LinkForm;