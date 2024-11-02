"use server";

import { prisma } from "@/lib/db";
import { CreateProjectType } from "@/types/Project";
import { auth, clerkClient } from "@clerk/nextjs/server";

const userValidation = async (userId: string | null) => {
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

export async function fetchProjects(orgId: string) {
  const { userId } = await auth();
  try {
    await userValidation(userId);

    const projects = await prisma.project.findMany({
      where: {
        organizationId: orgId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return projects;
  } catch (error: any) {
    console.log(error);
    throw new Error("Error getting project: " + error.message);
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
