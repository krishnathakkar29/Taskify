"use server";

import { prisma } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { userValidation } from "./project";

export async function getOrganization(orgId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }
  const client = await clerkClient();
  const organizationReceived = await client.organizations.getOrganization({
    slug: orgId,
  });

  if (!organizationReceived) {
    return null;
  }

  const { data: membership } =
    await client.organizations.getOrganizationMembershipList({
      organizationId: organizationReceived.id,
    });

  const userMembership = membership.find(
    (member) => member.publicUserData?.userId === userId
  );

  if (!userMembership) {
    return null;
  }

  return organizationReceived;
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
