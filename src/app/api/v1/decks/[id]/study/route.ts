import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { prisma } from "@/lib/prisma"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
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
                id,
                user_id: user.id,
            },
        })

        if (!deck) {
            return new NextResponse("Deck not found", { status: 404 })
        }

        // Fetch cards that are due for review (next_review <= now)
        const cards = await prisma.flashcard.findMany({
            where: {
                deck_id: id,
                next_review: {
                    lte: new Date(),
                },
            },
            orderBy: {
                next_review: "asc",
            },
        })

        return NextResponse.json(cards)
    } catch (error) {
        console.error("[STUDY_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
