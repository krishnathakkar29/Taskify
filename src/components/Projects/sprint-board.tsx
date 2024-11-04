"use client";
import { Sprint } from "@prisma/client";
import React, { useState } from "react";
import SprintManager from "./sprint-manager";

type Props = {
  sprints: Sprint[];
  projectId: string;
  orgId: string;
};

const SprintBoard = ({ sprints, projectId, orgId }: Props) => {
  const [currentSprint, setCurrentSprint] = useState(
    sprints.find((sprint) => sprint.status == "ACTIVE") || sprints[0]
  );

  return (
    <div className="flex flex-col">
      <SprintManager
        sprint={currentSprint}
        setSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />
    </div>
  );
};

export default SprintBoard;
