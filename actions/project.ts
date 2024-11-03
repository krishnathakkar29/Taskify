"use server";

import { prisma } from "@/lib/db";
import { CreateProjectType } from "@/types/Project";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Project } from "@prisma/client";

export const userValidation = async (userId: string | null) => {
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }
};

export async function createProject({
  name,
  key,
  description,
}: CreateProjectType) {
  const { userId, orgId } = await auth();

  await userValidation(userId);
  if (!orgId) {
    throw new Error("No Organization Selected");
  }

  const client = await clerkClient();

  const { data: membershipList } =
    await client.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  const userMembership = membershipList.find(
    (membership) => membership.publicUserData?.userId === userId
  );

  if (!userMembership || userMembership.role !== "org:admin") {
    throw new Error("Only organization admins can create projects");
  }

  try {
    const project = await prisma.project.create({
      data: {
        name,
        key,
        description,
        organizationId: orgId,
      },
    });

    return project;
  } catch (error: any) {
    console.log(error);
    throw new Error("Error creating project: " + error.message);
  }
}

export async function getProject(projectId: string) {
  const { userId, orgId } = await auth();
  try {
    await userValidation(userId);
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        sprints: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    // Verify project belongs to the organization
    if (project.organizationId !== orgId) {
      return null;
    }

    return project;
  } catch (error: any) {
    console.log(error);
    throw new Error("Error getting the project: " + error.message);
  }
}

export async function deleteProject(projectId: string) {
  try {
    const { userId, orgId, orgRole } = await auth();

    if (!userId || !orgId) {
      throw new Error("Unauthorized");
    }

    if (orgRole !== "org:admin") {
      throw new Error("Only organization admins can delete projects");
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.organizationId !== orgId) {
      throw new Error(
        "Project not found or you don't have permission to delete it"
      );
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    return { success: true };
  } catch (error: any) {
    console.log(error);
    throw new Error("Error deleting project: " + error.message);
  }
}
