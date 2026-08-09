// Test API to check IPv6 connectivity on Vercel
export const dynamic = "force-dynamic";

export async function GET() {
  const dns = require("dns");
  const results: any = {};
  
  try {
    const ipv4 = await dns.promises.resolve4("db.zsexgcpebeibiqsuwzqs.supabase.co").catch(() => []);
    const ipv6 = await dns.promises.resolve6("db.zsexgcpebeibiqsuwzqs.supabase.co").catch(() => []);
    results.db = { ipv4, ipv6 };
  } catch (e: any) {
    results.db = { error: e.message };
  }
  
  try {
    const ipv4 = await dns.promises.resolve4("aws-0-ap-southeast-1.pooler.supabase.com").catch(() => []);
    const ipv6 = await dns.promises.resolve6("aws-0-ap-southeast-1.pooler.supabase.com").catch(() => []);
    results.pooler = { ipv4, ipv6 };
  } catch (e: any) {
    results.pooler = { error: e.message };
  }
  
  return Response.json(results);
}
