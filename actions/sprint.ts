"use server";

import { prisma } from "@/lib/db";
import { sprintSchema } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import * as z from "zod";

export async function createSprint(
  projectId: string,
  { name, dateRange }: z.infer<typeof sprintSchema>
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      throw new Error("Unauthorized");
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.organizationId !== orgId) {
      throw new Error(
        "Project not found or you don't have permission to delete it"
      );
    }

    const sprint = await prisma.sprint.create({
      data: {
        name,
        startDate: dateRange.from,
        endDate: dateRange.to,
        projectId: project.id,
        status: "PLANNED",
      },
    });
    return sprint;
  } catch (error: any) {
    console.log(error);
    throw new Error("Error creating sprint: " + error.message);
  }
}
