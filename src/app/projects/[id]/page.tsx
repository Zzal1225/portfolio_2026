import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { getProject, projects } from "@/data/projects";
import { ProjectDetail } from "@/components/project/ProjectDetail";

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata(props: PageProps<"/projects/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const project = getProject(id);
  return { title: project ? `${project.cardTitle} — ${siteConfig.name}` : "프로젝트" };
}

export default async function ProjectPage(props: PageProps<"/projects/[id]">) {
  const { id } = await props.params;
  const project = getProject(id);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
