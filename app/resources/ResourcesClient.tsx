'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Clock, ArrowRight, CheckCircle, Download, Mail, Search } from 'lucide-react';
import GlowButton from '@/components/ui/GlowButton';
import SectionReveal from '@/components/ui/SectionReveal';
import Link from 'next/link';

interface BlogPost {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  color: string;
}

// Dynamically loaded from /api/blogs now

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <div className="h-full p-8 flex flex-col group bg-surface-1 border border-border-strong rounded-[24px] transition-all duration-300 hover:bg-surface-2 hover:border-[rgb(var(--accent-blue))] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[rgb(var(--accent-blue))] opacity-[0.03] blur-3xl group-hover:opacity-[0.08] transition-opacity" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-[rgba(var(--accent-blue),0.1)] text-[rgb(var(--accent-blue))] border border-[rgba(var(--accent-blue),0.2)] uppercase tracking-wider">
          {post.category}
        </span>
        <span className="text-text-muted text-[10px] font-mono flex items-center gap-1.5 uppercase opacity-60">
          <Clock size={12} />
          {post.readTime}
        </span>
      </div>

      <h3 className="font-sans font-black text-text-primary mb-4 text-xl leading-tight flex-1 group-hover:text-[rgb(var(--accent-blue))] transition-colors">
        {post.title}
      </h3>
      <p className="text-text-muted text-sm leading-relaxed mb-6 opacity-80">{post.excerpt}</p>

      <div className="flex items-center justify-between mt-auto pt-6 border-t border-border-subtle relative z-10">
        <span className="text-text-muted text-[10px] font-mono uppercase opacity-50">{post.date}</span>
        <Link
          href={`/resources/${post.slug}`}
          className="flex items-center gap-2 text-xs font-black text-text-primary uppercase tracking-widest group-hover:text-[rgb(var(--accent-blue))] transition-all duration-300"
          aria-label={`Read ${post.title}`}
        >
          Access Module <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

export default function ResourcesClient() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', ...Array.from(new Set(blogPosts.map((p) => p.category)))];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'ALL' ||
      post.category.toUpperCase() === selectedCategory.toUpperCase();

    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true);
        const res = await fetch('/api/blogs');
        const data = await res.json();
        if (data.success) {
          setBlogPosts(data.posts || []);
        }
      } catch (err) {
        console.error('Failed to load articles:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-20 bg-background">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden border-b border-border-subtle">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--accent-blue),0.05)_0%,transparent_50%)] pointer-events-none" />

        <div className="section-container text-center relative z-10">
          <SectionReveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(var(--accent-blue),0.3)] bg-background/50 backdrop-blur-md mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--accent-blue))] animate-pulse" />
              <span className="text-[9px] font-black tracking-[0.3em] text-[rgb(var(--accent-blue))] uppercase">Knowledge Base & Systems</span>
            </div>

            <h1
              className="font-sans font-black text-text-primary mb-8 leading-[0.95] tracking-tighter"
              style={{ fontSize: 'clamp(40px, 6vw, 84px)' }}
            >
              Technical<br />
              <span className="text-[rgb(var(--accent-blue))]">Guides.</span>
            </h1>
            <p className="text-text-muted text-xl max-w-2xl mx-auto leading-relaxed opacity-80">
              Technical playbooks, ROI models, and deep-dives into the architecture of modern AI automation. Engineered for Australian growth.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Resource Tiles */}
      <section className="py-24 bg-surface-2/30">
        <div className="section-container">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-[rgb(var(--accent-blue))] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-text-muted text-xs font-mono uppercase tracking-widest">Loading knowledge base...</p>
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center py-20 border border-border-strong rounded-[24px] bg-surface-1">
              <p className="text-text-muted text-sm uppercase font-mono tracking-widest">No articles found in index.</p>
            </div>
          ) : (
            <>
              {/* Search Bar & Category Pills */}
              <div className="mb-16 max-w-2xl mx-auto">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-text-muted group-focus-within:text-[rgb(var(--accent-blue))] transition-colors">
                    <Search size={18} />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="SEARCH PLAYBOOKS, STRATEGIES, OR TOOLS..."
                    className="w-full pl-14 pr-12 py-5 rounded-2xl text-text-primary text-xs font-mono placeholder:text-text-muted/30 outline-none transition-all duration-300 focus:ring-2 focus:ring-[rgb(var(--accent-blue))]/40 bg-surface-1 border border-border-strong uppercase tracking-wider focus:border-[rgb(var(--accent-blue))]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-6 flex items-center text-text-muted hover:text-text-primary text-[10px] font-mono tracking-widest uppercase transition-colors"
                    >
                      CLEAR
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2.5 mt-6 justify-center">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-[9px] font-bold tracking-[0.2em] font-sans px-5 py-2.5 rounded-full transition-all duration-300 border uppercase ${
                        selectedCategory === cat
                          ? "bg-[rgb(var(--accent-blue))] border-[rgb(var(--accent-blue))] text-white shadow-glow-sm"
                          : "bg-surface-2/40 border-border-strong/50 text-text-muted hover:border-[rgb(var(--accent-blue))]/40 hover:text-text-primary hover:bg-[rgba(var(--accent-blue),0.05)]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Results */}
              {filteredPosts.length === 0 ? (
                <div className="text-center py-20 border border-border-strong rounded-[24px] bg-surface-1 max-w-2xl mx-auto">
                  <p className="text-text-muted text-sm uppercase font-mono tracking-widest mb-4">No matching guides found.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('ALL');
                    }}
                    className="text-[10px] font-mono text-[rgb(var(--accent-blue))] hover:underline uppercase tracking-widest font-black"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post, i) => (
                    <SectionReveal key={post.slug} delay={i * 100}>
                      <BlogCard post={post} />
                    </SectionReveal>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-32 border-t border-border-subtle bg-background overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="section-container relative z-10">
          <SectionReveal>
            <div className="max-w-3xl mx-auto text-center bg-surface-1 border border-border-strong rounded-[32px] p-10 md:p-20 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 bg-[rgba(var(--accent-blue),0.1)] border border-[rgba(var(--accent-blue),0.2)]">
                <Mail size={28} className="text-[rgb(var(--accent-blue))]" />
              </div>

              {newsletterSubmitted ? (
                <div className="py-8">
                  <CheckCircle size={48} className="text-[rgb(var(--accent-blue))] mx-auto mb-6" />
                  <h2 className="font-sans font-black text-3xl text-text-primary mb-4 uppercase">Frequency Locked</h2>
                  <p className="text-text-muted text-base opacity-80">
                    You are now subscribed to the Insight Dispatch. Expected arrival: every second Tuesday.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="font-sans font-black text-3xl md:text-5xl text-text-primary mb-6 leading-tight uppercase tracking-tighter">
                    AI Insights, <span className="text-[rgb(var(--accent-blue))]">No Fluff.</span>
                  </h2>
                  <p className="text-text-muted text-lg mb-10 opacity-80 leading-relaxed">
                    Join 2,400+ Australian operators getting technical automation playbooks and ROI models delivered bi-weekly.
                  </p>
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="YOU@COMPANY.COM"
                      className="flex-1 px-6 py-4 rounded-xl text-text-primary text-xs font-mono placeholder:text-text-muted/30 outline-none transition-all focus:ring-2 focus:ring-[rgb(var(--accent-blue))]/40 bg-background border border-border-strong uppercase"
                      required
                    />
                    <GlowButton
                      type="submit"
                      variant="primary"
                      size="lg"
                    >
                      Subscribe
                    </GlowButton>
                  </form>
                </>
              )}
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
