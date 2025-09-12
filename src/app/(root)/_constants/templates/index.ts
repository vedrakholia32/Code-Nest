import { ProjectTemplate } from "@/types/framework";
import { REACT_VITE_TEMPLATE } from "./react-vite";
import { NEXTJS_TEMPLATE } from "./nextjs";
import { EXPRESS_TEMPLATE } from "./express";

// Export all framework templates
export const FRAMEWORK_TEMPLATES: Record<string, ProjectTemplate> = {
  'react-vite-template': REACT_VITE_TEMPLATE,
  'nextjs-template': NEXTJS_TEMPLATE,
  'express-template': EXPRESS_TEMPLATE,
};

// Helper function to get template by ID
export function getTemplateById(templateId: string): ProjectTemplate | undefined {
  return FRAMEWORK_TEMPLATES[templateId];
}

// Helper function to get template by framework ID
export function getTemplateByFramework(frameworkId: string): ProjectTemplate | undefined {
  return Object.values(FRAMEWORK_TEMPLATES).find(
    template => template.framework === frameworkId
  );
}

// Get all available templates
export function getAllTemplates(): ProjectTemplate[] {
  return Object.values(FRAMEWORK_TEMPLATES);
}

// Get templates by category
export function getTemplatesByCategory(category: string): ProjectTemplate[] {
  // This would need to be enhanced with framework category mapping
  return getAllTemplates();
}
