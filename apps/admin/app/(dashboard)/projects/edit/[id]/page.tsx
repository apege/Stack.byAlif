import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProjectForm from '@/components/ProjectForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !project) {
    notFound();
  }

  const initialData = {
    id: project.id,
    slug: project.slug,
    title: project.title,
    short_desc: project.short_desc || '',
    description: project.description || '',
    thumbnail: project.thumbnail || '',
    year: project.year || '2026',
    tags: project.tags || [],
    live_url: project.live_url || '',
    github_url: project.github_url || '',
    overview: project.overview || '',
    challenge: project.challenge || '',
    process: project.process || '',
    results: project.results || '',
    gallery: project.gallery || [],
    is_published: project.is_published,
    display_order: project.display_order || 0,
  };

  return <ProjectForm initialData={initialData} isEdit={true} />;
}
