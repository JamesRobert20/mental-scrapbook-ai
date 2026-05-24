import bcrypt from 'bcryptjs'
import * as ExpoCrypto from 'expo-crypto'

// bcryptjs has no CSPRNG on React Native; route it through expo-crypto.
bcrypt.setRandomFallback(length => Array.from(ExpoCrypto.getRandomBytes(length)))

const ROUNDS = 10

export async function hashPassword(plain: string): Promise<string> {
    const salt = await bcrypt.genSalt(ROUNDS)
    return bcrypt.hash(plain, salt)
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash)
}
