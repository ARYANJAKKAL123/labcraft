// Types for Practical Manual Manager

export interface Manual {
  id: string;
  title: string;
  subject: string;
  description?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  practical_count?: number;
}

export interface Practical {
  id: string;
  manual_id: string;
  number: number;
  title: string;
  aim: string;
  theory: string;
  algorithm: string;
  code: string;
  language: string;
  output_images: string[];
  conclusion: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'viewer';
  created_at: string;
}

export type Theme = 'light' | 'dark' | 'system';

export interface AppState {
  user: User | null;
  theme: Theme;
  isAuthenticated: boolean;
}

export interface DraftPractical {
  manual_id: string;
  title: string;
  aim: string;
  theory: string;
  algorithm: string;
  code: string;
  language: string;
  output_images: string[];
  conclusion: string;
  saved_at: string;
}

export const SUPPORTED_LANGUAGES = [
  { value: 'python', label: 'Python', prismClass: 'language-python' },
  { value: 'java', label: 'Java', prismClass: 'language-java' },
  { value: 'javascript', label: 'JavaScript', prismClass: 'language-javascript' },
  { value: 'css', label: 'CSS', prismClass: 'language-css' },
  { value: 'sql', label: 'SQL', prismClass: 'language-sql' },
  { value: 'c', label: 'C', prismClass: 'language-c' },
  { value: 'cpp', label: 'C++', prismClass: 'language-cpp' },
  { value: 'plaintext', label: 'Plain Text', prismClass: 'language-text' },
] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]['value'];
