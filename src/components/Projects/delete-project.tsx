"use client";

import { useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { deleteProject } from "../../../actions/project";
import { toast } from "sonner";

type Props = {
  projectId: string;
};

const DeleteProject = ({ projectId }: Props) => {
  const { membership } = useOrganization();
  const router = useRouter();

  const isAdmin = membership?.role == "org:admin";

  const {
    data: deleted,
    fn: deleteProjectFn,
    error,
    loading: isDeleting,
  } = useFetch(deleteProject);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteProjectFn(projectId);
      toast.success("Project Deleted!");
      router.refresh();
    }
  };

  if (!isAdmin) return null;
  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        className={`${isDeleting ? "animate-pulse" : ""}`}
        onClick={handleDelete}
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </>
  );
};

export default DeleteProject;
