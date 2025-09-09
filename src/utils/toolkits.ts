import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type Toolkit = CollectionEntry<'toolkits'>;

export const getAllToolkits = async (): Promise<Toolkit[]> => {
    const toolkits = await getCollection('toolkits');
    return toolkits;
};

export const getToolkitsByCategory = async (category: string): Promise<Toolkit[]> => {
    const toolkits = await getAllToolkits();
    if (category === "All") return toolkits;
    return toolkits.filter(toolkit => toolkit.data.category === category);
};

export const getToolkitsByStatus = async (status: string): Promise<Toolkit[]> => {
    const toolkits = await getAllToolkits();
    return toolkits.filter(toolkit => toolkit.data.status === status);
};

export const getUniqueCategories = async (): Promise<string[]> => {
    const toolkits = await getAllToolkits();
    return Array.from(new Set(toolkits.map(toolkit => toolkit.data.category).filter((category): category is string => category !== undefined)));
};

export const getUniqueStatuses = async (): Promise<string[]> => {
    const toolkits = await getAllToolkits();
    return Array.from(new Set(toolkits.map(toolkit => toolkit.data.status)));
};

export const getStatusColor = (status: string): string => {
    switch (status) {
        case "Live":
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
        case "In Development":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
        case "Beta":
            return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
};

export const getCategoryColor = (category: string | undefined): string => {
    if (!category) {
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
    
    switch (category) {
        case "Development":
            return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
        case "Testing":
            return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
        case "Design":
            return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
        case "DevOps":
            return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
        case "Monitoring":
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
        case "Security":
            return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
        case "Content":
            return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
};
