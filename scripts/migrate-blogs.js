const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Load env variables from .env.local manually to avoid dot-env dependency
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('.env.local file not found! Make sure you are running this from the project root.');
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const parts = trimmed.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
      env[key] = val;
    }
  });
  return env;
}

const env = loadEnv();
const supabaseUrl = env.SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_KEY must be defined in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

async function migrate() {
  console.log('Starting migration to Supabase...');

  // --- Migrate News Sources ---
  const sourcesPath = path.join(__dirname, '..', 'data', 'sources.json');
  if (fs.existsSync(sourcesPath)) {
    try {
      const rawSources = JSON.parse(fs.readFileSync(sourcesPath, 'utf-8'));
      console.log(`Found ${rawSources.length} news sources locally.`);

      const mappedSources = rawSources.map(s => ({
        id: s.id,
        name: s.name,
        feed_url: s.feedUrl,
        enabled: s.enabled
      }));

      const { data, error } = await supabase
        .from('news_sources')
        .upsert(mappedSources, { onConflict: 'id' });

      if (error) {
        if (error.code === '42P01') {
          console.error('\nERROR: Table "news_sources" does not exist in Supabase.');
          console.error('Please run the SQL statements provided in implementation_plan.md in your Supabase SQL editor first!\n');
        } else {
          console.error('Failed to upsert news sources:', error);
        }
      } else {
        console.log('Successfully migrated news sources to Supabase.');
      }
    } catch (err) {
      console.error('Error processing local news sources:', err.message);
    }
  } else {
    console.log('No local data/sources.json found. Skipping sources migration.');
  }

  // --- Migrate Blogs ---
  const blogsPath = path.join(__dirname, '..', 'data', 'blogs.json');
  if (fs.existsSync(blogsPath)) {
    try {
      const rawBlogs = JSON.parse(fs.readFileSync(blogsPath, 'utf-8'));
      console.log(`Found ${rawBlogs.length} blog posts locally.`);

      const mappedBlogs = rawBlogs.map(b => ({
        slug: b.slug,
        category: b.category,
        title: b.title,
        excerpt: b.excerpt,
        read_time: b.readTime,
        date: b.date,
        color: b.color,
        content: b.content,
        source_url: b.sourceUrl || null,
        source_name: b.sourceName || null
      }));

      const { data, error } = await supabase
        .from('blogs')
        .upsert(mappedBlogs, { onConflict: 'slug' });

      if (error) {
        if (error.code === '42P01') {
          console.error('\nERROR: Table "blogs" does not exist in Supabase.');
          console.error('Please run the SQL statements provided in implementation_plan.md in your Supabase SQL editor first!\n');
        } else {
          console.error('Failed to upsert blogs:', error);
        }
      } else {
        console.log('Successfully migrated blog posts to Supabase.');
      }
    } catch (err) {
      console.error('Error processing local blog posts:', err.message);
    }
  } else {
    console.log('No local data/blogs.json found. Skipping blogs migration.');
  }

  console.log('Migration step completed.');
}

migrate();
