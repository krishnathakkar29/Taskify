import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    console.log("yaha hu");
    const { data } = await req.json();
    console.log(data);
    const user = await prisma.user.upsert({
      where: {
        clerkId: data.id,
      },
      update: {
        clerkId: data.id,
        name: `${data.first_name} ${data.last_name}`,
        imageUrl: data.imageUrl,
        email: data.email_addresses[0].email_address,
      },
      create: {
        clerkId: data.id,
        name: `${data.first_name} ${data.last_name}`,
        imageUrl: data.imageUrl,
        email: data.email_addresses[0].email_address,
      },
    });
    console.log("user created");
    console.log(user);
    return new Response("Webhook Received", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Error Webhook", { status: 400 });
  }
}
