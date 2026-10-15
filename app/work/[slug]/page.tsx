import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PROJECTS } from '@/data/projects';
import { TRANSLATIONS } from '@/data/translations';
import { ProjectStory } from './ProjectStory';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((item) => item.id === slug);
  if (!project) return { title: 'Project not found — KERN' };
  return {
    title: `${project.title} — KERN`,
    description: TRANSLATIONS.en.projects[project.id]?.summary,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const projectIndex = PROJECTS.findIndex((item) => item.id === slug);
  if (projectIndex === -1) notFound();
  const project = PROJECTS[projectIndex];
  const next = PROJECTS[(projectIndex + 1) % PROJECTS.length];

  return <ProjectStory key={project.id} project={project} next={next} />;
}
