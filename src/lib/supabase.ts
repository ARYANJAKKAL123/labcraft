// Supabase client configuration
// Uses CDN-loaded Supabase library

// Import types
import type { Manual, Practical } from '@/types';

declare global {
  interface Window {
    supabase: {
      createClient: (url: string, key: string) => any;
    };
  }
}

// Get Supabase client from window (loaded via CDN)
const getSupabaseClient = () => {
  if (typeof window === 'undefined') return null;
  
  // Access the global supabase object from CDN
  const supabaseUrl = localStorage.getItem('supabase_url') || '';
  const supabaseKey = localStorage.getItem('supabase_anon_key') || '';
  
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials not configured. Using local storage mode.');
    return null;
  }
  
  return window.supabase?.createClient?.(supabaseUrl, supabaseKey) || null;
};

// Local storage fallback for when Supabase is not configured
class LocalStorageDB {
  private prefix = 'practical_manual_';

  private getItem<T>(key: string): T[] {
    try {
      const data = localStorage.getItem(this.prefix + key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private setItem<T>(key: string, value: T[]): void {
    localStorage.setItem(this.prefix + key, JSON.stringify(value));
  }

  // Manuals
  getManuals(): Manual[] {
    return this.getItem<Manual>('manuals');
  }

  saveManual(manual: Manual): Manual {
    const manuals = this.getManuals();
    const existingIndex = manuals.findIndex(m => m.id === manual.id);
    
    if (existingIndex >= 0) {
      manuals[existingIndex] = { ...manual, updated_at: new Date().toISOString() };
    } else {
      manuals.push(manual);
    }
    
    this.setItem('manuals', manuals);
    return manual;
  }

  deleteManual(id: string): void {
    const manuals = this.getManuals().filter(m => m.id !== id);
    this.setItem('manuals', manuals);
    // Also delete associated practicals
    const practicals = this.getPracticals().filter(p => p.manual_id !== id);
    this.setItem('practicals', practicals);
  }

  // Practicals
  getPracticals(): Practical[] {
    return this.getItem<Practical>('practicals');
  }

  getPracticalsByManual(manualId: string): Practical[] {
    return this.getPracticals()
      .filter(p => p.manual_id === manualId)
      .sort((a, b) => a.number - b.number);
  }

  savePractical(practical: Practical): Practical {
    const practicals = this.getPracticals();
    const existingIndex = practicals.findIndex(p => p.id === practical.id);
    
    if (existingIndex >= 0) {
      practicals[existingIndex] = { ...practical, updated_at: new Date().toISOString() };
    } else {
      practicals.push(practical);
    }
    
    this.setItem('practicals', practicals);
    return practical;
  }

  deletePractical(id: string): void {
    const practicals = this.getPracticals().filter(p => p.id !== id);
    this.setItem('practicals', practicals);
  }

  // Images
  saveImage(manualId: string, imageData: string): string {
    const images = this.getItem<{ id: string; manual_id: string; data: string; created_at: string }>('images');
    const id = `${manualId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    images.push({
      id,
      manual_id: manualId,
      data: imageData,
      created_at: new Date().toISOString(),
    });
    this.setItem('images', images);
    return id;
  }

  getImage(id: string): string | null {
    const images = this.getItem<{ id: string; data: string }>('images');
    return images.find(img => img.id === id)?.data || null;
  }

  deleteImage(id: string): void {
    const images = this.getItem<{ id: string }>('images').filter(img => img.id !== id);
    this.setItem('images', images);
  }
}

// Export local DB instance
export const localDB = new LocalStorageDB();

// Export Supabase client getter
export { getSupabaseClient };

// Helper to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  if (typeof window === 'undefined') return false;
  const url = localStorage.getItem('supabase_url');
  const key = localStorage.getItem('supabase_anon_key');
  return !!(url && key);
};

// Helper to configure Supabase
export const configureSupabase = (url: string, key: string): void => {
  localStorage.setItem('supabase_url', url);
  localStorage.setItem('supabase_anon_key', key);
  window.location.reload();
};
