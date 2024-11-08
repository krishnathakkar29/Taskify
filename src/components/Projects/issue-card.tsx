"use client";

import { Issue } from "@prisma/client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";
import UserAvatar from "../user-avatar";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import IssueDetailsDialog from "./issue-details-dialog";

type Props = {
  issue: Issue & {
    assignee: {
      name: string | null;
      id: string;
      createdAt: Date;
      updatedAt: Date;
      clerkId: string;
      email: string;
      imageUrl: string | null;
    } | null;
  };
  showStatus?: boolean;
  onDelete?: () => void;
  onUpdate?: (params: any) => void;
};

const priorityColor = {
  LOW: "border-green-600",
  MEDIUM: "border-yellow-300",
  HIGH: "border-orange-400",
  URGENT: "border-red-400",
};

const IssueCard = ({
  issue,
  showStatus = false,
  onDelete = () => {},
  onUpdate = (params: any) => {},
}: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const created = formatDistanceToNow(new Date(issue.createdAt), {
    addSuffix: true,
  });

  const onDeleteHandler = () => {
    router.refresh();
    onDelete();
  };

  const onUpdateHandler = (value: any) => {
    router.refresh();
    onUpdate(value);
  };

  return (
    <>
      <Card onClick={() => setIsDialogOpen(true)}>
        <CardHeader
          className={`border-t-2 ${priorityColor[issue.priority]} rounded-lg`}
        >
          <CardTitle>{issue.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 -mt-3">
          {showStatus && <Badge>{issue.status}</Badge>}
          <Badge variant="outline" className="-ml-1">
            {issue.priority}
          </Badge>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-3">
          <UserAvatar user={issue.assignee!} />

          <div className="text-xs text-gray-400 w-full">Created {created}</div>
        </CardFooter>
      </Card>

      {isDialogOpen && (
        <IssueDetailsDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          issue={issue}
          onDelete={onDeleteHandler}
          onUpdate={onUpdateHandler}
          borderCol={priorityColor[issue.priority]}
        />
      )}
    </>
  );
};

export default IssueCard;
