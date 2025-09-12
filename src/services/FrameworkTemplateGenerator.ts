import { ProjectTemplate, TemplateFile, FrameworkConfig } from "@/types/framework";
import { FRAMEWORK_TEMPLATES, getTemplateByFramework } from "@/app/(root)/_constants/templates";

export class FrameworkTemplateGenerator {
  /**
   * Generate a project from a framework template
   */
  static generateProject(
    frameworkId: string, 
    projectName: string,
    customOptions?: Record<string, any>
  ): ProjectTemplate | null {
    const template = getTemplateByFramework(frameworkId);
    
    if (!template) {
      console.error(`Template not found for framework: ${frameworkId}`);
      return null;
    }

    // Process template with variables
    const processedTemplate: ProjectTemplate = {
      ...template,
      name: projectName,
      files: template.files.map(file => ({
        ...file,
        content: this.processTemplate(file.content, {
          projectName,
          ...customOptions
        })
      })),
      packageJson: template.packageJson ? {
        ...template.packageJson,
        name: this.sanitizePackageName(projectName)
      } : undefined
    };

    return processedTemplate;
  }

  /**
   * Process template content with variables
   */
  static processTemplate(content: string, variables: Record<string, string>): string {
    let processedContent = content;

    // Replace template variables like {{projectName}}
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      processedContent = processedContent.replace(regex, value);
    });

    return processedContent;
  }

  /**
   * Sanitize project name for package.json
   */
  static sanitizePackageName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-+/g, '-');
  }

  /**
   * Get entry file from template
   */
  static getEntryFile(template: ProjectTemplate): TemplateFile | undefined {
    return template.files.find(file => file.isEntry);
  }

  /**
   * Get files by type
   */
  static getFilesByType(template: ProjectTemplate, type: string): TemplateFile[] {
    return template.files.filter(file => file.type === type);
  }

  /**
   * Validate template structure
   */
  static validateTemplate(template: ProjectTemplate): boolean {
    // Check if template has required fields
    if (!template.id || !template.name || !template.framework) {
      return false;
    }

    // Check if template has files
    if (!template.files || template.files.length === 0) {
      return false;
    }

    // Check if template has an entry file
    const hasEntryFile = template.files.some(file => file.isEntry);
    if (!hasEntryFile) {
      console.warn(`Template ${template.id} has no entry file`);
    }

    return true;
  }

  /**
   * Create a custom template from existing files
   */
  static createCustomTemplate(
    id: string,
    name: string,
    framework: string,
    files: TemplateFile[],
    options?: {
      description?: string;
      packageJson?: Record<string, any>;
      readme?: string;
    }
  ): ProjectTemplate {
    return {
      id,
      name,
      framework,
      description: options?.description || `Custom ${framework} template`,
      files,
      packageJson: options?.packageJson,
      readme: options?.readme
    };
  }

  /**
   * Merge templates (useful for adding plugins or extensions)
   */
  static mergeTemplates(
    baseTemplate: ProjectTemplate,
    extensionTemplate: Partial<ProjectTemplate>
  ): ProjectTemplate {
    return {
      ...baseTemplate,
      ...extensionTemplate,
      files: [
        ...baseTemplate.files,
        ...(extensionTemplate.files || [])
      ],
      packageJson: extensionTemplate.packageJson ? {
        ...baseTemplate.packageJson,
        ...extensionTemplate.packageJson,
        dependencies: {
          ...baseTemplate.packageJson?.dependencies,
          ...extensionTemplate.packageJson.dependencies
        },
        devDependencies: {
          ...baseTemplate.packageJson?.devDependencies,
          ...extensionTemplate.packageJson.devDependencies
        },
        scripts: {
          ...baseTemplate.packageJson?.scripts,
          ...extensionTemplate.packageJson.scripts
        }
      } : baseTemplate.packageJson
    };
  }

  /**
   * Get template statistics
   */
  static getTemplateStats(template: ProjectTemplate) {
    const filesByType = template.files.reduce((acc, file) => {
      acc[file.type] = (acc[file.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const languagesByType = template.files.reduce((acc, file) => {
      acc[file.language] = (acc[file.language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalFiles: template.files.length,
      filesByType,
      languagesByType,
      hasPackageJson: !!template.packageJson,
      hasReadme: !!template.readme,
      hasEntryFile: template.files.some(file => file.isEntry)
    };
  }
}
