import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type TeamMember = CollectionEntry<'team'>;

// Image imports - dynamically import all team member images
const teamImages = import.meta.glob(
  '/src/images/team_members/*.{jpg,jpeg,png,webp,svg}',
  { eager: true }
);

// Default avatar for team members without photos
const DEFAULT_AVATAR =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yMCA4MEMyMCA2NS42NDA2IDMyLjY0MDYgNTMgNDcgNTNINjNDNzcuMzU5NCA1MyA5MCA2NS42NDA2IDkwIDgwVjEwMEgyMFY4MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';

export const getAllTeamMembers = async (): Promise<TeamMember[]> => {
  const teamMembers = await getCollection('team');
  return teamMembers.sort((a, b) => {
    // Extract first name by splitting on space and taking the first part
    const firstNameA = a.data.name.split(' ')[0];
    const firstNameB = b.data.name.split(' ')[0];
    return firstNameA.localeCompare(firstNameB);
  });
};

export const getTeamMemberBySlug = async (
  slug: string
): Promise<TeamMember | undefined> => {
  const teamMembers = await getAllTeamMembers();
  return teamMembers.find(member => member.slug === slug);
};

export const getTeamMembersWithPages = async (): Promise<TeamMember[]> => {
  return await getAllTeamMembers(); // All members now have slugs
};

export const getTeamMemberSlugs = async (): Promise<string[]> => {
  const teamMembers = await getAllTeamMembers();
  return teamMembers.map(member => member.slug);
};

export const getTeamMemberAvatar = (member: TeamMember): string => {
  return member.data.avatar && member.data.avatar.trim() !== ''
    ? member.data.avatar
    : DEFAULT_AVATAR;
};

/**
 * Get the optimized image for a team member
 * This function handles dynamic imports for production builds
 */
export const getTeamMemberOptimizedImage = (
  avatarPath: string | undefined
): any => {
  if (!avatarPath) {
    return null;
  }

  // Convert the path to match the import.meta.glob pattern
  // e.g., 'src/images/team_members/adish.jpg' -> '/src/images/team_members/adish.jpg'
  // e.g., '/team_members/adish.jpg' -> '/src/images/team_members/adish.jpg'
  let normalizedPath = avatarPath;

  if (avatarPath.startsWith('src/images/')) {
    // Convert 'src/images/team_members/adish.jpg' to '/src/images/team_members/adish.jpg'
    normalizedPath = `/${avatarPath}`;
  } else if (avatarPath.startsWith('/team_members/')) {
    // Convert '/team_members/adish.jpg' to '/src/images/team_members/adish.jpg'
    normalizedPath = avatarPath.replace(
      '/team_members/',
      '/src/images/team_members/'
    );
  } else if (!avatarPath.startsWith('/src/images')) {
    // If it doesn't start with any expected pattern, assume it needs the full path
    normalizedPath = `/src/images/team_members/${avatarPath}`;
  }

  // Find the matching imported image
  const importedImage = teamImages[normalizedPath];

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
 * Get team members with their optimized images
 */
export const getTeamMembersWithImages = async (): Promise<
  (TeamMember & { optimizedImage: any })[]
> => {
  const teamMembers = await getAllTeamMembers();
  return teamMembers.map(member => ({
    ...member,
    optimizedImage: getTeamMemberOptimizedImage(member.data.avatar),
  }));
};

export const getCurrentTeamMembers = async (): Promise<TeamMember[]> => {
  const teamMembers = await getAllTeamMembers();
  return teamMembers.filter(member => member.data.status === 'current');
};

export const getAlumniTeamMembers = async (): Promise<TeamMember[]> => {
  const teamMembers = await getAllTeamMembers();
  return teamMembers.filter(member => member.data.status === 'alumni');
};

export const getTeamMembersByType = async (
  type: 'core' | 'associated faculty' | 'advisor'
): Promise<TeamMember[]> => {
  const teamMembers = await getAllTeamMembers();
  return teamMembers.filter(member => member.data.type === type);
};
