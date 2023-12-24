import React, { PropsWithChildren } from "react";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return <main className="flex flex-col items-center justify-center h-full">{children}</main>;
};

export default AuthLayout;
