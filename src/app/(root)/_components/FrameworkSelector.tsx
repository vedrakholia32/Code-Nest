"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Check, Star, Code, Globe, Server, Smartphone, Monitor } from "lucide-react";
import { FrameworkConfig, FrameworkCategory } from "@/types/framework";
import { FRAMEWORK_CONFIG, getFrameworksByCategory, getPopularFrameworks } from "@/app/(root)/_constants/frameworks";
import Image from "next/image";

interface FrameworkSelectorProps {
  onSelect: (framework: FrameworkConfig) => void;
  selectedFramework?: FrameworkConfig;
}

const CATEGORY_ICONS: Record<FrameworkCategory, any> = {
  frontend: Globe,
  backend: Server,
  fullstack: Code,
  mobile: Smartphone,
  desktop: Monitor,
  cli: Code,
  api: Server,
  static: Globe
};

const CATEGORY_COLORS: Record<FrameworkCategory, string> = {
  frontend: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  backend: "bg-green-500/10 text-green-400 border-green-500/20",
  fullstack: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  mobile: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  desktop: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  cli: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  api: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  static: "bg-pink-500/10 text-pink-400 border-pink-500/20"
};

export default function FrameworkSelector({ onSelect, selectedFramework }: FrameworkSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<FrameworkCategory | 'popular' | 'all'>('popular');
  
  const categories: Array<{ id: FrameworkCategory | 'popular' | 'all', label: string, icon: any }> = [
    { id: 'popular', label: 'Popular', icon: Star },
    { id: 'frontend', label: 'Frontend', icon: Globe },
    { id: 'backend', label: 'Backend', icon: Server },
    { id: 'fullstack', label: 'Full Stack', icon: Code },
    { id: 'all', label: 'All Frameworks', icon: Code }
  ];

  const getFrameworks = () => {
    switch (selectedCategory) {
      case 'popular':
        return getPopularFrameworks();
      case 'all':
        return Object.values(FRAMEWORK_CONFIG);
      default:
        return getFrameworksByCategory(selectedCategory);
    }
  };

  const frameworks = getFrameworks();

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-weight-bold text-primary mb-4">Choose Your Framework</h2>
        <p className="text-secondary text-lg line-height-relaxed">
          Select a framework to get started with pre-configured templates and best practices
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg border font-weight-medium transition-all duration-200 flex items-center gap-2 ${
                isSelected
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-surface border-border text-secondary hover:text-primary hover:border-purple-500/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-4 h-4" />
              {category.label}
            </motion.button>
          );
        })}
      </div>

      {/* Framework Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {frameworks.map((framework, index) => {
          const isSelected = selectedFramework?.id === framework.id;
          const CategoryIcon = CATEGORY_ICONS[framework.category];
          
          return (
            <motion.div
              key={framework.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => onSelect(framework)}
              className={`relative p-6 rounded-xl border cursor-pointer transition-all duration-200 hover-magnetic ${
                isSelected
                  ? 'border-purple-500 bg-purple-500/5'
                  : 'border-border bg-surface hover:border-purple-500/50 hover:bg-surface-hover'
              }`}
            >
              {/* Selected Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}

              {/* Framework Logo */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Image
                    src={framework.logoPath}
                    alt={framework.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-weight-semibold text-primary">{framework.name}</h3>
                    {framework.isPopular && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                  
                  {/* Category Badge */}
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border ${
                    CATEGORY_COLORS[framework.category]
                  }`}>
                    <CategoryIcon className="w-3 h-3" />
                    {framework.category}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-secondary text-sm line-height-relaxed mb-4">
                {framework.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {framework.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-secondary rounded"
                  >
                    {tag}
                  </span>
                ))}
                {framework.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs text-secondary">
                    +{framework.tags.length - 3} more
                  </span>
                )}
              </div>

              {/* Features */}
              <div className="text-xs text-secondary">
                Language: <span className="text-primary font-weight-medium">{framework.language}</span>
              </div>

              {/* Hover Arrow */}
              <motion.div
                className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ x: 2 }}
              >
                <ChevronRight className="w-4 h-4 text-purple-500" />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {frameworks.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <Code className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-weight-semibold text-primary mb-2">No Frameworks Found</h3>
          <p className="text-secondary">
            No frameworks available in this category. Try selecting a different category.
          </p>
        </div>
      )}

      {/* Framework Count */}
      <div className="text-center mt-8">
        <p className="text-sm text-secondary">
          Showing {frameworks.length} framework{frameworks.length !== 1 ? 's' : ''}
          {selectedCategory !== 'all' && selectedCategory !== 'popular' && (
            <span> in {selectedCategory}</span>
          )}
        </p>
      </div>
    </div>
  );
}
