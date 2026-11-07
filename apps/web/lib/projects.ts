import { projects as fallbackProjects } from '@/data';
import { Project } from '@/types';
import { supabase } from '@/lib/supabase';

export async function getAllProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackProjects;
    }

    return data.map((item: any) => ({
      slug: item.slug,
      title: item.title,
      shortDesc: item.short_desc || item.shortDesc || '',
      description: item.description || '',
      thumbnail: item.thumbnail || '',
      year: item.year || '2026',
      tags: Array.isArray(item.tags) ? item.tags : [],
      liveUrl: item.live_url || item.liveUrl || '',
      githubUrl: item.github_url || item.githubUrl || '',
      overview: item.overview || '',
      challenge: item.challenge || '',
      process: item.process || '',
      results: item.results || '',
      gallery: Array.isArray(item.gallery) ? item.gallery : [],
    }));
  } catch (err) {
    console.warn('⚠️ Supabase fetch error, using local fallback:', err);
    return fallbackProjects;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error || !data) {
      const fallback = fallbackProjects.find((p) => p.slug === slug);
      return fallback || null;
    }

    return {
      slug: data.slug,
      title: data.title,
      shortDesc: data.short_desc || data.shortDesc || '',
      description: data.description || '',
      thumbnail: data.thumbnail || '',
      year: data.year || '2026',
      tags: Array.isArray(data.tags) ? data.tags : [],
      liveUrl: data.live_url || data.liveUrl || '',
      githubUrl: data.github_url || data.githubUrl || '',
      overview: data.overview || '',
      challenge: data.challenge || '',
      process: data.process || '',
      results: data.results || '',
      gallery: Array.isArray(data.gallery) ? data.gallery : [],
    };
  } catch {
    const fallback = fallbackProjects.find((p) => p.slug === slug);
    return fallback || null;
  }
}
