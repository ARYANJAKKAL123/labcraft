import { useRef, useState } from 'react';
import { FolderOpen, MoreVertical, Pencil, Trash2, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Manual } from '@/types';

interface ManualCardProps {
  manual: Manual;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  canEdit: boolean;
  index?: number;
}

export function ManualCard({ manual, onClick, onEdit, onDelete, canEdit, index = 0 }: ManualCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  // Generate a gradient based on the manual title
  const gradients = [
    'from-violet-500 to-purple-600',
    'from-amber-400 to-orange-500',
    'from-pink-500 to-rose-500',
    'from-cyan-500 to-blue-600',
    'from-emerald-400 to-teal-500',
    'from-indigo-500 to-violet-600',
  ];
  const gradient = gradients[index % gradients.length];

  // 3D tilt effect handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)');
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div 
      ref={cardRef}
      className="perspective-1000"
      style={{ 
        animationDelay: `${index * 0.1}s`,
        animation: 'fadeInScale 0.5s ease-out forwards',
        opacity: 0
      }}
    >
      <Card 
        className="group relative overflow-hidden cursor-pointer border-0 shadow-lg shadow-violet-500/5 hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-300 preserve-3d"
        style={{ transform, transition: 'transform 0.15s ease-out, box-shadow 0.3s ease' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onClick={onClick}
      >
        {/* Animated gradient border */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-500`}
          style={{ opacity: isHovered ? 0.1 : 0 }}
        />
        
        {/* Top accent line with glow */}
        <div 
          className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`}
          style={{ 
            transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.5s ease-out',
            boxShadow: isHovered ? '0 0 20px hsl(var(--primary))' : 'none'
          }}
        />

        {/* Floating particles on hover */}
        {isHovered && (
          <>
            <div className="absolute top-4 right-4 w-2 h-2 bg-violet-400 rounded-full animate-float" style={{ animationDelay: '0s' }} />
            <div className="absolute bottom-8 right-8 w-1.5 h-1.5 bg-amber-400 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-1/2 right-2 w-1 h-1 bg-pink-400 rounded-full animate-float" style={{ animationDelay: '1s' }} />
          </>
        )}

        <CardHeader className="pb-3 relative preserve-3d">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* 3D Icon with depth */}
              <div 
                className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg transition-all duration-500 preserve-3d`}
                style={{ 
                  transform: isHovered ? 'translateZ(30px) rotateY(10deg)' : 'translateZ(0)',
                  boxShadow: isHovered ? '0 10px 30px -5px hsl(var(--primary) / 0.5)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                <FolderOpen className="h-7 w-7 text-white" />
                {manual.practical_count && manual.practical_count > 0 && (
                  <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-amber-400 animate-pulse" />
                )}
                
                {/* 3D depth layer */}
                <div 
                  className={`absolute inset-0 rounded-xl bg-gradient-to-br ${gradient} opacity-50 -z-10`}
                  style={{ transform: 'translateZ(-10px)' }}
                />
              </div>
              
              <div className="min-w-0 preserve-3d">
                <h3 
                  className="font-bold text-lg line-clamp-1 transition-all duration-300"
                  style={{ transform: isHovered ? 'translateZ(20px)' : 'translateZ(0)' }}
                >
                  <span className="group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {manual.title}
                  </span>
                </h3>
                <p 
                  className="text-sm text-muted-foreground flex items-center gap-1"
                  style={{ transform: isHovered ? 'translateZ(15px)' : 'translateZ(0)' }}
                >
                  <span className={`inline-block w-2 h-2 rounded-full bg-gradient-to-r ${gradient}`} />
                  {manual.subject}
                </p>
              </div>
            </div>
            
            {canEdit && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-violet-500/10 hover:text-violet-500"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem 
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    className="rounded-lg cursor-pointer"
                  >
                    <Pencil className="mr-2 h-4 w-4 text-violet-500" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="rounded-lg cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="relative preserve-3d">
          {manual.description && (
            <p 
              className="text-sm text-muted-foreground line-clamp-2 mb-4 group-hover:text-foreground/80 transition-colors"
              style={{ transform: isHovered ? 'translateZ(10px)' : 'translateZ(0)' }}
            >
              {manual.description}
            </p>
          )}
          
          <div 
            className="flex items-center justify-between"
            style={{ transform: isHovered ? 'translateZ(25px)' : 'translateZ(0)' }}
          >
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 transition-all duration-300 ${isHovered ? 'shadow-lg shadow-violet-500/20' : ''}`}>
                <FileText className="h-3.5 w-3.5 text-violet-500" />
                <span className="text-xs font-medium text-violet-700 dark:text-violet-300">
                  {manual.practical_count || 0} practicals
                </span>
              </div>
            </div>
            
            <span className="text-xs text-muted-foreground">
              {new Date(manual.updated_at).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
