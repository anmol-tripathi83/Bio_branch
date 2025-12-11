import { Button } from "@/components/ui/button";
import { Brush, Share } from "lucide-react";
import LinkForm from "@/modules/links/components/link-form";
import { getCurrentUsername } from "@/modules/profile/actions";

const Page = async () => {
  const profile = await getCurrentUsername();

  return (
    <section className="flex flex-col gap-6 px-4 py-6 ">
        {/* Page header */}
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex flex-row justify-center items-center gap-3">
            <Button
              variant="outline"
              size="default"
              className="gap-2 bg-transparent"
            >
              <Brush size={16} />
                Design
            </Button>
            <Button
              variant="default"
              size="default"
              className="gap-2"
            >
              <Share size={16} />
                Share
            </Button>
          </div>
        </div>

        {/* Main Content - Form and Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start py-14">
          <div className="order-2 lg:order-1 border-r">
            <LinkForm
              username={profile?.username!}
              bio={profile?.bio!}
            />
          </div>
          {/* <div className="order-1 lg:order-2 lg:sticky lg:top-6">
            <PreviewFrame
              links={previewData.data.map((link: any) => ({
                ...link,
                description:
                  link.description === null ? undefined : link.description,
              }))}
            />
          </div> */}
        </div>
    </section>
  );
};

export default Page;