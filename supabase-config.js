// Supabase Configuration

const SUPABASE_URL = 'https://jxlinfzcfbpfmlurxsqm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4bGluZnpjZmJwZm1sdXJ4c3FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MDAxNzYsImV4cCI6MjA3NjE3NjE3Nn0.QnT4IIuizYALcLi-9JV0u0ZIeff1GHQGh7NKAY8LxT8';

// Create client and expose BOTH names
window.supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

console.log('Supabase initialized:', window.supabase ? '✅' : '❌');
