import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { searchUSPTO } from '@/lib/uspto';

export async function GET(request: Request) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (!name) {
        return NextResponse.json({ error: 'Name parameter is required' }, { status: 400 });
    }

    try {
        const patents = await searchUSPTO(name);
        return NextResponse.json({ patents });
    } catch (error) {
        console.error('USPTO API error:', error);
        return NextResponse.json({ error: 'Failed to fetch USPTO data' }, { status: 500 });
    }
}
