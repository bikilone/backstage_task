import type { Product as PrismaProduct } from '@prisma/client'
import type { GetResult } from '@prisma/client/runtime'

export type Product = SerializeObject<GetResult<PrismaProduct>>
