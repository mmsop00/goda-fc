// Test direct pg connection to pooler
const { Client } = require("pg");

async function test() {
  // Try transaction pooler
  const client = new Client({
    host: "aws-0-ap-southeast-1.pooler.supabase.com",
    port: 6543,
    user: "postgres.zsexgcpebeibiqsuwzqs",
    password: "GODA2026secureDB!",
    database: "postgres",
    ssl: { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    console.log("CONNECTED to pooler!");
    const res = await client.query("SELECT 1 as test");
    console.log("Query result:", res.rows);
    await client.end();
  } catch (e) {
    console.log("Connection error:", e.message);
  }
}

test();
