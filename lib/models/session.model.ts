import type { InferSelectModel } from 'drizzle-orm'

import { sessions } from '@/lib/db/schema'

export type SessionRow = InferSelectModel<typeof sessions>
