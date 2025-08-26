import { neon } from "@neondatabase/serverless";

import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

const sql = neon(
  "postgresql://neondb_owner:npg_dX8nIuEA7Kgc@ep-noisy-water-a82lxtyj-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require"
);

export const db = drizzle(sql, { schema });
