"use client";
import React, { useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateProjectType } from "@/types/Project";
import { useOrganization, useUser } from "@clerk/nextjs";
import OrgSwitcher from "@/components/org-switcher";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { createProject } from "../../../../../actions/project";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {};

const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(50, "Project name must be less than 50 characters"),
  key: z
    .string()
    .min(1, "Project key is required")
    .max(10, "Project key must be less than 10 characters")
    .regex(
      /^[A-Z0-9]+$/,
      "Project key must be uppercase letters and numbers only"
    ),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
});

const page = (props: Props) => {
  const { organization, isLoaded: isOrgLoaded, membership } = useOrganization();
  const { user, isLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
  });

  const {
    fn: createProjectFn,
    loading,
    error,
    data: project,
  } = useFetch(createProject);

  const onSubmit = (data: CreateProjectType) => {
    if (!isAdmin) {
      alert("Only organization admins can create projects");
      return;
    }

    createProjectFn(data);
  };

  useEffect(() => {
    if (isLoaded && isOrgLoaded && membership) {
      setIsAdmin(membership.role == "org:admin");
    }
  }, [isLoaded, isOrgLoaded, membership]);

  useEffect(() => {
    if (project) {
      toast.success("Project created successfully!");
      router.push(`/project/${project.id}`);
    }
  }, [loading]);

  if (!isLoaded || !isOrgLoaded) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col gap-2 items-center">
        <span className="text-2xl gradient-title">
          Oops! Only Admins can create projects.
        </span>
        <OrgSwitcher />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-6xl text-center font-bold mb-8 gradient-title">
        Create New Project
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        <div>
          <Input
            id="name"
            {...register("name")}
            className="bg-slate-950"
            placeholder="Project Name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <Input
            id="key"
            {...register("key")}
            className="bg-slate-950"
            placeholder="Project Key (Ex: RCYT)"
          />
          {errors.key && (
            <p className="text-red-500 text-sm mt-1">{errors.key.message}</p>
          )}
        </div>
        <div>
          <Textarea
            id="description"
            {...register("description")}
            className="bg-slate-950 h-28"
            placeholder="Project Description"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
        <Button
          disabled={loading}
          type="submit"
          size="lg"
          className="bg-blue-500 text-white"
        >
          {loading ? "Creating Project..." : "Create Project"}
        </Button>
        {error && <p className="text-red-500 mt-2">{error.message}</p>}
      </form>
    </div>
  );
};

export default page;
