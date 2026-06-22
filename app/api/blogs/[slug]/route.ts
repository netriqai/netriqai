import { NextResponse } from 'next/server';
import { readBlogs } from '@/lib/blogDb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const blogs = await readBlogs();
    const blog = blogs.find((b) => b.slug === slug);

    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Article module not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, blog });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
