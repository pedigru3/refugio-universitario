import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { prisma } from "@/lib/prisma"

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
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

        const deck = await prisma.deck.findFirst({
            where: {
                id: params.id,
                user_id: user.id,
            },
            include: {
                _count: {
                    select: { flashcards: true },
                },
            },
        })

        if (!deck) {
            return new NextResponse("Deck not found", { status: 404 })
        }

        return NextResponse.json(deck)
    } catch (error) {
        console.error("[DECK_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
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

        const deck = await prisma.deck.findFirst({
            where: {
                id: params.id,
                user_id: user.id,
            },
        })

        if (!deck) {
            return new NextResponse("Deck not found", { status: 404 })
        }

        await prisma.deck.delete({
            where: {
                id: params.id,
            },
        })

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error("[DECK_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
