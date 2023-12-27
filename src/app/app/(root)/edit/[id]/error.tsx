"use client";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

const ErrorPage = (props: Props) => {
  return <div>{props.error?.message}</div>;
};

export default ErrorPage;
