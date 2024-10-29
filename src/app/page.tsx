import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  BarChart,
  Calendar,
  ChevronRight,
  Layout,
} from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

const features = [
  {
    title: "Intuitive Kanban Boards",
    description:
      "Visualize your workflow and optimize team productivity with our easy-to-use Kanban boards.",
    icon: Layout,
  },
  {
    title: "Powerful Sprint Planning",
    description:
      "Plan and manage sprints effectively, ensuring your team stays focused on delivering value.",
    icon: Calendar,
  },
  {
    title: "Comprehensive Reporting",
    description:
      "Gain insights into your team's performance with detailed, customizable reports and analytics.",
    icon: BarChart,
  },
];

const faqs = [
  {
    question: "What is Taskify?",
    answer:
      "Taskify is a powerful project management tool designed to help teams organize, track, and manage their work efficiently. It combines intuitive design with robust features to streamline your workflow and boost productivity.",
  },
  {
    question: "How does Taskify compare to other project management tools?",
    answer:
      "Taskify offers a unique combination of intuitive design, powerful features, and flexibility. Unlike other tools, we focus on providing a seamless experience for both agile and traditional project management methodologies, making it versatile for various team structures and project types.",
  },
  {
    question: "Is Taskify suitable for small teams?",
    answer:
      "Absolutely! Taskify is designed to be scalable and flexible. It works great for small teams and can easily grow with your organization as it expands. Our user-friendly interface ensures that teams of any size can quickly adapt and start benefiting from Taskify's features.",
  },
  {
    question: "What key features does Taskify offer?",
    answer:
      "Taskify provides a range of powerful features including intuitive Kanban boards for visualizing workflow, robust sprint planning tools for agile teams, comprehensive reporting for data-driven decisions, customizable workflows, time tracking, and team collaboration tools. These features work seamlessly together to enhance your project management experience.",
  },
  {
    question: "Can Taskify handle multiple projects simultaneously?",
    answer:
      "Yes, Taskify is built to manage multiple projects concurrently. You can easily switch between projects, and get a bird's-eye view of all your ongoing work. This makes Taskify ideal for organizations juggling multiple projects or clients.",
  },
  {
    question: "Is there a learning curve for new users?",
    answer:
      "While Taskify is packed with features, we've designed it with user-friendliness in mind. New users can quickly get up to speed thanks to our intuitive interface, helpful onboarding process, and comprehensive documentation.",
  },
];

export default function Home() {
  return (
    <BackgroundBeamsWithCollision>
      <div className="min-h-screen">
        <section className="flex flex-col items-center w-full justify-center h-[70vh]">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold  pb-6 flex flex-col font-sans tracking-tight">
            Streamline your
            <p>Workflow with</p>
            <p className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
              <span className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4 inline-block">
                <span className="">Taskify</span>
              </span>
            </p>
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto text-center">
            Empower your team with our intuitive project management solution.
          </p>
          <div className="text-center">
            <Link href="/onboarding">
              <Button size="lg" className="mr-4">
                Get Started <ChevronRight size={18} className="ml-1" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </section>

        <section id="features" className="py-20 px-5">
          <div className="container mx-auto">
            <h3 className="text-3xl font-bold mb-12 text-center">
              Key Features
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-gray-800 py-8">
                  <CardContent className="pt-6">
                    <feature.icon className="h-12 w-12 mb-4 text-blue-300" />
                    <h4 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10 px-5">
          <div className="container mx-auto">
            <h3 className="text-3xl font-bold mb-12 text-center">
              Frequently Asked Questions
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="py-20 text-center px-5 bg-gray-900/30 ">
          <div className="container mx-auto">
            <h3 className="text-3xl font-bold mb-6">
              Ready to Transform Your Workflow?
            </h3>
            <p className="text-xl mb-12">
              Join thousands of teams already using ZCRUM to streamline their
              projects and boost productivity.
            </p>
            <Link href="/onboarding">
              <Button size="lg" className="animate-bounce">
                Start For Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </BackgroundBeamsWithCollision>
  );
}
