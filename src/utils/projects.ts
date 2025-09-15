import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

// Image imports - dynamically import all project images
const projectImages = import.meta.glob(
  '/src/images/*.{jpg,jpeg,png,webp,svg}',
  { eager: true }
);

/**
 * Get all projects from the content collection
 */
export const getAllProjects = async (): Promise<Project[]> => {
  const projects = await getCollection('projects');
  return projects;
};

/**
 * Get a project by its slug
 */
export const getProjectBySlug = async (
  slug: string
): Promise<Project | undefined> => {
  const projects = await getAllProjects();
  return projects.find(project => project.slug === slug);
};

/**
 * Get the optimized image for a project
 * This function handles dynamic imports for production builds
 */
export const getProjectImage = (imagePath: string | undefined): any => {
  if (!imagePath) {
    return null;
  }

  // Convert the path to match the import.meta.glob pattern
  // e.g., 'src/images/prismh-launch.jpg' -> '/src/images/prismh-launch.jpg'
  const normalizedPath = imagePath.startsWith('/')
    ? imagePath
    : `/${imagePath}`;

  // Find the matching imported image
  const importedImage = projectImages[normalizedPath];

  if (
    importedImage &&
    typeof importedImage === 'object' &&
    'default' in importedImage
  ) {
    return importedImage.default;
  }

  return null;
};

/**
 * Get projects with their optimized images
 */
export const getProjectsWithImages = async (): Promise<
  (Project & { optimizedImage: any })[]
> => {
  const projects = await getAllProjects();
  return projects.map(project => ({
    ...project,
    optimizedImage: getProjectImage(project.data.image),
  }));
};
