import { NextResponse } from 'next/server';
import { 
  readBlogs, writeBlogs, readSources, writeSources, deleteBlog, deleteSource, NewsSource, BlogPost 
} from '@/lib/blogDb';
import { supabase } from '@/lib/db';

async function checkAuth(request: Request): Promise<boolean> {
  if (!supabase) return true; // Offline local sandbox bypass
  
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token) return false;
  if (token === 'localSandbox') return true; // Bypass validation for local developer passcode session
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return false;
    return true;
  } catch (err) {
    return false;
  }
}

export async function GET(request: Request) {
  try {
    const isAuthorized = await checkAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized access.' }, { status: 401 });
    }

    const blogs = await readBlogs();
    const sources = await readSources();
    return NextResponse.json({ success: true, blogs, sources });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAuthorized = await checkAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized access.' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    const sources = await readSources();
    const blogs = await readBlogs();

    if (action === 'add_source') {
      const { name, feedUrl } = body;
      if (!name || !feedUrl) {
        return NextResponse.json({ success: false, error: 'Name and Feed URL are required.' }, { status: 400 });
      }

      const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      if (sources.some(s => s.id === id)) {
        return NextResponse.json({ success: false, error: 'A news source with this name already exists.' }, { status: 400 });
      }

      const newSource: NewsSource = { id, name, feedUrl, enabled: true };
      sources.push(newSource);
      await writeSources(sources);

      return NextResponse.json({ success: true, sources });
    }

    if (action === 'update_source') {
      const { id, name, feedUrl, enabled } = body;
      if (!id) {
        return NextResponse.json({ success: false, error: 'Source ID is required.' }, { status: 400 });
      }

      const index = sources.findIndex(s => s.id === id);
      if (index === -1) {
        return NextResponse.json({ success: false, error: 'Source not found.' }, { status: 404 });
      }

      sources[index] = {
        ...sources[index],
        ...(name !== undefined && { name }),
        ...(feedUrl !== undefined && { feedUrl }),
        ...(enabled !== undefined && { enabled })
      };
      await writeSources(sources);

      return NextResponse.json({ success: true, sources });
    }

    if (action === 'toggle_source') {
      const { id } = body;
      if (!id) {
        return NextResponse.json({ success: false, error: 'Source ID is required.' }, { status: 400 });
      }

      const index = sources.findIndex(s => s.id === id);
      if (index === -1) {
        return NextResponse.json({ success: false, error: 'Source not found.' }, { status: 404 });
      }

      sources[index].enabled = !sources[index].enabled;
      await writeSources(sources);

      return NextResponse.json({ success: true, sources });
    }

    if (action === 'delete_source') {
      const { id } = body;
      if (!id) {
        return NextResponse.json({ success: false, error: 'Source ID is required.' }, { status: 400 });
      }

      await deleteSource(id);
      const updatedSources = await readSources();

      return NextResponse.json({ success: true, sources: updatedSources });
    }

    if (action === 'delete_blog') {
      const { slug } = body;
      if (!slug) {
        return NextResponse.json({ success: false, error: 'Blog slug is required.' }, { status: 400 });
      }

      await deleteBlog(slug);
      const updatedBlogs = await readBlogs();

      return NextResponse.json({ success: true, blogs: updatedBlogs });
    }

    if (action === 'update_blog') {
      const { slug, title, category, excerpt, readTime, color, content } = body;
      if (!slug) {
        return NextResponse.json({ success: false, error: 'Blog slug is required.' }, { status: 400 });
      }

      const index = blogs.findIndex(b => b.slug === slug);
      if (index === -1) {
        return NextResponse.json({ success: false, error: 'Blog post not found.' }, { status: 404 });
      }

      blogs[index] = {
        ...blogs[index],
        ...(title !== undefined && { title }),
        ...(category !== undefined && { category }),
        ...(excerpt !== undefined && { excerpt }),
        ...(readTime !== undefined && { readTime }),
        ...(color !== undefined && { color }),
        ...(content !== undefined && { content })
      };
      await writeBlogs(blogs);

      return NextResponse.json({ success: true, blogs });
    }

    if (action === 'add_blog') {
      const { title, category, excerpt, readTime, color, content } = body;
      if (!title || !content) {
        return NextResponse.json({ success: false, error: 'Title and content are required.' }, { status: 400 });
      }

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      if (blogs.some(b => b.slug === slug)) {
        return NextResponse.json({ success: false, error: 'A blog post with this title/slug already exists.' }, { status: 400 });
      }

      const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      const currentDate = new Date().toLocaleDateString('en-US', dateOptions);

      const newBlog: BlogPost = {
        slug,
        title,
        category: category || 'AI Strategy',
        excerpt: excerpt || '',
        readTime: readTime || '5 min read',
        date: currentDate,
        color: color || '#6366F1',
        content,
        sourceName: 'Admin Panel'
      };

      const updated = [newBlog, ...blogs];
      await writeBlogs(updated);

      return NextResponse.json({ success: true, blogs: updated });
    }

    return NextResponse.json({ success: false, error: 'Invalid admin action.' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
