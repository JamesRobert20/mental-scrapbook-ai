import { z } from 'zod'

export const signInSchema = z.object({
    email: z.email(),
    password: z.string().min(8)
})

export const signUpSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.email(),
    password: z.string().min(8)
})

export const updateProfileSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.email('Enter a valid email')
})

export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
