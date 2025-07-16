import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  "https://tnfsnbzjrlpqqiklszua.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZnNuYnpqcmxwcXFpa2xzenVhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjY0MjI5NywiZXhwIjoyMDY4MjE4Mjk3fQ.1_UhL00stkSZ4j1UUZj7EJjSfeKFlPE_wn8coPB_K-c"
)

export default supabase
