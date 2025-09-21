'use client';

import { useState, useCallback, DragEvent } from 'react';
import { cn } from '@/lib/utils';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';

interface FileUploaderProps {
  onFilesChange: (files: File[]) => void;
  acceptedMimeTypes: { [key: string]: string[] };
}

export function FileUploader({
  onFilesChange,
  acceptedMimeTypes,
}: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (newFiles: FileList | null) => {
    if (newFiles) {
      const updatedFiles = [...files, ...Array.from(newFiles)];
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors duration-200',
          isDragging
            ? 'border-primary bg-primary/10'
            : 'border-border hover:border-primary/50'
        )}
      >
        <UploadCloud
          className={cn(
            'h-12 w-12 text-muted-foreground transition-colors',
            isDragging && 'text-primary'
          )}
        />
        <p className="mt-4 font-semibold">
          Drag & drop files here, or click to select files
        </p>
        <p className="text-sm text-muted-foreground">
          Supported formats: PDF, DOCX
        </p>
        <input
          type="file"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          multiple
          onChange={(e) => handleFileChange(e.target.files)}
          accept={Object.keys(acceptedMimeTypes).join(',')}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">Uploaded Resumes:</h3>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between rounded-md border bg-card p-2"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileIcon className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <span className="truncate text-sm">{file.name}</span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
