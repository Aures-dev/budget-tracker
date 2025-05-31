import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { uploadImage } from '@/lib/cloudinary';
import { verifyAuth } from '@/lib/auth';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('avatar') as File;
    const userId = formData.get('userId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

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

    // Convertir le fichier en buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload l'image sur Cloudinary
    const avatarUrl = await uploadImage(buffer);

    // Mettre à jour l'URL de l'avatar dans la base de données
    await connectDB();
    const result = await mongoose.connection.collection('users').updateOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $set: { avatarUrl } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ avatarUrl });
  } catch (error) {
    console.error('Error in avatar upload:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 