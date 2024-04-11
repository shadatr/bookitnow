// "use server"
import { createClient } from '@supabase/supabase-js';

 export const supabase = createClient(
  process.env.SUPABASE_URL || "https://bleudnkojnsfvjsecven.supabase.co/",
  process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsZXVkbmtvam5zZnZqc2VjdmVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkwMzE1OTUsImV4cCI6MjAyNDYwNzU5NX0.xbC47ESHLcY4yPEzQJGaYqKAecqmBkLSaYWBQ7-vOgI",
);