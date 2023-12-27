import { SignInButton } from "@clerk/nextjs";
import React from "react";

const RootPage = () => {
  return (
    <div>
      <SignInButton>
        <button>SignIn</button>
      </SignInButton>
    </div>
  );
};

export default RootPage;
