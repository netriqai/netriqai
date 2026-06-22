'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Calendar, BookOpen, Share2 } from 'lucide-react';
import Link from 'next/link';
import SectionReveal from '@/components/ui/SectionReveal';
import NeuralBackground from '@/components/ui/NeuralBackground';

interface BlogPost {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  color: string;
  content: string;
  sourceName?: string;
  sourceUrl?: string;
}

export default function BlogDetailsClient({ slug }: { slug: string }) {
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchBlog() {
      try {
        setLoading(true);
        const res = await fetch(`/api/blogs/${slug}`);
        const data = await res.json();
        if (data.success) {
          setBlog(data.blog);
        } else {
          setError(data.error || 'Failed to load article module.');
        }
      } catch (err) {
        setError('Connection failed. Please check your network.');
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Article link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center relative">
        <NeuralBackground />
        <div className="absolute inset-0 tech-grid opacity-[0.06] pointer-events-none" />
        <div className="w-10 h-10 border-4 border-[rgb(var(--accent-blue))] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-text-muted text-xs font-mono uppercase tracking-[0.2em]">Decompressing Module...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center relative">
        <NeuralBackground />
        <div className="absolute inset-0 tech-grid opacity-[0.06] pointer-events-none" />
        <div className="max-w-md p-8 rounded-[24px] bg-surface-1 border border-border-strong relative z-10">
          <h2 className="text-xl font-sans font-black text-text-primary uppercase tracking-tight mb-4">Module Unloaded</h2>
          <p className="text-text-muted text-sm leading-relaxed mb-6 opacity-80">{error || 'Article details could not be resolved.'}</p>
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[rgb(var(--accent-blue))] text-background text-xs font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(var(--accent-blue),0.3)] transition-all duration-300"
          >
            <ArrowLeft size={14} /> Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-32 overflow-hidden relative">
      <NeuralBackground />
      <div className="absolute inset-0 tech-grid opacity-[0.04] pointer-events-none" />

      {/* Background Spotlight Glow */}
      <div 
        className="absolute top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-[0.05]"
        style={{ backgroundColor: blog.color }}
      />

      <div className="section-container relative z-10 max-w-4xl mt-12">
        {/* Back navigation */}
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary text-xs font-mono uppercase tracking-wider mb-8 transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Knowledge Base
        </Link>

        {/* Article Meta Header */}
        <SectionReveal>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span 
              className="text-[10px] font-mono px-3.5 py-1.5 rounded-full border uppercase tracking-wider bg-surface-1"
              style={{ 
                color: blog.color,
                borderColor: `${blog.color}33`
              }}
            >
              {blog.category}
            </span>
            {blog.sourceName && (
              <span className="text-text-muted text-[10px] font-mono flex items-center gap-1.5 uppercase opacity-60">
                Source: {blog.sourceName}
              </span>
            )}
          </div>

          <h1 
            className="font-sans font-black text-text-primary leading-[1.05] tracking-tighter mb-8 uppercase"
            style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}
          >
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-border-strong/40 mb-12">
            <div className="flex items-center gap-6 text-text-muted text-xs font-mono uppercase opacity-70">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {blog.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {blog.readTime}
              </span>
            </div>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-1 border border-border-strong hover:border-text-primary/30 text-text-muted hover:text-text-primary text-xs font-mono uppercase tracking-wider transition-all duration-300"
            >
              <Share2 size={12} /> Share Module
            </button>
          </div>
        </SectionReveal>

        {/* Full Article Content */}
        <SectionReveal delay={100}>
          <article className="p-8 md:p-12 rounded-[32px] bg-surface-1/40 backdrop-blur-md border border-border-strong shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: blog.color }} />
            
            <div className="prose prose-invert max-w-none">
              {renderMarkdown(blog.content)}
            </div>

            {blog.sourceUrl && (
              <div className="mt-16 pt-8 border-t border-border-strong/30 flex items-center justify-between flex-wrap gap-4">
                <p className="text-text-muted text-xs font-mono uppercase opacity-60">
                  Verify original update transmission:
                </p>
                <a
                  href={blog.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-black text-text-primary uppercase tracking-widest hover:text-[rgb(var(--accent-blue))] transition-colors"
                >
                  Inspect Source Channel <Share2 size={12} />
                </a>
              </div>
            )}
          </article>
        </SectionReveal>
      </div>
    </div>
  );
}

function renderMarkdown(content: string) {
  if (!content) return null;
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  let keyCounter = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Handle Unordered Lists
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const text = line.substring(2);
      currentList.push(
        <li key={`li-${keyCounter++}`} className="text-text-muted text-sm leading-relaxed mb-2 list-disc ml-6">
          {parseInlineMarkdown(text)}
        </li>
      );
      continue;
    } else if (currentList.length > 0) {
      elements.push(<ul key={`ul-${keyCounter++}`} className="my-4">{[...currentList]}</ul>);
      currentList = [];
    }

    // Handle Headers
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${keyCounter++}`} className="text-lg font-bold text-text-primary mt-6 mb-3 font-sans tracking-tight uppercase">
          {parseInlineMarkdown(line.substring(4))}
        </h3>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${keyCounter++}`} className="text-xl md:text-2xl font-black text-text-primary mt-8 mb-4 font-sans tracking-tight border-b border-border-strong/30 pb-2 uppercase">
          {parseInlineMarkdown(line.substring(3))}
        </h2>
      );
    } else if (line.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${keyCounter++}`} className="text-2xl md:text-3xl font-black text-text-primary mt-10 mb-6 font-sans tracking-tighter uppercase">
          {parseInlineMarkdown(line.substring(2))}
        </h1>
      );
    } 
    // Handle Blockquotes / Highlights
    else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={`bq-${keyCounter++}`} className="my-6 p-5 rounded-2xl border-l-4 border-[rgb(var(--accent-blue))] bg-[rgba(var(--accent-blue),0.03)] text-text-primary text-sm font-sans font-bold leading-relaxed opacity-95">
          {parseInlineMarkdown(line.substring(2))}
        </blockquote>
      );
    }
    // Handle Empty Lines
    else if (line === '') {
      continue;
    } 
    // Handle Standard Paragraphs
    else {
      elements.push(
        <p key={`p-${keyCounter++}`} className="text-text-muted text-sm md:text-base leading-relaxed mb-4 opacity-90">
          {parseInlineMarkdown(line)}
        </p>
      );
    }
  }

  // Push remaining list items
  if (currentList.length > 0) {
    elements.push(<ul key={`ul-${keyCounter++}`} className="my-4">{currentList}</ul>);
  }

  return <div className="markdown-body">{elements}</div>;
}

function parseInlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let currentText = text;
  let key = 0;

  while (currentText.length > 0) {
    const boldIndex = currentText.indexOf('**');
    const codeIndex = currentText.indexOf('`');

    if (boldIndex === -1 && codeIndex === -1) {
      parts.push(<span key={key++}>{currentText}</span>);
      break;
    }

    if (boldIndex !== -1 && (codeIndex === -1 || boldIndex < codeIndex)) {
      if (boldIndex > 0) {
        parts.push(<span key={key++}>{currentText.substring(0, boldIndex)}</span>);
      }
      const rest = currentText.substring(boldIndex + 2);
      const endBoldIndex = rest.indexOf('**');
      if (endBoldIndex !== -1) {
        parts.push(
          <strong key={key++} className="font-extrabold text-text-primary">
            {rest.substring(0, endBoldIndex)}
          </strong>
        );
        currentText = rest.substring(endBoldIndex + 2);
      } else {
        parts.push(<span key={key++}>**</span>);
        currentText = rest;
      }
    } else {
      if (codeIndex > 0) {
        parts.push(<span key={key++}>{currentText.substring(0, codeIndex)}</span>);
      }
      const rest = currentText.substring(codeIndex + 1);
      const endCodeIndex = rest.indexOf('`');
      if (endCodeIndex !== -1) {
        parts.push(
          <code key={key++} className="bg-surface-2 px-1.5 py-0.5 rounded text-[11px] font-mono border border-border-strong text-[rgb(var(--accent-blue))]">
            {rest.substring(0, endCodeIndex)}
          </code>
        );
        currentText = rest.substring(endCodeIndex + 1);
      } else {
        parts.push(<span key={key++}>`</span>);
        currentText = rest;
      }
    }
  }

  return <>{parts}</>;
}
