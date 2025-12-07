import { Button } from "@/components/ui/button";
import Image from "next/image";

// page.tsx -> reserved keyword means we want to build the page or route segment

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Button>
        Hello world
      </Button>
    </div>
  );
}
