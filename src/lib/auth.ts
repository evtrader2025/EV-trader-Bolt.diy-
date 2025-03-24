import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type UserType = 'admin' | 'dealer' | 'private';

export interface AuthError {
  message: string;
}

export async function signUp(email: string, password: string, userType: UserType, fullName: string) {
  try {
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) throw signUpError;

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            user_type: userType,
            full_name: fullName,
          },
        ]);

      if (profileError) throw profileError;
    }

    return { user: authData.user, error: null };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : 'An error occurred during sign up',
    };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { user: data.user, error: null };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : 'An error occurred during sign in',
    };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'An error occurred during sign out',
    };
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return { user: { ...user, profile }, error: null };
    }

    return { user: null, error: null };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching user',
    };
  }
}
