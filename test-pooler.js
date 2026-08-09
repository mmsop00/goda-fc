// Test direct pg connection to pooler - different configs
const { Client } = require("pg");

async function testConfig(name, config) {
  console.log(`\n--- ${name} ---`);
  const client = new Client(config);
  try {
    await client.connect();
    console.log("CONNECTED!");
    const res = await client.query("SELECT 1 as test");
    console.log("Query result:", res.rows);
    await client.end();
  } catch (e) {
    console.log("Error:", e.message);
  }
}

async function main() {
  // Config 1: Pooler 6543 with project ref in username
  await testConfig("Pooler 6543 + project ref", {
    host: "aws-0-ap-southeast-1.pooler.supabase.com",
    port: 6543,
    user: "postgres.zsexgcpebeibiqsuwzqs",
    password: "GODA2026secureDB!",
    database: "postgres",
    ssl: { rejectUnauthorized: false },
  });

  // Config 2: Pooler 5432 with postgres user (session mode)
  await testConfig("Pooler 5432 + postgres user", {
    host: "aws-0-ap-southeast-1.pooler.supabase.com",
    port: 5432,
    user: "postgres",
    password: "GODA2026secureDB!",
    database: "postgres",
    ssl: { rejectUnauthorized: false },
  });

  // Config 3: Pooler 5432 with project ref in username
  await testConfig("Pooler 5432 + project ref", {
    host: "aws-0-ap-southeast-1.pooler.supabase.com",
    port: 5432,
    user: "postgres.zsexgcpebeibiqsuwzqs",
    password: "GODA2026secureDB!",
    database: "postgres",
    ssl: { rejectUnauthorized: false },
  });

  // Config 4: Direct connection
  await testConfig("Direct 5432", {
    host: "db.zsexgcpebeibiqsuwzqs.supabase.co",
    port: 5432,
    user: "postgres",
    password: "GODA2026secureDB!",
    database: "postgres",
    ssl: { rejectUnauthorized: false },
  });
}

main();
