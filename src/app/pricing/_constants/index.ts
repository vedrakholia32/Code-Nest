import { Boxes, Globe, RefreshCcw, Shield } from "lucide-react";

export const ENTERPRISE_FEATURES = [
  {
    icon: Boxes,
    label: "Multi-File Projects",
    desc: "Create and manage complex projects with multiple files",
  },
  {
    icon: Globe,
    label: "Project Showcase",
    desc: "Access to view and share multi-file projects publicly",
  },
  {
    icon: Shield,
    label: "Pro Member Badge",
    desc: "Exclusive Pro member status and visual indicators",
  },
  {
    icon: RefreshCcw,
    label: "Advanced Features",
    desc: "Access to upcoming Pro-only features and tools",
  },
];

export const FEATURES = {
  development: [
    "Multi-file project creation",
    "Advanced code editor with Monaco",
    "Real-time code execution",
  ],
  collaboration: [
    "Public project sharing",
    "Project showcase access",
    "Code snippet gallery",
    "Community features",
  ],
  exclusive: [
    "Priority support",
    "Early access to new features",
    "Lifetime updates",
  ],
};