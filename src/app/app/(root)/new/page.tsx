import React from "react";

import CompanionForm from "../_components/companion-form";
import db from "@/lib/db";

const NewCompanion = async () => {
  const categories = await db.category.findMany();

  return <CompanionForm categories={categories} intialData={null} />;
};

export default NewCompanion;
