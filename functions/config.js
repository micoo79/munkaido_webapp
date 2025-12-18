export async function onRequest(context) {
  const supabaseUrl = context.env.SUPABASE_URL;
  const supabaseAnonKey = context.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return new Response(JSON.stringify({
      error: "Missing SUPABASE_URL or SUPABASE_ANON_KEY in Cloudflare Pages Variables & Secrets."
    }), { status: 500, headers: { "content-type": "application/json; charset=utf-8" } });
  }

  return new Response(JSON.stringify({
    supabaseUrl,
    supabaseAnonKey
  }), { status: 200, headers: { "content-type": "application/json; charset=utf-8" } });
}
