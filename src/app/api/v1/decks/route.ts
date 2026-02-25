import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return new NextResponse("User not found", { status: 404 })
        }

        const decks = await prisma.deck.findMany({
            where: {
                user_id: user.id,
            },
            include: {
                _count: {
                    select: { flashcards: true },
                },
            },
            orderBy: {
                created_at: "desc",
            },
        })

        return NextResponse.json(decks)
    } catch (error) {
        console.error("[DECKS_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return new NextResponse("User not found", { status: 404 })
        }

        const body = await req.json()
        const { title, description } = body

        if (!title) {
            return new NextResponse("Title is required", { status: 400 })
        }

        const deck = await prisma.deck.create({
            data: {
                title,
                description,
                user_id: user.id,
            },
        })

        return NextResponse.json(deck)
    } catch (error) {
        console.error("[DECKS_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
