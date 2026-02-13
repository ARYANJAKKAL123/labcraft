import { useState, useEffect, useCallback } from 'react';
import { localDB } from '@/lib/supabase';
import type { Practical } from '@/types';

export function usePracticals(manualId?: string) {
  const [practicals, setPracticals] = useState<Practical[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load practicals when manualId changes
  useEffect(() => {
    if (!manualId) {
      setPracticals([]);
      setIsLoading(false);
      return;
    }

    const loadPracticals = () => {
      const data = localDB.getPracticalsByManual(manualId);
      setPracticals(data);
      setIsLoading(false);
    };

    loadPracticals();
  }, [manualId]);

  const createPractical = useCallback((data: Omit<Practical, 'id' | 'number' | 'created_at' | 'updated_at' | 'user_id'>): Practical => {
    // Get next practical number for this manual
    const existingPracticals = manualId ? localDB.getPracticalsByManual(manualId) : [];
    const nextNumber = existingPracticals.length > 0
      ? Math.max(...existingPracticals.map(p => p.number)) + 1
      : 1;

    const newPractical: Practical = {
      ...data,
      id: `practical_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      number: nextNumber,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: 'current_user',
    };

    const saved = localDB.savePractical(newPractical);
    setPracticals(prev => [...prev, saved].sort((a, b) => a.number - b.number));
    return saved;
  }, [manualId]);

  const updatePractical = useCallback((id: string, updates: Partial<Practical>): Practical | null => {
    const existing = practicals.find(p => p.id === id);
    if (!existing) return null;

    const updated: Practical = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const saved = localDB.savePractical(updated);
    setPracticals(prev =>
      prev.map(p => (p.id === id ? saved : p)).sort((a, b) => a.number - b.number)
    );
    return saved;
  }, [practicals]);

  const deletePractical = useCallback((id: string): boolean => {
    try {
      localDB.deletePractical(id);
      setPracticals(prev => prev.filter(p => p.id !== id));
      return true;
    } catch {
      return false;
    }
  }, []);

  const getPractical = useCallback((id: string): Practical | undefined => {
    return practicals.find(p => p.id === id);
  }, [practicals]);

  const reorderPracticals = useCallback((orderedIds: string[]): void => {
    const reordered = orderedIds
      .map((id, index) => {
        const practical = practicals.find(p => p.id === id);
        if (practical) {
          const updated = { ...practical, number: index + 1 };
          localDB.savePractical(updated);
          return updated;
        }
        return null;
      })
      .filter((p): p is Practical => p !== null);

    setPracticals(reordered);
  }, [practicals]);

  const searchPracticals = useCallback((query: string): Practical[] => {
    if (!query.trim()) return practicals;
    
    const lowerQuery = query.toLowerCase();
    return practicals.filter(p =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.aim.toLowerCase().includes(lowerQuery) ||
      p.theory.toLowerCase().includes(lowerQuery)
    );
  }, [practicals]);

  return {
    practicals,
    isLoading,
    createPractical,
    updatePractical,
    deletePractical,
    getPractical,
    reorderPracticals,
    searchPracticals,
  };
}
