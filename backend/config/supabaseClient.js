const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) throw new Error("SUPABASE_URL is required");
if (!SUPABASE_KEY) throw new Error("SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY is required");

const supabase = createClient(process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY);
module.exports = supabase;