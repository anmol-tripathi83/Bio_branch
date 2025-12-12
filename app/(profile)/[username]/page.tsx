import { getUserByUsername } from '@/modules/profile/actions';
// import { logProfileVist } from '@/modules/analytics/actions';
import BioBranchProfile from '@/modules/profile/components/biobranch-profile';

import { redirect } from 'next/navigation';
import React from 'react'

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
    const { username } = await params;    // get the username from the params from the url
    const profileData = await getUserByUsername(username);

    // check 
    if (profileData?.username !== username) {
        return redirect("/");    // utility which helps to redirect to anywhere in server
    }

    // logProfileVist(profileData.id).catch((err) => {
    //     console.error("Error logging profile visit:", err);
    // });

    return (
        // @ts-ignore
        <BioBranchProfile profileData={profileData} />
    )
}

export default Page