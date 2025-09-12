import { FrameworkConfig, DependencyManager, FrameworkFeatures } from "@/types/framework";

// Dependency managers configuration
export const DEPENDENCY_MANAGERS: Record<string, DependencyManager> = {
  npm: {
    type: 'npm',
    installCommand: 'npm install',
    uninstallCommand: 'npm uninstall',
    updateCommand: 'npm update',
    listCommand: 'npm list'
  },
  pip: {
    type: 'pip',
    installCommand: 'pip install',
    uninstallCommand: 'pip uninstall',
    updateCommand: 'pip install --upgrade',
    listCommand: 'pip list'
  },
  yarn: {
    type: 'yarn',
    installCommand: 'yarn add',
    uninstallCommand: 'yarn remove',
    updateCommand: 'yarn upgrade',
    listCommand: 'yarn list'
  }
};

// Framework configurations
export const FRAMEWORK_CONFIG: Record<string, FrameworkConfig> = {
  'react-vite': {
    id: 'react-vite',
    name: 'React (Vite)',
    description: 'Fast React development with Vite build tool',
    language: 'javascript',
    category: 'frontend',
    version: '18.2.0',
    template: 'react-vite-template',
    dependencies: ['react', 'react-dom'],
    devDependencies: ['@vitejs/plugin-react', 'vite'],
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview',
      lint: 'eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0'
    },
    supportedExtensions: ['.jsx', '.tsx', '.js', '.ts', '.css', '.scss', '.less'],
    logoPath: '/react.png',
    isPopular: true,
    tags: ['react', 'frontend', 'spa', 'component-based']
  },
  
  'nextjs': {
    id: 'nextjs',
    name: 'Next.js',
    description: 'The React framework for production',
    language: 'javascript',
    category: 'fullstack',
    version: '14.0.0',
    template: 'nextjs-template',
    dependencies: ['next', 'react', 'react-dom'],
    devDependencies: ['@types/node', '@types/react', '@types/react-dom', 'typescript'],
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint'
    },
    supportedExtensions: ['.jsx', '.tsx', '.js', '.ts', '.css', '.module.css', '.scss'],
    logoPath: '/nextjs.png',
    isPopular: true,
    tags: ['react', 'nextjs', 'ssr', 'fullstack', 'routing']
  },

  'express': {
    id: 'express',
    name: 'Express.js',
    description: 'Fast, unopinionated, minimalist web framework for Node.js',
    language: 'javascript',
    category: 'backend',
    version: '4.18.0',
    template: 'express-template',
    dependencies: ['express'],
    devDependencies: ['nodemon', '@types/express'],
    scripts: {
      dev: 'nodemon server.js',
      start: 'node server.js',
      test: 'npm test'
    },
    supportedExtensions: ['.js', '.ts', '.json'],
    logoPath: '/nodejs.png',
    isPopular: true,
    tags: ['express', 'backend', 'api', 'server', 'nodejs']
  },

  'vue-vite': {
    id: 'vue-vite',
    name: 'Vue.js (Vite)',
    description: 'Progressive Vue.js framework with Vite',
    language: 'javascript',
    category: 'frontend',
    version: '3.3.0',
    template: 'vue-vite-template',
    dependencies: ['vue'],
    devDependencies: ['@vitejs/plugin-vue', 'vite'],
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview'
    },
    supportedExtensions: ['.vue', '.js', '.ts', '.css', '.scss'],
    logoPath: '/vue.png',
    isPopular: true,
    tags: ['vue', 'frontend', 'progressive', 'component-based']
  },

  'flask': {
    id: 'flask',
    name: 'Flask',
    description: 'Lightweight WSGI web application framework',
    language: 'python',
    category: 'backend',
    version: '2.3.0',
    template: 'flask-template',
    dependencies: ['Flask'],
    devDependencies: [],
    scripts: {
      dev: 'flask --app app run --debug',
      start: 'flask --app app run',
      test: 'python -m pytest'
    },
    supportedExtensions: ['.py', '.html', '.css', '.js'],
    logoPath: '/python.png',
    isPopular: true,
    tags: ['flask', 'python', 'backend', 'micro-framework', 'api']
  },

  'django': {
    id: 'django',
    name: 'Django',
    description: 'High-level Python web framework',
    language: 'python',
    category: 'fullstack',
    version: '4.2.0',
    template: 'django-template',
    dependencies: ['Django'],
    devDependencies: [],
    scripts: {
      dev: 'python manage.py runserver',
      migrate: 'python manage.py migrate',
      makemigrations: 'python manage.py makemigrations',
      test: 'python manage.py test'
    },
    supportedExtensions: ['.py', '.html', '.css', '.js'],
    logoPath: '/python.png',
    isPopular: true,
    tags: ['django', 'python', 'fullstack', 'orm', 'admin']
  },

  'svelte': {
    id: 'svelte',
    name: 'SvelteKit',
    description: 'Cybernetically enhanced web apps',
    language: 'javascript',
    category: 'fullstack',
    version: '1.20.0',
    template: 'svelte-template',
    dependencies: ['@sveltejs/kit'],
    devDependencies: ['@sveltejs/adapter-auto', 'svelte', 'vite'],
    scripts: {
      dev: 'vite dev',
      build: 'vite build',
      preview: 'vite preview'
    },
    supportedExtensions: ['.svelte', '.js', '.ts', '.css'],
    logoPath: '/svelte.png',
    isPopular: false,
    tags: ['svelte', 'compiler', 'frontend', 'reactive']
  },

  'fastapi': {
    id: 'fastapi',
    name: 'FastAPI',
    description: 'Modern, fast web framework for building APIs with Python',
    language: 'python',
    category: 'backend',
    version: '0.100.0',
    template: 'fastapi-template',
    dependencies: ['fastapi', 'uvicorn'],
    devDependencies: [],
    scripts: {
      dev: 'uvicorn main:app --reload',
      start: 'uvicorn main:app',
      test: 'python -m pytest'
    },
    supportedExtensions: ['.py'],
    logoPath: '/python.png',
    isPopular: true,
    tags: ['fastapi', 'python', 'api', 'async', 'modern']
  },

  'astro': {
    id: 'astro',
    name: 'Astro',
    description: 'Build faster websites with modern web architecture',
    language: 'javascript',
    category: 'static',
    version: '3.0.0',
    template: 'astro-template',
    dependencies: ['astro'],
    devDependencies: [],
    scripts: {
      dev: 'astro dev',
      build: 'astro build',
      preview: 'astro preview'
    },
    supportedExtensions: ['.astro', '.js', '.ts', '.jsx', '.tsx', '.css'],
    logoPath: '/astro.png',
    isPopular: false,
    tags: ['astro', 'static', 'islands', 'performance']
  }
};

// Framework features mapping
export const FRAMEWORK_FEATURES: Record<string, FrameworkFeatures> = {
  'react-vite': {
    hasHotReload: true,
    hasLivePreview: true,
    hasTypeScript: true,
    hasRouting: false,
    hasStateManagement: false,
    hasSSR: false,
    hasSSG: false,
    hasAPI: false,
    hasDatabase: false,
    hasTesting: true
  },
  'nextjs': {
    hasHotReload: true,
    hasLivePreview: true,
    hasTypeScript: true,
    hasRouting: true,
    hasStateManagement: false,
    hasSSR: true,
    hasSSG: true,
    hasAPI: true,
    hasDatabase: false,
    hasTesting: true
  },
  'express': {
    hasHotReload: true,
    hasLivePreview: false,
    hasTypeScript: true,
    hasRouting: true,
    hasStateManagement: false,
    hasSSR: false,
    hasSSG: false,
    hasAPI: true,
    hasDatabase: false,
    hasTesting: true
  },
  'vue-vite': {
    hasHotReload: true,
    hasLivePreview: true,
    hasTypeScript: true,
    hasRouting: false,
    hasStateManagement: false,
    hasSSR: false,
    hasSSG: false,
    hasAPI: false,
    hasDatabase: false,
    hasTesting: true
  },
  'flask': {
    hasHotReload: true,
    hasLivePreview: false,
    hasTypeScript: false,
    hasRouting: true,
    hasStateManagement: false,
    hasSSR: true,
    hasSSG: false,
    hasAPI: true,
    hasDatabase: false,
    hasTesting: true
  },
  'django': {
    hasHotReload: true,
    hasLivePreview: false,
    hasTypeScript: false,
    hasRouting: true,
    hasStateManagement: false,
    hasSSR: true,
    hasSSG: false,
    hasAPI: true,
    hasDatabase: true,
    hasTesting: true
  }
};

// Helper functions
export function getFrameworksByCategory(category: string): FrameworkConfig[] {
  return Object.values(FRAMEWORK_CONFIG).filter(framework => framework.category === category);
}

export function getPopularFrameworks(): FrameworkConfig[] {
  return Object.values(FRAMEWORK_CONFIG).filter(framework => framework.isPopular);
}

export function getFrameworkById(id: string): FrameworkConfig | undefined {
  return FRAMEWORK_CONFIG[id];
}

export function getFrameworkFeatures(frameworkId: string): FrameworkFeatures | undefined {
  return FRAMEWORK_FEATURES[frameworkId];
}
