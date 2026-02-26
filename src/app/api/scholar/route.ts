import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { searchGoogleScholarAuthor } from '@/lib/scholar';

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
        const publications = await searchGoogleScholarAuthor(name);
        return NextResponse.json({ publications });
    } catch (error) {
        console.error('Scholar API error:', error);
        return NextResponse.json({ error: 'Failed to fetch Scholar data' }, { status: 500 });
    }
}
