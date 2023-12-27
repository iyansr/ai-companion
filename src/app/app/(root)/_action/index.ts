"use server";

import db from "@/lib/db";
import { CompanionSchema } from "@/schema/companionSchema";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

export const createCompanion = async (values: CompanionSchema) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Not Authorized");
  }

  await db.companion.create({
    data: {
      creatorId: user.id,
      creatorName: user.firstName ?? user.username ?? user.emailAddresses[0].emailAddress ?? "",
      ...values,
    },
  });

  revalidatePath("/");
};

export const updateCompanion = async (values: CompanionSchema, id: string) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Not Authorized");
  }

  await db.companion.update({
    data: {
      creatorId: user.id,
      creatorName: user.firstName ?? user.username ?? user.emailAddresses[0].emailAddress ?? "",
      ...values,
    },
    where: {
      id,
    },
  });

  revalidatePath("/");
};
