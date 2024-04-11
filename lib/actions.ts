import { createClient } from '@supabase/supabase-js';

 const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || "",
);
 async function signInWithEmail() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'example@email.com',
      password: 'example-password',
    })
  }
  async function signUpNewUser() {
    const { data, error } = await supabase.auth.signUp({
      email: 'example@email.com',
      password: 'example-password',
      options: {
        emailRedirectTo: 'https://example.com/welcome',
      },
    })
  }
  
   async function signOut() {
    const { error } = await supabase.auth.signOut()
  }
      
  export default{signInWithEmail,signOut,signUpNewUser}