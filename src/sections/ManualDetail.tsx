import { useState, useMemo, useCallback } from 'react';
import { ArrowLeft, Plus, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  PracticalCard,
  PracticalForm,
  PracticalView,
  SearchBar,
  EmptyState,
  DeleteConfirmDialog,
} from '@/components';
import { usePracticals, useImageUpload, usePDFExport, useNotification } from '@/hooks';
import type { Manual, Practical } from '@/types';

interface ManualDetailProps {
  manual: Manual;
  onBack: () => void;
  canEdit: boolean;
}

export function ManualDetail({ manual, onBack, canEdit }: ManualDetailProps) {
  const { 
    practicals, 
    isLoading, 
    createPractical, 
    updatePractical, 
    deletePractical,
    searchPracticals,
  } = usePracticals(manual.id);
  
  const { uploadMultiple, isUploading: isUploadingImages } = useImageUpload(manual.id);
  const { exportPractical, exportFullManual, printElement, isExporting } = usePDFExport();
  const { success, error } = useNotification();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPractical, setEditingPractical] = useState<Practical | null>(null);
  const [viewingPractical, setViewingPractical] = useState<Practical | null>(null);
  const [deletingPractical, setDeletingPractical] = useState<Practical | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredPracticals = useMemo(() => {
    return searchPracticals(searchQuery);
  }, [practicals, searchQuery, searchPracticals]);

  const handleImageUpload = useCallback(async (files: FileList): Promise<string[]> => {
    const fileArray = Array.from(files);
    const uploaded = await uploadMultiple(fileArray);
    return uploaded.map(u => u.url);
  }, [uploadMultiple]);

  const handleCreatePractical = async (data: {
    title: string;
    aim: string;
    theory: string;
    algorithm: string;
    code: string;
    language: string;
    output_images: string[];
    conclusion: string;
  }) => {
    try {
      createPractical({
        ...data,
        manual_id: manual.id,
      });
      success('Practical added successfully');
      setIsFormOpen(false);
    } catch (err) {
      error('Failed to add practical');
    }
  };

  const handleUpdatePractical = async (data: {
    title: string;
    aim: string;
    theory: string;
    algorithm: string;
    code: string;
    language: string;
    output_images: string[];
    conclusion: string;
  }) => {
    if (!editingPractical) return;

    try {
      updatePractical(editingPractical.id, data);
      success('Practical updated successfully');
      setIsFormOpen(false);
      setEditingPractical(null);
    } catch (err) {
      error('Failed to update practical');
    }
  };

  const handleDeletePractical = async () => {
    if (!deletingPractical) return;

    setIsDeleting(true);
    try {
      deletePractical(deletingPractical.id);
      success('Practical deleted successfully');
      setDeletingPractical(null);
    } catch (err) {
      error('Failed to delete practical');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportPractical = async (practical: Practical) => {
    const result = await exportPractical(practical, manual);
    if (result) {
      success('PDF exported successfully');
    } else {
      error('Failed to export PDF');
    }
  };

  const handleExportFullManual = async () => {
    const result = await exportFullManual(manual, practicals);
    if (result) {
      success('Full manual exported successfully');
    } else {
      error('Failed to export manual');
    }
  };

  const handlePrintPractical = (practical: Practical) => {
    const elementId = `practical-print-${practical.id}`;
    printElement(elementId);
  };

  const openCreateForm = () => {
    setEditingPractical(null);
    setIsFormOpen(true);
  };

  const openEditForm = (practical: Practical) => {
    setEditingPractical(practical);
    setIsFormOpen(true);
    setViewingPractical(null);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingPractical(null);
  };

  const openViewPractical = (practical: Practical) => {
    setViewingPractical(practical);
  };

  const closeViewPractical = () => {
    setViewingPractical(null);
  };

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button variant="ghost" className="w-fit -ml-4" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Manuals
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{manual.title}</h1>
            <p className="text-muted-foreground">{manual.subject}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportFullManual}
              disabled={isExporting || practicals.length === 0}
            >
              {isExporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Export All
            </Button>

            {canEdit && (
              <Button size="sm" onClick={openCreateForm}>
                <Plus className="mr-2 h-4 w-4" />
                Add Practical
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedManual="all"
        onManualChange={() => {}}
        manuals={[]}
        placeholder="Search practicals..."
      />

      {/* Practicals List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="spinner" />
        </div>
      ) : filteredPracticals.length === 0 ? (
        <EmptyState
          type="practicals"
          onAction={canEdit ? openCreateForm : undefined}
          canCreate={canEdit}
        />
      ) : (
        <div className="space-y-4">
          {filteredPracticals.map((practical) => (
            <PracticalCard
              key={practical.id}
              practical={practical}
              onView={() => openViewPractical(practical)}
              onEdit={() => openEditForm(practical)}
              onDelete={() => setDeletingPractical(practical)}
              onExport={() => handleExportPractical(practical)}
              canEdit={canEdit}
            />
          ))}
        </div>
      )}

      {/* Practical Form Dialog */}
      <PracticalForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingPractical ? handleUpdatePractical : handleCreatePractical}
        practical={editingPractical}
        onImageUpload={handleImageUpload}
        isUploadingImages={isUploadingImages}
      />

      {/* Practical View Dialog */}
      <PracticalView
        isOpen={!!viewingPractical}
        onClose={closeViewPractical}
        practical={viewingPractical}
        manual={manual}
        onEdit={canEdit ? () => viewingPractical && openEditForm(viewingPractical) : undefined}
        onExport={() => viewingPractical && handleExportPractical(viewingPractical)}
        onPrint={() => viewingPractical && handlePrintPractical(viewingPractical)}
        isExporting={isExporting}
        canEdit={canEdit}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        isOpen={!!deletingPractical}
        onClose={() => setDeletingPractical(null)}
        onConfirm={handleDeletePractical}
        title="Delete Practical"
        description={`Are you sure you want to delete "${deletingPractical?.title}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
