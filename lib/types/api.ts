export type ApiErrorBody = {
    error: {
        code: string
        message: string
    }
}

export type AuthResponse = {
    token: string
    user: {
        id: string
        email: string
        firstName: string
        lastName: string
    }
}
