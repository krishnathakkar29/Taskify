"use server";
import { auth } from "@clerk/nextjs/server";
import { userValidation } from "./project";
import { Issue } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function createIssue(projectId: string, data: any) {
  try {
    const { userId } = await auth();

    await userValidation(userId);
    let user = await prisma.user.findUnique({ where: { clerkId: userId! } });

    if (!user) {
      throw new Error("Unauthorized");
    }

    const previousIssue = await prisma.issue.findFirst({
      where: {
        projectId,
        status: data.status,
      },
      orderBy: {
        order: "desc",
      },
    });

    const newOrder = previousIssue ? previousIssue.order + 1 : 0;

    const issue = await prisma.issue.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        projectId: projectId,
        sprintId: data.sprintId,
        reporterId: user.id,
        assigneeId: data.assigneeId || null,
        order: newOrder,
      },
      include: {
        assignee: true,
        reporter: true,
      },
    });

    return issue;
  } catch (error: any) {
    console.log(error);
    throw new Error("Error creating issue: " + error.message);
  }
}
