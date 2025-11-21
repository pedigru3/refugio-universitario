import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const CONFIG_KEYS = {
    isOpen: 'isOpen',
    capacity: 'capacityLevel',
}

function sanitizeCapacity(value?: string | null) {
    const parsed = Number(value)
    if (!Number.isFinite(parsed)) return 0
    return Math.min(5, Math.max(0, Math.trunc(parsed)))
}

export async function GET() {
    try {
        const configs = await prisma.systemConfig.findMany({
            where: {
                key: {
                    in: [CONFIG_KEYS.isOpen, CONFIG_KEYS.capacity],
                },
            },
        })

        const map = configs.reduce<Record<string, string>>((acc, item) => {
            acc[item.key] = item.value
            return acc
        }, {})

        const isOpen = map[CONFIG_KEYS.isOpen] === 'true'
        const capacityLevel = sanitizeCapacity(map[CONFIG_KEYS.capacity])

        return NextResponse.json({
            isOpen,
            capacityLevel,
        })
    } catch (error) {
        console.error('Error fetching system status:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 },
        )
    }
}

const updateStatusSchema = z.object({
    isOpen: z.boolean(),
    capacityLevel: z.number().int().min(0).max(5),
})

export async function PATCH(req: Request) {
    try {
        const body = await req.json()
        const { isOpen, capacityLevel } = updateStatusSchema.parse(body)

        const normalizedCapacity = isOpen ? capacityLevel : 0

        await prisma.$transaction([
            prisma.systemConfig.upsert({
                where: { key: CONFIG_KEYS.isOpen },
                update: { value: String(isOpen) },
                create: { key: CONFIG_KEYS.isOpen, value: String(isOpen) },
            }),
            prisma.systemConfig.upsert({
                where: { key: CONFIG_KEYS.capacity },
                update: { value: String(normalizedCapacity) },
                create: {
                    key: CONFIG_KEYS.capacity,
                    value: String(normalizedCapacity),
                },
            }),
        ])

        return NextResponse.json({ isOpen, capacityLevel: normalizedCapacity })
    } catch (error) {
        console.error('Error updating system status:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 },
        )
    }
}
