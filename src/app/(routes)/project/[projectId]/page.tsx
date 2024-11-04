import React from "react";
import { getProject } from "../../../../../actions/project";
import { notFound } from "next/navigation";
import SprintCreationForm from "@/components/Projects/create-sprint";
import SprintBoard from "@/components/Projects/sprint-board";
type Params = {
  projectId: string;
};

const page = async ({ params }: { params: Params }) => {
  const { projectId } = await params;
  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto">
      <SprintCreationForm
        projectTitle={project.name}
        projectId={projectId}
        projectKey={project.key}
        sprintKey={project.sprints?.length + 1}
      />

      {project.sprints.length !== 0 ? (
        <SprintBoard
          sprints={project.sprints}
          projectId={projectId}
          orgId={project.organizationId}
        />
      ) : (
        <div>Create a Sprint from button above</div>
      )}
    </div>
  );
};

export default page;
