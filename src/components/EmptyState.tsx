import { FolderOpen, FileText, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  type: 'manuals' | 'practicals';
  onAction?: () => void;
  canCreate?: boolean;
}

const config = {
  manuals: {
    icon: FolderOpen,
    title: 'No manuals yet',
    description: 'Create your first manual to start organizing your practicals.',
    actionText: 'Create Manual',
    gradient: 'from-violet-500 to-purple-600',
  },
  practicals: {
    icon: FileText,
    title: 'No practicals yet',
    description: 'Add your first practical to this manual.',
    actionText: 'Add Practical',
    gradient: 'from-amber-400 to-orange-500',
  },
};

export function EmptyState({ type, onAction, canCreate = true }: EmptyStateProps) {
  const { icon: Icon, title, description, actionText, gradient } = config[type];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in-scale">
      {/* Animated icon container */}
      <div className="relative mb-6">
        {/* Glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 blur-2xl rounded-full scale-150 animate-pulse-soft`} />
        
        {/* Main icon */}
        <div className={`relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-xl animate-float`}>
          <Icon className="h-12 w-12 text-white" />
          <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-amber-400 animate-bounce" />
        </div>
        
        {/* Orbiting dots */}
        <div className="absolute inset-0 animate-spin-slow">
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-violet-400 rounded-full" />
        </div>
        <div className="absolute inset-0 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '4s' }}>
          <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-amber-400 rounded-full" />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-8">
        {description}
      </p>
      
      {canCreate && onAction && (
        <Button 
          onClick={onAction}
          className={`bg-gradient-to-r ${gradient} hover:opacity-90 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 rounded-xl h-12 px-6`}
        >
          <Plus className="mr-2 h-5 w-5" />
          {actionText}
        </Button>
      )}
    </div>
  );
}
