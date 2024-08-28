// supabaseAuth.js

import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

// Sign up a new user with email and password
export const signUpWithEmail = async (email: string, password: string, displayName: string, phone: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                displayName,
                phone
            }
        }
    });

    if (error) throw error;
    return data;
};

// Sign in a user with email and password
export const signInWithEmail = async (email:any, password:any) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return data;
};

// Sign out the current user
export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

// Reset password for a user
export const resetPassword = async (email:any) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return data;
};

// Get the current user
export const getUser = async () => {
    return await supabase.auth.getUser();
};

// Update user details
export const updateUser = async (updates:any) => {
    const { data, error } = await supabase.auth.updateUser(updates);
    if (error) throw error;
    return data;
};

// OAuth Sign in (e.g., with Google, GitHub)
export const signInWithProvider = async (provider:any) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider, // e.g., 'google', 'github'
    });
    if (error) throw error;
    return { data };
};

export default supabase;
