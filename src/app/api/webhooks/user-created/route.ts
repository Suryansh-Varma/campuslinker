// /app/api/webhooks/user-created/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const payload = await req.json();

  const { id, email_addresses, first_name, last_name } = payload;

  const email = email_addresses?.[0]?.email_address;

  await prisma.user.create({
    data: {
      clerkId: id,
      email,
      name: `${first_name} ${last_name}`,
    },
  });

  return NextResponse.json({ success: true });
}
