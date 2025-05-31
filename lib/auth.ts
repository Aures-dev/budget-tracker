import jwt from 'jsonwebtoken';

export const verifyAuth = async (token: string): Promise<boolean> => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return !!decoded;
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
}; 