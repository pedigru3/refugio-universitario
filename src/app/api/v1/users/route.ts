import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const data = { teste: "teste" };

  const users = await prisma.user.findMany();
  return Response.json({ users, data }, { status: 200 });
}

export async function POST(req: Request) {
  const { name, username, last_name } = await req.json();

  const user = await prisma.user.create({
    data: {
      name,
      last_name,
      username,
    },
  });

  cookies().set("@refugiouniversitario:userId", user.id, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  const data = { teste: "teste" };
  return Response.json({ data }, { status: 201 });
}
