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
  created_at?: string;
};

export async function syncUserToSupabase(userId: string) {
  try {
    // Get user from Clerk
    const user = await clerkClient.users.getUser(userId);

    if (!user) {
      throw new Error(`User ${userId} not found in Clerk`);
    }

    // Get primary email or fallback
    const primaryEmail = user.emailAddresses.find(
      email => email.id === user.primaryEmailAddressId
    )?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? null;

    // Prepare profile data
    const profileData: Profile = {
      id: user.id,
      full_name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || null,
      email: primaryEmail,
    };

    // Upsert profile into Supabase
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(profileData);

    if (profileError) {
      throw profileError;
    }

    // Insert sign-in record into signins table
    const { error: signinError } = await supabase
      .from('signins')
      .insert({
        user_id: user.id,
        email: primaryEmail,
        // signed_in_at will default to now()
      });

    if (signinError) {
      throw signinError;
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
