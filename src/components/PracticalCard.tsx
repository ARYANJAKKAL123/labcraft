import { useRef, useState } from 'react';
import { FileText, MoreVertical, Pencil, Trash2, Eye, Download, Image as ImageIcon, Code, Sparkles, Beaker } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Practical } from '@/types';

interface PracticalCardProps {
  practical: Practical;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onExport: () => void;
  canEdit: boolean;
  index?: number;
}

// Language color mapping
const languageColors: Record<string, string> = {
  python: 'from-blue-500 to-cyan-500',
  java: 'from-orange-500 to-red-500',
  javascript: 'from-yellow-400 to-amber-500',
  css: 'from-blue-400 to-indigo-500',
  sql: 'from-green-500 to-emerald-500',
  c: 'from-purple-500 to-violet-500',
  cpp: 'from-pink-500 to-rose-500',
  plaintext: 'from-gray-400 to-gray-500',
};

const languageIcons: Record<string, React.ElementType> = {
  python: Beaker,
  java: Code,
  javascript: Code,
  css: Code,
  sql: Code,
  c: Code,
  cpp: Code,
  plaintext: FileText,
};

export function PracticalCard({ 
  practical, 
  onView, 
  onEdit, 
  onDelete, 
  onExport,
  canEdit,
  index = 0
}: PracticalCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const gradient = languageColors[practical.language] || languageColors.plaintext;
  const LangIcon = languageIcons[practical.language] || Code;

  // 3D tilt effect handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 12;
    const rotateY = (centerX - x) / 12;
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`);
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
        animationDelay: `${index * 0.05}s`,
        animation: 'slideInUp 0.5s ease-out forwards',
        opacity: 0
      }}
    >
      <Card 
        className="group relative overflow-hidden border-0 shadow-lg shadow-violet-500/5 hover:shadow-2xl hover:shadow-violet-500/15 transition-all duration-300 preserve-3d"
        style={{ transform, transition: 'transform 0.15s ease-out, box-shadow 0.3s ease' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      >
        {/* Gradient background on hover */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-opacity duration-500`}
          style={{ opacity: isHovered ? 0.05 : 0 }}
        />
        
        {/* Left accent line with animation */}
        <div 
          className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${gradient}`}
          style={{ 
            transform: isHovered ? 'scaleY(1)' : 'scaleY(0.3)',
            transformOrigin: 'top',
            transition: 'transform 0.5s ease-out',
            boxShadow: isHovered ? '0 0 15px hsl(var(--primary) / 0.5)' : 'none'
          }}
        />

        {/* Floating code symbols on hover */}
        {isHovered && (
          <>
            <div className="absolute top-4 right-20 text-violet-400/30 text-lg font-mono animate-float" style={{ animationDelay: '0s' }}>{'{ }'}</div>
            <div className="absolute bottom-8 right-12 text-amber-400/30 text-sm font-mono animate-float" style={{ animationDelay: '0.3s' }}>{'</>'}</div>
            <div className="absolute top-1/2 right-4 text-pink-400/20 text-xs font-mono animate-float" style={{ animationDelay: '0.6s' }}>{'[]'}</div>
          </>
        )}

        <CardHeader className="pb-3 relative preserve-3d">
          <div className="flex items-start justify-between">
            <div 
              className="flex items-center gap-4 cursor-pointer flex-1"
              onClick={onView}
            >
              {/* 3D Number badge */}
              <div 
                className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg transition-all duration-500 preserve-3d`}
                style={{ 
                  transform: isHovered ? 'translateZ(30px) rotateY(-10deg)' : 'translateZ(0)',
                  boxShadow: isHovered ? '0 10px 30px -5px hsl(var(--primary) / 0.5)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                <span className="text-xl font-bold text-white">{practical.number}</span>
                {practical.output_images.length > 0 && (
                  <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-amber-400 animate-pulse" />
                )}
                
                {/* 3D depth layer */}
                <div 
                  className={`absolute inset-0 rounded-xl bg-gradient-to-br ${gradient} opacity-50 -z-10`}
                  style={{ transform: 'translateZ(-10px)' }}
                />
              </div>
              
              <div className="min-w-0 flex-1 preserve-3d">
                <h3 
                  className="font-bold text-lg line-clamp-1 transition-all duration-300"
                  style={{ transform: isHovered ? 'translateZ(20px)' : 'translateZ(0)' }}
                >
                  <span className="group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {practical.title}
                  </span>
                </h3>
                <p 
                  className="text-sm text-muted-foreground line-clamp-1"
                  style={{ transform: isHovered ? 'translateZ(15px)' : 'translateZ(0)' }}
                >
                  {practical.aim.substring(0, 80)}...
                </p>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-lg hover:bg-violet-500/10 hover:text-violet-500 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem onClick={onView} className="rounded-lg cursor-pointer">
                  <Eye className="mr-2 h-4 w-4 text-violet-500" />
                  View
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={onExport} className="rounded-lg cursor-pointer">
                  <Download className="mr-2 h-4 w-4 text-amber-500" />
                  Export PDF
                </DropdownMenuItem>
                
                {canEdit && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onEdit} className="rounded-lg cursor-pointer">
                      <Pencil className="mr-2 h-4 w-4 text-violet-500" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={onDelete}
                      className="rounded-lg cursor-pointer text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="relative preserve-3d">
          <div 
            className="flex items-center justify-between"
            style={{ transform: isHovered ? 'translateZ(25px)' : 'translateZ(0)' }}
          >
            <div className="flex items-center gap-3">
              {/* Language badge */}
              <div 
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${gradient} bg-opacity-10 border transition-all duration-300 ${isHovered ? 'shadow-lg' : ''}`}
                style={{ borderColor: 'hsl(var(--muted))' }}
              >
                <LangIcon className="h-3.5 w-3.5" style={{ color: 'inherit' }} />
                <span className="text-xs font-medium capitalize">{practical.language}</span>
              </div>
              
              {/* Images count */}
              {practical.output_images.length > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                  <ImageIcon className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                    {practical.output_images.length} image{practical.output_images.length > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
            
            <span className="text-xs text-muted-foreground">
              {new Date(practical.updated_at).toLocaleDateString('en-US', { 
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
