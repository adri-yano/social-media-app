import { z } from 'zod'

export const registerSchema = z.object({
	username: z.string().min(3).max(24).regex(/^[a-zA-Z0-9_]+$/),
	name: z.string().min(1).max(50).optional(),
	email: z.string().email(),
	password: z.string().min(8).max(100),
})

export const loginSchema = z.object({
	identifier: z.string().min(3), // email or username
	password: z.string().min(8).max(100),
})

export const postCreateSchema = z.object({
	content: z.string().min(1).max(5000),
	image: z.string().url().optional(),
})

export const postUpdateSchema = z.object({
	content: z.string().min(1).max(5000).optional(),
	image: z.string().url().nullable().optional(),
})

export const commentCreateSchema = z.object({
	content: z.string().min(1).max(2000),
	parentCommentId: z.string().uuid().optional(),
})

export const profileUpdateSchema = z.object({
	name: z.string().min(1).max(50).optional(),
	bio: z.string().max(500).optional(),
	avatar: z.string().url().nullable().optional(),
})
