import { NextResponse } from 'next/server';
import { readBlogs } from '@/lib/blogDb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let posts = await readBlogs();

    // Sort by date descending (assuming latest first)
    // Convert e.g. "March 10, 2026" or other formats to Date
    posts.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });

    if (category && category !== 'All') {
      posts = posts.filter(
        (post) => post.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      const query = search.toLowerCase();
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({ success: true, posts });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
