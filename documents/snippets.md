<!-- prisma orm snippets -->

bun add prisma tsx @types/pg --dev

bun add @prisma/client @prisma/adapter-pg dotenv pg

bunx prisma init --output ../lib/generated/prisma

bunx prisma migrate dev --name initial

bunx prisma generate

bunx prisma db seed

bunx prisma studio

<!-- better auth -->
bun x auth@latest generate

<!-- react email -->
bun email:dev