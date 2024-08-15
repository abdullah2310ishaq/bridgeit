import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// Mock database operations
const registerUser = async (userData: any) => {
  // Replace this with actual database interaction
  console.log('Registering user:', userData);
  return { status: 200 }; // Example response
};

export async function POST(request: NextRequest) {
  try {
    const { role, ...data } = await request.json();

    if (!role) {
      return NextResponse.json({ error: 'Role is required' }, { status: 400 });
    }

    switch (role) {
      case 'student':
        // Handle student registration
        data.role = 'student';
        break;
      case 'faculty':
        // Handle faculty registration
        data.role = 'faculty';
        break;
      case 'industryExpert':
        // Handle industry expert registration
        data.role = 'industryExpert';
        break;
      case 'admin':
        // Handle university admin registration
        data.role = 'admin';
        break;
      default:
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const response = await registerUser(data);

    if (response.status === 200) {
      return NextResponse.json({ message: 'Registration successful!' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error handling registration:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
