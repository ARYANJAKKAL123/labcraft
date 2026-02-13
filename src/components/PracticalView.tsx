import { useEffect, useRef } from 'react';
import { X, Printer, Download, Edit, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import type { Practical, Manual } from '@/types';

interface PracticalViewProps {
  isOpen: boolean;
  onClose: () => void;
  practical: Practical | null;
  manual: Manual | null;
  onEdit?: () => void;
  onExport?: () => void;
  onPrint?: () => void;
  isExporting?: boolean;
  canEdit?: boolean;
}

export function PracticalView({
  isOpen,
  onClose,
  practical,
  manual,
  onEdit,
  onExport,
  onPrint,
  isExporting,
  canEdit,
}: PracticalViewProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Highlight code when practical changes
  useEffect(() => {
    if (isOpen && practical && typeof window !== 'undefined' && (window as any).Prism) {
      setTimeout(() => {
        (window as any).Prism.highlightAll();
      }, 100);
    }
  }, [isOpen, practical]);

  if (!practical || !manual) return null;

  const printId = `practical-print-${practical.id}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{practical.title}</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-2 mt-4 no-print">
            {onPrint && (
              <Button variant="outline" size="sm" onClick={onPrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
            )}
            
            {onExport && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onExport}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
                  </>
                )}
              </Button>
            )}
            
            {canEdit && onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Print-friendly content */}
        <div 
          ref={contentRef}
          id={printId}
          className="manual-print space-y-6 py-4"
        >
          {/* Header */}
          <div className="text-center border-b pb-4 print-break-inside">
            <h1 className="text-2xl font-bold">{manual.subject}</h1>
            <h2 className="text-xl mt-2">Practical {practical.number}: {practical.title}</h2>
          </div>

          {/* Aim */}
          <section className="print-break-inside">
            <h3 className="text-lg font-semibold mb-2">Aim</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{practical.aim}</p>
          </section>

          <Separator />

          {/* Theory */}
          {practical.theory && (
            <section className="print-break-inside">
              <h3 className="text-lg font-semibold mb-2">Theory</h3>
              <div className="whitespace-pre-wrap text-muted-foreground">
                {practical.theory}
              </div>
            </section>
          )}

          {practical.theory && <Separator />}

          {/* Algorithm */}
          {practical.algorithm && (
            <section className="print-break-inside">
              <h3 className="text-lg font-semibold mb-2">Algorithm / Steps</h3>
              <div className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-lg">
                {practical.algorithm}
              </div>
            </section>
          )}

          {practical.algorithm && <Separator />}

          {/* Code */}
          {practical.code && (
            <section className="print-break-inside">
              <h3 className="text-lg font-semibold mb-2">Code ({practical.language})</h3>
              <pre className={`language-${practical.language}`}>
                <code className={`language-${practical.language}`}>
                  {practical.code}
                </code>
              </pre>
            </section>
          )}

          {practical.code && <Separator />}

          {/* Output Images */}
          {practical.output_images.length > 0 && (
            <section className="print-break-inside">
              <h3 className="text-lg font-semibold mb-4">Output</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {practical.output_images.map((image, index) => (
                  <div key={index} className="text-center">
                    <img
                      src={image}
                      alt={`Output ${index + 1}`}
                      className="max-w-full h-auto rounded-lg border mx-auto"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Figure {index + 1}: Output Screenshot
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {practical.output_images.length > 0 && <Separator />}

          {/* Conclusion */}
          {practical.conclusion && (
            <section className="print-break-inside">
              <h3 className="text-lg font-semibold mb-2">Conclusion</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {practical.conclusion}
              </p>
            </section>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground pt-8 border-t mt-8">
            <p>Generated by Practical Manual Manager</p>
            <p>{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
