// app/api/signup/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return NextResponse.json({ message: 'User created', user: newUser }, { status: 201 })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
