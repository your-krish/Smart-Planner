// Supabase Configuration
// Replace these with your actual Supabase credentials

const SUPABASE_URL = 'https://jxlinfzcfbpfmlurxsqm.supabase.co'; // I got this from Supabase Dashboard -> Settings -> API
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4bGluZnpjZmJwZm1sdXJ4c3FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MDAxNzYsImV4cCI6MjA3NjE3NjE3Nn0.QnT4IIuizYALcLi-9JV0u0ZIeff1GHQGh7NKAY8LxT8'; // Get from Supabase Dashboard → Settings → API

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test connection

console.log('Supabase initialized:', supabase ? '✅' : '❌');
