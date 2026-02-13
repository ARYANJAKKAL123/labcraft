import { useState, useEffect, useCallback, useRef } from 'react';
import type { DraftPractical } from '@/types';

const DRAFT_KEY = 'practical_manual_draft';

export function useDraft(manualId?: string) {
  const [draft, setDraft] = useState<DraftPractical | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load draft on mount
  useEffect(() => {
    const stored = localStorage.getItem(DRAFT_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as DraftPractical;
        // Only load draft if it matches the current manual or no manual is specified
        if (!manualId || parsed.manual_id === manualId) {
          setDraft(parsed);
          setHasDraft(true);
          setLastSaved(new Date(parsed.saved_at));
        }
      } catch {
        localStorage.removeItem(DRAFT_KEY);
      }
    }
  }, [manualId]);

  const saveDraft = useCallback((data: Omit<DraftPractical, 'saved_at'>) => {
    setIsSaving(true);

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce save
    saveTimeoutRef.current = setTimeout(() => {
      const draftData: DraftPractical = {
        ...data,
        saved_at: new Date().toISOString(),
      };

      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
      setDraft(draftData);
      setHasDraft(true);
      setLastSaved(new Date());
      setIsSaving(false);
    }, 1000);
  }, []);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
    setDraft(null);
    setHasDraft(false);
    setLastSaved(null);
  }, []);

  const loadDraft = useCallback((): DraftPractical | null => {
    const stored = localStorage.getItem(DRAFT_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as DraftPractical;
      } catch {
        return null;
      }
    }
    return null;
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    draft,
    hasDraft,
    lastSaved,
    isSaving,
    saveDraft,
    clearDraft,
    loadDraft,
  };
}
