import React from "react";
import { fetchProjects } from "../../../actions/project";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import DeleteProject from "./delete-project";

type Props = {
  orgId: string;
};

const ProjectList = async ({ orgId }: Props) => {
  const projects = await fetchProjects(orgId);

  if (projects.length === 0) {
    return (
      <p>
        No projects found.{" "}
        <Link
          className="underline underline-offset-2 text-blue-200"
          href="/project/create"
        >
          Create New.
        </Link>
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((project, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {project.name}
              <DeleteProject projectId={project.id} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">{project.description}</p>
            <Link
              href={`/project/${project.id}`}
              className="text-blue-500 hover:underline"
            >
              View Project
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectList;
