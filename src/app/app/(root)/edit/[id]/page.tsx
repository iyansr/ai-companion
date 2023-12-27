import db from "@/lib/db";
import React from "react";
import CompanionForm from "../../_components/companion-form";
import { auth, redirectToSignIn } from "@clerk/nextjs";

type Props = {
  params: { id: string };
};

const DetailCompaionPage = async ({ params: { id } }: Props) => {
  const { userId } = auth();
  if (!userId) {
    return redirectToSignIn();
  }

  const companionPromise = db.companion.findUnique({
    where: {
      id: id,
      creatorId: userId,
    },
  });

  const categoriesPromise = db.category.findMany();

  const [companion, categories] = await Promise.all([companionPromise, categoriesPromise]);

  if (!companion) {
    throw new Error("Companion Not Found");
  }

  return <CompanionForm categories={categories} intialData={companion} />;
};

export default DetailCompaionPage;
