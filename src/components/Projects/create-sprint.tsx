"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { sprintSchema } from "@/lib/schema";
import useFetch from "@/hooks/use-fetch";
import { createSprint } from "../../../actions/sprint";
import { useRouter } from "next/navigation";

type Props = {
  projectTitle: string;
  projectId: string;
  projectKey: string;
  sprintKey: number;
};

const SprintCreationForm = ({
  projectTitle,
  projectId,
  projectKey,
  sprintKey,
}: Props) => {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const form = useForm<z.infer<typeof sprintSchema>>({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
      name: `${projectKey}-${sprintKey}`,
      dateRange: {
        from: new Date(),
        to: addDays(new Date(), 14),
      },
    },
  });

  const { loading: createSprintLoading, fn: createSprintFn } =
    useFetch(createSprint);
  const onSubmit = async (data: z.infer<typeof sprintSchema>) => {
    await createSprintFn(projectId, data);
    setShowForm(false);
    router.refresh();
  };

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-5xl font-bold mb-8 gradient-title">
          {projectTitle}
        </h1>
        <Button
          className="mt-2"
          onClick={() => setShowForm(!showForm)}
          variant={!showForm ? "default" : "destructive"}
        >
          {!showForm ? "Create New Sprint" : "Cancel"}
        </Button>
      </div>
      {showForm && (
        <Card className="pt-4 mb-4">
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col md:flex-row items-center gap-4"
              >
                <div className="flex-1 w-full">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium mb-1">
                          Sprint Name
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="name" {...field} />
                        </FormControl>
                        {/* <FormDescription>
                        This is your public display name.
                        </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="dateRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium mb-1">
                          Sprint Name
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={`w-full justify-start text-left font-normal bg-slate-950 ${
                                  !field.value && "text-muted-foreground"
                                }`}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value.from && field.value.to ? (
                                  format(field.value.from, "LLL dd, y") +
                                  " - " +
                                  format(field.value.to, "LLL dd, y")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="range"
                              classNames={{
                                months:
                                  "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                                month: "space-y-4",
                                caption:
                                  "flex justify-center pt-1 relative items-center",
                                caption_label: "text-sm font-medium",
                                nav: "space-x-1 flex items-center",
                                nav_button: cn(
                                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                                ),
                                nav_button_previous: "absolute left-1",
                                nav_button_next: "absolute right-1",
                                table: "w-full border-collapse space-y-1",
                                head_row: "flex",
                                head_cell:
                                  "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                                row: "flex w-full mt-2",
                                cell: cn(
                                  "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-blue-100",
                                  "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                                ),
                                day: cn(
                                  "h-9 w-9 p-0 font-normal",
                                  "hover:bg-blue-100 focus:bg-blue-100",
                                  "aria-selected:opacity-100"
                                ),
                                day_selected:
                                  "bg-blue-500 text-white hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white",
                                day_today: "border-2 border-blue-500",
                                day_outside: "text-muted-foreground opacity-50",
                                day_disabled:
                                  "text-muted-foreground opacity-50",
                                day_range_middle:
                                  "aria-selected:bg-blue-100 aria-selected:text-blue-900",
                                day_hidden: "invisible",
                              }}
                              defaultMonth={field.value?.from}
                              selected={field.value}
                              onSelect={(range) => {
                                if (range?.from && range?.to) {
                                  field.onChange(range);
                                }
                              }}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={createSprintLoading}>
                  {createSprintLoading ? "Creating..." : "Create Sprint"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default SprintCreationForm;
