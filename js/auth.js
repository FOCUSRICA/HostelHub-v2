
import { supabase } from "./supabase.js";

/**
 * Register a new student.
 * The database should create the student's profile with role = 'student'.
 */
export async function registerStudent({
  email,
  password,
  fullName,
  phone
}) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        full_name: fullName.trim(),
        phone: phone.trim()
      }
    }
  });

  if (error) throw error;

  return data;
}

/**
 * Sign in an existing student or owner.
 */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password
  });

  if (error) throw error;

  return data;
}

/**
 * Get the signed-in user's profile and role.
 */
export async function getMyProfile() {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, phone, role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) throw profileError;

  return profile;
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}
