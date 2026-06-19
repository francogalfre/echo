# Drizzle ORM Standards

- Always use type inference: `const result = await db.query.projects.findFirst(...)`
- Never write raw SQL unless absolutely necessary
- Use `with: {}` to load relationships, not separate queries
- Migrations are auto-generated — commit them
- Use RLS policies on Postgres for multi-tenancy
