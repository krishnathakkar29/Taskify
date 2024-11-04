"use server";

import { prisma } from "@/lib/db";
import { sprintSchema } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import * as z from "zod";
import { userValidation } from "./project";
import { SprintStatus } from "@prisma/client";

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

export async function updateSprintStatus(
  sprintId: string,
  newStatus: SprintStatus
) {
  try {
    const { userId, orgId, orgRole } = await auth();

    if (!userId || !orgId) {
      throw new Error("Unauthorized");
    }
    const sprint = await prisma.sprint.findUnique({
      where: { id: sprintId },
      include: { project: true },
    });
    console.log(sprint, orgRole);

    if (!sprint) {
      throw new Error("Sprint not found");
    }

    if (sprint.project.organizationId !== orgId) {
      throw new Error("Unauthorized");
    }

    if (orgRole !== "org:admin") {
      throw new Error("Only Admin can make this change");
    }

    const now = new Date();
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);

    if (newStatus === "ACTIVE" && (now < startDate || now > endDate)) {
      throw new Error("Cannot start sprint outside of its date range");
    }

    if (newStatus === "COMPLETED" && sprint.status !== "ACTIVE") {
      throw new Error("Can only complete an active sprint");
    }

    const updatedSprint = await prisma.sprint.update({
      where: { id: sprintId },
      data: { status: newStatus },
    });

    return { success: true, sprint: updatedSprint };
  } catch (error: any) {
    console.log("Error updating sprint status: " + error);
    throw new Error("Error updating sprint status: " + error.message);
  }
}
