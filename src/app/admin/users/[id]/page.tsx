/* eslint-disable prettier/prettier */
'use client'

import { Button } from '@/components/button'
import { Container } from '@/components/container'
import Input from '@/components/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { courses } from '@/consts/courses'
import { educationLevels } from '@/consts/education-levels'

const editUserSchema = z.object({
    name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
    role: z.string(),
    course: z.string(),
    education_level: z.string(),
    cellphone: z.string().optional(),
    birthday: z.string().optional(),
    expires_at: z.string().optional(),
})


type EditUserData = z.infer<typeof editUserSchema>

interface User {
    id: string
    name: string
    email: string
    role: string
    course: string
    education_level: string
    cellphone?: string | null
    birthday?: string | null
    expires_at?: string | null
}

import React from 'react'

export default function EditUser({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = React.use(paramsPromise)
    const [user, setUser] = useState<User | null>(null)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors, isSubmitting },
    } = useForm<EditUserData>({
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            expires_at: '',
        },
    })

    useEffect(() => {
        async function loadUser() {
            try {
                const response = await fetch(`/api/v1/users/${params.id}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch user')
                }
                const data = await response.json()
                const userData = data.user
                setUser(userData)
                setValue('name', userData.name)
                setValue('role', userData.role || 'user')
                setValue('course', userData.course)
                setValue('education_level', userData.education_level)
                setValue('cellphone', userData.cellphone || '')
                setValue(
                    'birthday',
                    userData.birthday ? userData.birthday.slice(0, 10) : '',
                )
                setValue(
                    'expires_at',
                    userData.expires_at ? userData.expires_at.slice(0, 10) : '',
                )
            } catch (error) {
                console.error('Erro ao carregar usuário:', error)
                alert('Erro ao carregar usuário')
                router.push('/admin/users')
            }
        }
        loadUser()
    }, [params.id, setValue, router])

    async function handleEditUser(data: EditUserData) {
        try {
            const payload = {
                ...data,
                cellphone: data.cellphone?.trim() || null,
                birthday: data.birthday || null,
                expires_at: data.expires_at ? new Date(data.expires_at).toISOString() : null,
            }

            const response = await fetch(`/api/v1/users/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                throw new Error('Failed to update user')
            }

            alert('Usuário atualizado com sucesso!')
            router.push('/admin/users')
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error)
            alert('Erro ao atualizar usuário')
        }
    }

    if (!user) {
        return (
            <Container>
                <div className="flex h-96 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-indigo-600" />
                </div>
            </Container>
        )
    }

    return (
        <div className="min-h-screen py-10">
            <Container>
                <div className="mb-8 flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                    >
                        ← Voltar
                    </button>
                </div>

                <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-zinc-900/5">
                    <div className="border-b border-zinc-100 bg-zinc-50/50 px-8 py-6">
                        <h2 className="text-lg font-semibold text-zinc-900">
                            Editar Usuário
                        </h2>
                        <p className="mt-1 text-sm text-zinc-500">
                            Atualize as informações e permissões do usuário.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit(handleEditUser)}
                        className="flex flex-col gap-6 p-8"
                    >
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="col-span-2">
                                <label className="mb-2 block text-sm font-medium text-zinc-700">
                                    Nome Completo
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Nome do usuário"
                                    register={register('name')}
                                    className="w-full rounded-lg border-zinc-200 bg-white px-4 py-2 text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                />
                                {errors.name && (
                                    <span className="mt-1 text-xs text-red-500">
                                        {errors.name.message}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-700">
                                    Curso
                                </label>
                                <select
                                    {...register('course')}
                                    className="h-12 w-full rounded-lg border border-zinc-200 bg-white px-4 text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                >
                                    <option value="">Selecione o curso</option>
                                    {courses.map((course) => (
                                        <option key={course} value={course}>
                                            {course}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-700">
                                    Nível de Educação
                                </label>
                                <select
                                    {...register('education_level')}
                                    className="h-12 w-full rounded-lg border border-zinc-200 bg-white px-4 text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                >
                                    <option value="">Selecione o nível</option>
                                    {educationLevels.map((level) => (
                                        <option key={level} value={level}>
                                            {level}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-700">
                                    Celular
                                </label>
                                <Input
                                    type="tel"
                                    placeholder="(99) 99999-9999"
                                    register={register('cellphone')}
                                    className="w-full rounded-lg border-zinc-200 bg-white px-4 py-2 text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-700">
                                    Data de aniversário
                                </label>
                                <Input
                                    type="date"
                                    register={register('birthday')}
                                    className="w-full rounded-lg border-zinc-200 bg-white px-4 py-2 text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="mb-2 block text-sm font-medium text-zinc-700">
                                    Permissão de Acesso
                                </label>
                                <div className="relative">
                                    <select
                                        {...register('role')}
                                        className="h-12 w-full appearance-none rounded-lg border border-zinc-200 bg-white px-4 text-zinc-900 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                    >
                                        <option value="user">Usuário Comum</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">
                                        ▼
                                    </div>
                                </div>
                                <p className="mt-2 text-xs text-zinc-500">
                                    Administradores têm acesso total às configurações do sistema.
                                </p>
                            </div>

                            <div className="col-span-2">
                                <label className="mb-2 block text-sm font-medium text-zinc-700">
                                    Expira em (Atividade do Usuário)
                                </label>
                                <Input
                                    type="date"
                                    register={register('expires_at')}
                                    className="w-full rounded-lg border-zinc-200 bg-white px-4 py-2 text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                />
                                <p className="mt-2 text-xs text-zinc-500">
                                    O usuário é considerado ativo se a data atual for anterior à data de expiração.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-end gap-4 border-t border-zinc-100 pt-6">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                            >
                                Cancelar
                            </button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="!mt-0 !w-auto min-w-[140px] rounded-lg bg-indigo-600 px-6 py-2 font-medium text-white shadow-sm transition-all hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Container>
        </div>
    )
}
