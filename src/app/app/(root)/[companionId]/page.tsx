import db from "@/lib/db";
import React from "react";
import CompanionForm from "../_components/companion-form";

type Props = {
  companionId: string;
};

const DetailCompaionPage = async ({ companionId }: Props) => {
  const companionPromise = db.companion.findUnique({
    where: {
      id: companionId,
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
