import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Loader2, Upload, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SUPPORTED_LANGUAGES } from '@/types';
import type { Practical } from '@/types';

interface PracticalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    aim: string;
    theory: string;
    algorithm: string;
    code: string;
    language: string;
    output_images: string[];
    conclusion: string;
  }) => void;
  practical?: Practical | null;
  isLoading?: boolean;
  onImageUpload: (files: FileList) => Promise<string[]>;
  isUploadingImages?: boolean;
}

export function PracticalForm({
  isOpen,
  onClose,
  onSubmit,
  practical,
  isLoading,
  onImageUpload,
  isUploadingImages,
}: PracticalFormProps) {
  const [title, setTitle] = useState('');
  const [aim, setAim] = useState('');
  const [theory, setTheory] = useState('');
  const [algorithm, setAlgorithm] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [outputImages, setOutputImages] = useState<string[]>([]);
  const [conclusion, setConclusion] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when practical changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      if (practical) {
        setTitle(practical.title);
        setAim(practical.aim);
        setTheory(practical.theory);
        setAlgorithm(practical.algorithm);
        setCode(practical.code);
        setLanguage(practical.language);
        setOutputImages(practical.output_images);
        setConclusion(practical.conclusion);
      } else {
        setTitle('');
        setAim('');
        setTheory('');
        setAlgorithm('');
        setCode('');
        setLanguage('python');
        setOutputImages([]);
        setConclusion('');
      }
    }
  }, [isOpen, practical]);

  // Highlight code when it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Prism) {
      (window as any).Prism.highlightAll();
    }
  }, [code, language]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !aim.trim()) return;

    onSubmit({
      title: title.trim(),
      aim: aim.trim(),
      theory: theory.trim(),
      algorithm: algorithm.trim(),
      code: code.trim(),
      language,
      output_images: outputImages,
      conclusion: conclusion.trim(),
    });
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const uploaded = await onImageUpload(files);
      setOutputImages(prev => [...prev, ...uploaded]);
    }
  }, [onImageUpload]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const uploaded = await onImageUpload(files);
      setOutputImages(prev => [...prev, ...uploaded]);
    }
  }, [onImageUpload]);

  const removeImage = useCallback((index: number) => {
    setOutputImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const isEditing = !!practical;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Practical' : 'Add New Practical'}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Implementing Binary Search"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aim">
                  Aim <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="aim"
                  placeholder="What is the objective of this practical?"
                  value={aim}
                  onChange={(e) => setAim(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="conclusion">Conclusion</Label>
                <Textarea
                  id="conclusion"
                  placeholder="What did you learn from this practical?"
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  rows={3}
                />
              </div>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theory">Theory</Label>
                <Textarea
                  id="theory"
                  placeholder="Explain the theoretical concepts..."
                  value={theory}
                  onChange={(e) => setTheory(e.target.value)}
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="algorithm">Algorithm / Steps</Label>
                <Textarea
                  id="algorithm"
                  placeholder="1. Step one&#10;2. Step two&#10;3. Step three..."
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value)}
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>
            </TabsContent>

            {/* Code Tab */}
            <TabsContent value="code" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Programming Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="code">Code</Label>
                  {code && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={copyCode}
                      className="h-8"
                    >
                      {copied ? (
                        <>
                          <Check className="mr-1 h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-1 h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  )}
                </div>
                <Textarea
                  id="code"
                  placeholder="Paste your code here..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>

              {code && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="rounded-lg overflow-hidden">
                    <pre className={`language-${language}`}>
                      <code className={`language-${language}`}>{code}</code>
                    </pre>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="space-y-4">
              <div
                className={`drag-zone rounded-lg p-8 text-center ${isDragging ? 'drag-over' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
                
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium">
                    Drag and drop images here
                  </p>
                  <p className="text-xs text-muted-foreground">
                    or{' '}
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      browse to upload
                    </button>
                  </p>
                </div>
              </div>

              {isUploadingImages && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading images...
                </div>
              )}

              {outputImages.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Images</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {outputImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Output ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !title.trim() || !aim.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                isEditing ? 'Save Changes' : 'Add Practical'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
