"use server";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { userValidation } from "./project";
import { Issue, IssuePriority, IssueStatus, User } from "@prisma/client";

export type typeUpdatedIssue = Issue & {
  assignee: User | null;
  reporter: User;
};

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

export async function getIssuesForSprint(sprintId: string) {
  const { userId, orgId } = await auth();
  try {
    if (!userId || !orgId) {
      throw new Error("Unauthorized");
    }

    const issues = await prisma.issue.findMany({
      where: {
        sprintId,
      },
      orderBy: [
        {
          status: "asc",
        },
        {
          order: "desc",
        },
      ],
      include: {
        assignee: true,
        reporter: true,
      },
    });

    return issues;
  } catch (error: any) {
    console.log(error);
    throw new Error("Error getting issues: " + error.message);
  }
}

export async function updateIssueOrder(
  updatedIssues: typeUpdatedIssue[] | undefined
) {
  const { userId, orgId } = await auth();
  try {
    if (!userId || !orgId) {
      throw new Error("Unauthorized");
    }

    await prisma.$transaction(async (prism) => {
      for (let issue of updatedIssues!) {
        await prisma.issue.update({
          where: {
            id: issue.id,
          },
          data: {
            status: issue.status,
            order: issue.order,
          },
        });
      }
    });

    return { success: true };
  } catch (error: any) {
    console.log(error);
    throw new Error("Error updating issues: " + error.message);
  }
}

export async function deleteIssue(issueId: string) {
  try {
    const { userId } = await auth();
    await userValidation(userId);

    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: { project: true },
    });

    if (!issue) {
      throw new Error("Issue not found");
    }

    if (issue.reporterId !== userId) {
      throw new Error("You don't have permission to delete this issue");
    }

    await prisma.issue.delete({
      where: {
        id: issueId,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.log(error);
    throw new Error("Error deleting issues: " + error.message);
  }
}

export async function updateIssue(
  issueId: string,
  data: {
    status: IssueStatus;
    priority: IssuePriority;
  }
) {
  const { userId, orgId } = await auth();
  try {
    if (!userId || !orgId) {
      throw new Error("Unauthorized");
    }

    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: { project: true },
    });

    if (!issue) {
      throw new Error("Issue not found");
    }

    if (issue.project.organizationId !== orgId) {
      throw new Error("Unauthorized");
    }
    const updatedIssue = await prisma.issue.update({
      where: {
        id: issueId,
      },
      data: {
        status: data.status,
        priority: data.priority,
      },
      include: {
        assignee: true,
        reporter: true,
      },
    });

    return updatedIssue;
  } catch (error: any) {
    console.log(error);
    throw new Error("Error updating issue: " + error.message);
  }
}
