// app/api/profile/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase server-side client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Only on the server
);

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { skills, institution, location } = body;

  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    skills,
    institution,
    location,
  });

  if (error) {
    console.error("Error updating profile:", error.message);
    return NextResponse.json({ error: "Database update failed" }, { status: 500 });
  }

  return NextResponse.json({ message: "Profile updated successfully" });
}
