import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const users = await prisma.user.findMany();

  return Response.json({ users }, { status: 200 });
}

export async function POST(req: Request) {
  const { name, username } = await req.json();

  try {
    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (userAlreadyExists) {
      return Response.json({ error: "user already exists" }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        name,
        username: username.toLowerCase(),
      },
    });

    cookies().set("@refugiouniversitario:userId", user.id, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return Response.json({}, { status: 201 });
  } catch (error) {
    return Response.json({ error: `${error}` }, { status: 400 });
  }
}
