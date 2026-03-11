import { defineConfig } from '@prisma/config'
import 'dotenv/config'

export default Object.assign(defineConfig({

  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
}))
