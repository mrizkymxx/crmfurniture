'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { uploadFile } from '@/lib/storage'

interface UploadButtonProps {
  bucket: 'inventory' | 'purchase' | 'sales' | 'production'
  folder?: string
  onUploadComplete?: (url: string) => void
  onUploadError?: (error: string) => void
  accept?: string
  label?: string
}

export function UploadButton({
  bucket,
  folder,
  onUploadComplete,
  onUploadError,
  accept = 'image/*',
  label = 'Upload File',
}: UploadButtonProps) {
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)

    try {
      const { url, error } = await uploadFile(bucket, file, folder)

      if (error) {
        throw error
      }

      if (url) {
        onUploadComplete?.(url)
        setFile(null)
        // Reset input
        const input = document.getElementById('file-upload') as HTMLInputElement
        if (input) input.value = ''
      }
    } catch (err: any) {
      onUploadError?.(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="file-upload">{label}</Label>
      <div className="flex items-center space-x-2">
        <Input
          id="file-upload"
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
        />
        <Button
          type="button"
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
      {file && (
        <p className="text-sm text-gray-600">
          Selected: {file.name}
        </p>
      )}
    </div>
  )
}
