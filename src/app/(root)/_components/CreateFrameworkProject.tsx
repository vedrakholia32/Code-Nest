"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, FolderPlus, Settings, CheckCircle } from "lucide-react";
import { FrameworkConfig } from "@/types/framework";
import FrameworkSelector from "./FrameworkSelector";
import { FrameworkTemplateGenerator } from "@/services/FrameworkTemplateGenerator";

interface CreateFrameworkProjectProps {
  onClose: () => void;
  onProjectCreated: (projectId: string) => void;
}

type Step = 'framework' | 'configuration' | 'creation';

export default function CreateFrameworkProject({ onClose, onProjectCreated }: CreateFrameworkProjectProps) {
  const [currentStep, setCurrentStep] = useState<Step>('framework');
  const [selectedFramework, setSelectedFramework] = useState<FrameworkConfig | null>(null);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const steps = [
    { id: 'framework', title: 'Choose Framework', icon: FolderPlus },
    { id: 'configuration', title: 'Configure Project', icon: Settings },
    { id: 'creation', title: 'Create Project', icon: CheckCircle }
  ];

  const handleFrameworkSelect = (framework: FrameworkConfig) => {
    setSelectedFramework(framework);
    setProjectName(`my-${framework.id}-app`);
    setProjectDescription(`A new ${framework.name} project`);
  };

  const handleNext = () => {
    if (currentStep === 'framework' && selectedFramework) {
      setCurrentStep('configuration');
    } else if (currentStep === 'configuration') {
      setCurrentStep('creation');
      handleCreateProject();
    }
  };

  const handleBack = () => {
    if (currentStep === 'configuration') {
      setCurrentStep('framework');
    } else if (currentStep === 'creation') {
      setCurrentStep('configuration');
    }
  };

  const handleCreateProject = async () => {
    if (!selectedFramework || !projectName) return;

    setIsCreating(true);
    
    try {
      // Generate project template
      const template = FrameworkTemplateGenerator.generateProject(
        selectedFramework.id,
        projectName,
        { description: projectDescription }
      );

      if (!template) {
        throw new Error('Failed to generate project template');
      }

      // Here you would call your project creation API
      // For now, we'll simulate the creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate project ID
      const projectId = `project_${Date.now()}`;
      
      onProjectCreated(projectId);
    } catch (error) {
      console.error('Error creating project:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsCreating(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 'framework') return selectedFramework !== null;
    if (currentStep === 'configuration') return projectName.trim().length > 0;
    return false;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface rounded-xl border border-border shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-weight-bold text-primary">Create New Project</h2>
            <button
              onClick={onClose}
              className="text-secondary hover:text-primary transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
              
              return (
                <div key={step.id} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : isActive
                      ? 'bg-purple-600 border-purple-600 text-white'
                      : 'border-border text-secondary'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className={`text-sm font-weight-medium ${
                    isActive || isCompleted ? 'text-primary' : 'text-secondary'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      isCompleted ? 'bg-green-500' : 'bg-border'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {currentStep === 'framework' && (
              <motion.div
                key="framework"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6"
              >
                <FrameworkSelector
                  onSelect={handleFrameworkSelect}
                  selectedFramework={selectedFramework || undefined}
                />
              </motion.div>
            )}

            {currentStep === 'configuration' && selectedFramework && (
              <motion.div
                key="configuration"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6"
              >
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-weight-bold text-primary mb-2">
                      Configure Your {selectedFramework.name} Project
                    </h3>
                    <p className="text-secondary">
                      Set up your project details and preferences
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Project Name */}
                    <div>
                      <label className="block text-sm font-weight-medium text-primary mb-2">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="Enter project name"
                        className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-purple-500 text-primary"
                      />
                      <p className="text-xs text-secondary mt-1">
                        Package name: {FrameworkTemplateGenerator.sanitizePackageName(projectName)}
                      </p>
                    </div>

                    {/* Project Description */}
                    <div>
                      <label className="block text-sm font-weight-medium text-primary mb-2">
                        Description (Optional)
                      </label>
                      <textarea
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        placeholder="Describe your project"
                        rows={3}
                        className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-purple-500 text-primary resize-none"
                      />
                    </div>

                    {/* Framework Info */}
                    <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
                      <h4 className="font-weight-semibold text-primary mb-2">Framework Details</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-secondary">Framework:</span>
                          <span className="text-primary font-weight-medium ml-2">{selectedFramework.name}</span>
                        </div>
                        <div>
                          <span className="text-secondary">Language:</span>
                          <span className="text-primary font-weight-medium ml-2">{selectedFramework.language}</span>
                        </div>
                        <div>
                          <span className="text-secondary">Category:</span>
                          <span className="text-primary font-weight-medium ml-2">{selectedFramework.category}</span>
                        </div>
                        <div>
                          <span className="text-secondary">Version:</span>
                          <span className="text-primary font-weight-medium ml-2">{selectedFramework.version}</span>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="font-weight-semibold text-primary mb-3">Included Features</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedFramework.tags.map((tag) => (
                          <div key={tag} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-secondary">{tag}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 'creation' && (
              <motion.div
                key="creation"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6"
              >
                <div className="max-w-lg mx-auto text-center">
                  <div className="mb-8">
                    {isCreating ? (
                      <>
                        <div className="w-16 h-16 mx-auto mb-4 bg-purple-600 rounded-full flex items-center justify-center animate-pulse">
                          <FolderPlus className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-weight-bold text-primary mb-2">
                          Creating Your Project
                        </h3>
                        <p className="text-secondary">
                          Setting up {selectedFramework?.name} project with all dependencies...
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-weight-bold text-primary mb-2">
                          Project Created Successfully!
                        </h3>
                        <p className="text-secondary">
                          Your {selectedFramework?.name} project is ready to use.
                        </p>
                      </>
                    )}
                  </div>

                  {isCreating && (
                    <div className="space-y-3 text-left">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-secondary">Generating project structure...</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-secondary">Installing dependencies...</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-secondary">Configuring framework settings...</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 'framework' || isCreating}
            className="px-4 py-2 text-secondary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isCreating}
              className="px-4 py-2 text-secondary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            
            {currentStep !== 'creation' && (
              <button
                onClick={handleNext}
                disabled={!canProceed() || isCreating}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {currentStep === 'framework' ? 'Continue' : 'Create Project'}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
