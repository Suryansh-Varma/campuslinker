// lib/syncUserToSupabase.ts
import { clerkClient } from '@clerk/clerk-sdk-node';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Type matching your Supabase profiles table
type Profile = {
  id: string;
  full_name?: string | null;
  email?: string | null;
  created_at?: string; // Supabase will handle the default timestamp
};

export async function syncUserToSupabase(userId: string) {
  try {
    // Get user from Clerk
    const user = await clerkClient.users.getUser(userId);
    
    if (!user) {
      throw new Error(`User ${userId} not found in Clerk`);
    }

    // Get primary email or fallback to first email
    const primaryEmail = user.emailAddresses.find(
      email => email.id === user.primaryEmailAddressId
    )?.emailAddress;

    // Prepare data matching your table structure
    const profileData: Profile = {
      id: user.id,
      full_name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || null,
      email: primaryEmail ?? user.emailAddresses[0]?.emailAddress ?? null,
      // created_at is handled by Supabase default
    };

    // Upsert into Supabase
    const { error } = await supabase
      .from('profiles')
      .upsert(profileData);

    if (error) {
      throw error;
    }

    return { success: true, userId: user.id };
  } catch (error) {
    console.error('Error syncing user to Supabase:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      userId 
    };
  }
}