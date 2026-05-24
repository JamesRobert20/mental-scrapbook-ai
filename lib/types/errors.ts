export class AppError extends Error {
    constructor(
        message: string,
        readonly code: string
    ) {
        super(message)
        this.name = 'AppError'
    }
}

export class AuthError extends AppError {
    constructor(message: string, code = 'AUTH_ERROR') {
        super(message, code)
        this.name = 'AuthError'
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 'VALIDATION_ERROR')
        this.name = 'ValidationError'
    }
}

export class IntegrationError extends AppError {
    constructor(message: string, code = 'INTEGRATION_ERROR') {
        super(message, code)
        this.name = 'IntegrationError'
    }
}
