import postgres from "postgres";

/**
 * Shared postgres.js connection to Supabase (via the pooler). Reused across
 * invocations through a global. Returns null when DATABASE_URL is unset so
 * subscribe endpoints can degrade gracefully. `prepare: false` keeps it
 * compatible with Supabase's transaction pooler.
 */
const globalForSql = globalThis as unknown as {
  sql?: ReturnType<typeof postgres> | null;
  schemaReady?: boolean;
};

export function getSql() {
  if (globalForSql.sql !== undefined) return globalForSql.sql;

  const url = process.env.DATABASE_URL;
  if (!url) {
    globalForSql.sql = null;
    return null;
  }

  globalForSql.sql = postgres(url, {
    prepare: false,
    ssl: "require",
    max: 1,
    idle_timeout: 20,
  });
  return globalForSql.sql;
}

/** Create the subscribers table once per process if it doesn't exist. */
export async function ensureSchema() {
  const sql = getSql();
  if (!sql || globalForSql.schemaReady) return sql;

  await sql`
    create table if not exists subscribers (
      id uuid primary key default gen_random_uuid(),
      email text unique not null,
      status text not null default 'pending',
      token uuid not null default gen_random_uuid(),
      created_at timestamptz not null default now(),
      confirmed_at timestamptz
    )
  `;
  globalForSql.schemaReady = true;
  return sql;
}
