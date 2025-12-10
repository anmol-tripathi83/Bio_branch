// "use client";
import { UserButton } from "@clerk/nextjs";

interface Props {
  showName?: boolean;
}

// function to show username with its profile pic is visible in right of navbar
export default function UserControl({ showName }: Props) {
  return (
    <UserButton
      showName={showName}
    />
  );
}