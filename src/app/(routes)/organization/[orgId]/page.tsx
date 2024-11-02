import React from "react";
import { getOrganization } from "../../../../../actions/organization";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import OrgSwitcher from "@/components/org-switcher";

type Props = {
  params: any;
};

const page = async ({ params }: Props) => {
  const { orgId } = await params;
  const { userId } = await auth();
  const organization = await getOrganization(orgId);

  if (!userId) {
    redirect("/sign-in");
  }
  if (!organization) {
    return <div>Organization not found</div>;
  }

  return (
    <div className="wrapper mx-auto">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
        <h1 className="text-5xl font-bold gradient-title pb-2">
          {organization.name}&rsquo;s Projects
        </h1>

        <OrgSwitcher />
      </div>
      {/* <div className="mb-4">
        <ProjectList orgId={organization.id} />
      </div>
      <div className="mt-8">
        <UserIssues userId={userId} />
      </div> */}
    </div>
  );
};

export default page;
