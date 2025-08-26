export default {
  dialect: "postgresql",
  schema: "./utils/db/schema.ts",
  out: "./drizzle",

  dbCredentials: {
    url: "postgresql://neondb_owner:npg_dX8nIuEA7Kgc@ep-noisy-water-a82lxtyj-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require",
    connectionString:
      "postgresql://neondb_owner:npg_dX8nIuEA7Kgc@ep-noisy-water-a82lxtyj-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require",
  },
};
