import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type TeamMember = CollectionEntry<'team'>;

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
