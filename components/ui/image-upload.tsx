"use client";

import { useState, useCallback } from "react";
import { supabaseImage } from "@/lib/supabase-image";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload, X, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  className?: string;
  aspectRatio?: number;
  maxSize?: number; // in MB
  allowedTypes?: string[];
  storagePath?: string;
  compact?: boolean;
  eventId: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  className,
  aspectRatio = 1,
  maxSize = 5,
  allowedTypes = ["image/jpeg", "image/png", "image/webp"],
  storagePath = "events",
  compact = false,
  eventId
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleUpload = useCallback(
    async (file: File) => {
      if (!file) return;

      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`File size must be less than ${maxSize}MB`);
        return;
      }

      // Check file type
      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload a valid image.");
        return;
      }

      try {
        setIsUploading(true);

        // Generate unique file name
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${storagePath}/${eventId}/${fileName}`;

        // Upload to Supabase Storage (visionhub bucket)
        const { error: uploadError, data } = await supabaseImage.storage.from("visionhub").upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const {
          data: { publicUrl }
        } = supabaseImage.storage.from("visionhub").getPublicUrl(filePath);

        onChange(publicUrl);
        toast.success("Image uploaded successfully");
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image");
      } finally {
        setIsUploading(false);
      }
    },
    [onChange, maxSize, allowedTypes, storagePath, eventId]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleUpload(file);
      }
    },
    [handleUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleUpload(file);
      }
    },
    [handleUpload]
  );

  return (
    <div
      className={cn(
        "relative group transition-colors rounded-lg border-2 border-dashed",
        compact ? "rounded-xl bg-muted flex items-center justify-center w-[100px] h-[100px]" : "",
        isDragging && !compact ? "border-primary bg-primary/5" : !compact ? "border-muted-foreground/25 hover:border-primary/50" : "",
        className
      )}
      style={compact ? undefined : { aspectRatio }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {value ? (
        <>
          <label className="absolute inset-0 cursor-pointer group/image">
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className={cn("object-cover", compact ? "rounded-xl" : "rounded-lg") + " group-hover/image:opacity-80 transition-opacity"}
              unoptimized
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity pointer-events-none select-none">
              <Pencil className="h-7 w-7 text-white bg-black/60 rounded p-1" />
            </div>
            <input
              type="file"
              accept={allowedTypes.join(",")}
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
              tabIndex={-1}
            />
          </label>
        </>
      ) : compact ? (
        <>
          <Upload className="h-8 w-8 text-muted-foreground" />
          <input
            type="file"
            accept={allowedTypes.join(",")}
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            <p>Drag & drop an image here, or click to select</p>
            <p className="text-xs mt-1">Supported formats: JPG, PNG, WebP (max {maxSize}MB)</p>
          </div>
          <input
            type="file"
            accept={allowedTypes.join(",")}
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
        </div>
      )}
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}
