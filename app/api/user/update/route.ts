import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import mongoose from 'mongoose';

export async function PUT(request: Request) {
  try {
    const { userId, username, email } = await request.json();

    // Vérifier l'authentification
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'No authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const isValid = await verifyAuth(token);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    await connectDB();
    const existingUser = await mongoose.connection.collection('users').findOne({
      _id: { $ne: new mongoose.Types.ObjectId(userId) },
      email
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    // Mettre à jour les informations de l'utilisateur
    const result = await mongoose.connection.collection('users').updateOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $set: { username, email } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 