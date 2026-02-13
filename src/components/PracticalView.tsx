import { useEffect, useRef } from "react";
import { X, Printer, Download, Edit, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Practical } from "@/types";

interface PracticalViewProps {
  isOpen: boolean;
  onClose: () => void;
  practical: Practical | null;
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
  onEdit,
  onExport,
  onPrint,
  isExporting,
  canEdit,
}: PracticalViewProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Prism highlight
  useEffect(() => {
    if (isOpen && practical && (window as any).Prism) {
      setTimeout(() => {
        (window as any).Prism.highlightAll();
      }, 100);
    }
  }, [isOpen, practical]);

  if (!practical) return null;

  const printId = `practical-print-${practical.id}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        
        {/* HEADER */}
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">
              {practical.title}
            </DialogTitle>

            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* ACTION BUTTONS */}
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

        {/* PRINT / VIEW CONTENT */}
        <div
          ref={contentRef}
          id={printId}
          className="manual-print space-y-6 py-4"
        >
          {/* TITLE + LANGUAGE */}
          <div className="text-center border-b pb-4">
            <h1 className="text-2xl font-bold">
              {practical.title}
            </h1>
            {practical.language && (
              <p className="text-muted-foreground mt-1">
                Language: {practical.language}
              </p>
            )}
          </div>

          {/* CODE */}
          {practical.code && (
            <section>
              <h3 className="text-lg font-semibold mb-2">
                Main Program
              </h3>

              <pre className={`language-${practical.language || "text"}`}>
                <code className={`language-${practical.language || "text"}`}>
                  {practical.code}
                </code>
              </pre>
            </section>
          )}

          {/* OUTPUT IMAGES */}
          {practical.output_images &&
            practical.output_images.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold mb-4">
                  Output
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {practical.output_images.map((image, index) => (
                    <div key={index} className="text-center">
                      <img
                        src={image}
                        alt={`Output ${index + 1}`}
                        className="max-w-full h-auto rounded border mx-auto"
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        Figure {index + 1}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

          {/* PRACTICAL QUESTIONS */}
          {practical.theory && (
            <section>
              <h3 className="text-lg font-semibold mb-2">
                Practical Related Questions
              </h3>

              <p className="whitespace-pre-wrap text-muted-foreground">
                {practical.theory}
              </p>
            </section>
          )}

          {/* FOOTER */}
          <div className="text-center text-sm text-muted-foreground pt-8 border-t mt-8">
            <p>Generated by LabCraft</p>
            <p>{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
