import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type Toolkit = CollectionEntry<'toolkits'>;

export const getAllToolkits = async (): Promise<Toolkit[]> => {
  const toolkits = await getCollection('toolkits');
  return toolkits;
};

export const getToolkitsByCategory = async (
  category: string
): Promise<Toolkit[]> => {
  const toolkits = await getAllToolkits();
  if (category === 'All') return toolkits;
  return toolkits.filter(toolkit => toolkit.data.type === category);
};

export const getToolkitsByStatus = async (
  status: string
): Promise<Toolkit[]> => {
  const toolkits = await getAllToolkits();
  return toolkits.filter(toolkit => toolkit.data.status === status);
};

export const getUniqueCategories = async (): Promise<string[]> => {
  const toolkits = await getAllToolkits();
  return Array.from(
    new Set(
      toolkits
        .map(toolkit => capitalizeType(toolkit.data.type))
        .filter((type): type is string => type !== undefined)
    )
  );
};

export const capitalizeType = (type: string): string => {
  switch (type) {
    case 'product':
      return 'Product';
    case 'data-engineering-tools':
      return 'Data Engineering Tool';
    case 'modelling-frameworks-and-tools':
      return 'Modelling Framework';
    case 'platform':
      return 'Platform';
    case 'web-app':
      return 'Web App';
    case 'cli-tool':
      return 'CLI Tool';
    case 'model':
      return 'Model';
    case 'template':
      return 'Template';
    default:
      return type;
  }
};

export const getUniqueStatuses = async (): Promise<string[]> => {
  const toolkits = await getAllToolkits();
  return Array.from(new Set(toolkits.map(toolkit => toolkit.data.status)));
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'beta':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'inactive':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    case 'deprecated':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

export const getCategoryColor = (category: string | undefined): string => {
  if (!category) {
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }

  switch (category) {
    case 'product':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'data-engineering-tools':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'modelling-frameworks-and-tools':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'platform':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    case 'web-app':
      return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
    case 'cli-tool':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
    case 'model':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'template':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};
