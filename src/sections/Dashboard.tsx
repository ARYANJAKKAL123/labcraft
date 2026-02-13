import { useState, useMemo } from 'react';
import { Plus, Search, BookOpen, FileText, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ManualCard, ManualForm, EmptyState, DeleteConfirmDialog } from '@/components';
import { useManuals, useNotification } from '@/hooks';
import type { Manual } from '@/types';

interface DashboardProps {
  onManualSelect: (manual: Manual) => void;
  canEdit: boolean;
}

// Stats card component
function StatCard({ 
  icon: Icon, 
  value, 
  label, 
  gradient, 
  delay = 0 
}: { 
  icon: React.ElementType; 
  value: number | string; 
  label: string; 
  gradient: string;
  delay?: number;
}) {
  return (
    <div 
      className={`stat-card flex items-center gap-4 p-5 rounded-2xl animate-fade-in-scale`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-3xl font-bold gradient-text">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function Dashboard({ onManualSelect, canEdit }: DashboardProps) {
  const { manuals, isLoading, createManual, updateManual, deleteManual } = useManuals();
  const { success, error } = useNotification();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingManual, setEditingManual] = useState<Manual | null>(null);
  const [deletingManual, setDeletingManual] = useState<Manual | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredManuals = useMemo(() => {
    if (!searchQuery.trim()) return manuals;
    
    const query = searchQuery.toLowerCase();
    return manuals.filter(
      (manual) =>
        manual.title.toLowerCase().includes(query) ||
        manual.subject.toLowerCase().includes(query) ||
        manual.description?.toLowerCase().includes(query)
    );
  }, [manuals, searchQuery]);

  const totalPracticals = manuals.reduce((acc, m) => acc + (m.practical_count || 0), 0);

  const handleCreateManual = async (data: { title: string; subject: string; description: string }) => {
    try {
      createManual(data);
      success('Manual created successfully! 🎉');
      setIsFormOpen(false);
    } catch (err) {
      error('Failed to create manual');
    }
  };

  const handleUpdateManual = async (data: { title: string; subject: string; description: string }) => {
    if (!editingManual) return;
    
    try {
      updateManual(editingManual.id, data);
      success('Manual updated successfully! ✨');
      setIsFormOpen(false);
      setEditingManual(null);
    } catch (err) {
      error('Failed to update manual');
    }
  };

  const handleDeleteManual = async () => {
    if (!deletingManual) return;
    
    setIsDeleting(true);
    try {
      deleteManual(deletingManual.id);
      success('Manual deleted successfully');
      setDeletingManual(null);
    } catch (err) {
      error('Failed to delete manual');
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditForm = (manual: Manual) => {
    setEditingManual(manual);
    setIsFormOpen(true);
  };

  const openCreateForm = () => {
    setEditingManual(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingManual(null);
  };

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h1 className="text-3xl font-bold gradient-text">My Manuals</h1>
          </div>
          <p className="text-muted-foreground">
            Organize and manage your practical manuals with ease
          </p>
        </div>
        
        {canEdit && (
          <Button 
            onClick={openCreateForm}
            className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 hover:scale-105 rounded-xl h-12 px-6"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create Manual
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard 
          icon={BookOpen} 
          value={manuals.length} 
          label="Total Manuals" 
          gradient="from-violet-500 to-purple-600"
          delay={0.1}
        />
        <StatCard 
          icon={FileText} 
          value={totalPracticals} 
          label="Total Practicals" 
          gradient="from-amber-400 to-orange-500"
          delay={0.2}
        />
        <StatCard 
          icon={TrendingUp} 
          value={totalPracticals > 0 ? Math.round(totalPracticals / manuals.length) : 0} 
          label="Avg Practicals/Manual" 
          gradient="from-emerald-400 to-teal-500"
          delay={0.3}
        />
      </div>

      {/* Search */}
      <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search manuals by title, subject, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-14 rounded-xl border-2 border-border/50 bg-background/50 text-base transition-all duration-300 focus:border-violet-500 focus:ring-violet-500/20"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg hover:bg-violet-500/10"
            onClick={() => setSearchQuery('')}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Manuals Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-2xl skeleton" />
          ))}
        </div>
      ) : filteredManuals.length === 0 ? (
        <EmptyState
          type="manuals"
          onAction={canEdit ? openCreateForm : undefined}
          canCreate={canEdit}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredManuals.map((manual, index) => (
            <ManualCard
              key={manual.id}
              manual={manual}
              onClick={() => onManualSelect(manual)}
              onEdit={() => openEditForm(manual)}
              onDelete={() => setDeletingManual(manual)}
              canEdit={canEdit}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Manual Form Dialog */}
      <ManualForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingManual ? handleUpdateManual : handleCreateManual}
        manual={editingManual}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        isOpen={!!deletingManual}
        onClose={() => setDeletingManual(null)}
        onConfirm={handleDeleteManual}
        title="Delete Manual"
        description={`Are you sure you want to delete "${deletingManual?.title}"? This will also delete all ${deletingManual?.practical_count || 0} practicals in this manual. This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
