import { useState, useEffect, useCallback } from 'react';
import { localDB } from '@/lib/supabase';
import type { Manual } from '@/types';

export function useManuals() {
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load manuals on mount
  useEffect(() => {
    const loadManuals = () => {
      const data = localDB.getManuals();
      // Add practical count to each manual
      const manualsWithCount = data.map(manual => ({
        ...manual,
        practical_count: localDB.getPracticalsByManual(manual.id).length,
      }));
      setManuals(manualsWithCount);
      setIsLoading(false);
    };

    loadManuals();
  }, []);

  const createManual = useCallback((data: Omit<Manual, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Manual => {
    const newManual: Manual = {
      ...data,
      id: `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: 'current_user',
    };

    const saved = localDB.saveManual(newManual);
    setManuals(prev => [...prev, { ...saved, practical_count: 0 }]);
    return saved;
  }, []);

  const updateManual = useCallback((id: string, updates: Partial<Manual>): Manual | null => {
    const existing = manuals.find(m => m.id === id);
    if (!existing) return null;

    const updated: Manual = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const saved = localDB.saveManual(updated);
    setManuals(prev =>
      prev.map(m =>
        m.id === id
          ? { ...saved, practical_count: m.practical_count }
          : m
      )
    );
    return saved;
  }, [manuals]);

  const deleteManual = useCallback((id: string): boolean => {
    try {
      localDB.deleteManual(id);
      setManuals(prev => prev.filter(m => m.id !== id));
      return true;
    } catch {
      return false;
    }
  }, []);

  const getManual = useCallback((id: string): Manual | undefined => {
    return manuals.find(m => m.id === id);
  }, [manuals]);

  const refreshManuals = useCallback(() => {
    setIsLoading(true);
    const data = localDB.getManuals();
    const manualsWithCount = data.map(manual => ({
      ...manual,
      practical_count: localDB.getPracticalsByManual(manual.id).length,
    }));
    setManuals(manualsWithCount);
    setIsLoading(false);
  }, []);

  return {
    manuals,
    isLoading,
    createManual,
    updateManual,
    deleteManual,
    getManual,
    refreshManuals,
  };
}
