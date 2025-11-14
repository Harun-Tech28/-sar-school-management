# Homework File Upload Implementation Guide

## Overview
This guide explains how to add file upload functionality for homework assignments, allowing teachers to attach documents (PDFs, Word files, images, etc.) when creating homework.

## Implementation Steps

### 1. Update Database Schema

Add file attachment support to the Homework model:

```prisma
// In prisma/schema.prisma

model Homework {
  id          String   @id @default(cuid())
  title       String
  description String?
  subject     String
  classId     String
  teacherId   String
  dueDate     DateTime
  attachments HomeworkAttachment[] // Add this relation
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  class   Class   @relation(fields: [classId], references: [id])
  teacher Teacher @relation(fields: [teacherId], references: [id])
}

// Add new model for file attachments
model HomeworkAttachment {
  id           String   @id @default(cuid())
  homeworkId   String
  fileName     String
  fileUrl      String
  fileSize     Int
  fileType     String
  uploadedAt   DateTime @default(now())

  homework Homework @relation(fields: [homeworkId], references: [id], onDelete: Cascade)

  @@index([homeworkId])
}
```

Run migration:
```bash
npx prisma migrate dev --name add_homework_attachments
```

### 2. Choose File Storage Solution

#### Option A: Cloudinary (Recommended - Free Tier Available)

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your credentials from dashboard
3. Add to `.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Install package:
```bash
npm install cloudinary
```

#### Option B: AWS S3 (More Control)

1. Create S3 bucket
2. Add to `.env`:
```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

3. Install package:
```bash
npm install @aws-sdk/client-s3
```

#### Option C: Vercel Blob (Easiest for Vercel Deployments)

1. Add to `.env`:
```env
BLOB_READ_WRITE_TOKEN=your_token
```

2. Install package:
```bash
npm install @vercel/blob
```

### 3. Create File Upload Utility

Create `lib/file-upload.ts`:

```typescript
// Using Cloudinary example
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadFile(file: File): Promise<{
  url: string
  publicId: string
  size: number
  type: string
}> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: 'homework-attachments',
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) reject(error)
        else
          resolve({
            url: result!.secure_url,
            publicId: result!.public_id,
            size: result!.bytes,
            type: result!.format,
          })
      }
    ).end(buffer)
  })
}

export async function deleteFile(publicId: string) {
  return cloudinary.uploader.destroy(publicId)
}
```

### 4. Create File Upload API Endpoint

Create `app/api/upload/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { uploadFile } from '@/lib/file-upload'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File too large (max 10MB)' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type' },
        { status: 400 }
      )
    }

    const uploadResult = await uploadFile(file)

    return NextResponse.json({
      success: true,
      data: {
        fileName: file.name,
        fileUrl: uploadResult.url,
        fileSize: uploadResult.size,
        fileType: file.type,
      },
    })
  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
```

### 5. Update Homework Creation API

Update `app/api/homework/route.ts`:

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, subject, classId, teacherId, dueDate, attachments } = body

    const homework = await prisma.homework.create({
      data: {
        title,
        description,
        subject,
        classId,
        teacherId,
        dueDate: new Date(dueDate),
        attachments: {
          create: attachments || [], // Array of { fileName, fileUrl, fileSize, fileType }
        },
      },
      include: {
        attachments: true,
      },
    })

    return NextResponse.json({ success: true, data: homework })
  } catch (error) {
    console.error('Create homework error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create homework' },
      { status: 500 }
    )
  }
}
```

### 6. Create File Upload Component

Create `components/ui/file-upload.tsx`:

```typescript
"use client"

import { useState } from "react"
import { Upload, X, FileText } from "lucide-react"
import { Button } from "./button"

interface FileUploadProps {
  onFilesChange: (files: UploadedFile[]) => void
  maxFiles?: number
  maxSize?: number // in MB
}

interface UploadedFile {
  fileName: string
  fileUrl: string
  fileSize: number
  fileType: string
}

export function FileUpload({ onFilesChange, maxFiles = 5, maxSize = 10 }: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])

    if (files.length + selectedFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }

    setUploading(true)

    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()
        if (!data.success) throw new Error(data.error)

        return data.data
      })

      const uploadedFiles = await Promise.all(uploadPromises)
      const newFiles = [...files, ...uploadedFiles]
      setFiles(newFiles)
      onFilesChange(newFiles)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload files')
    } finally {
      setUploading(false)
    }
  }

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onFilesChange(newFiles)
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
          onChange={handleFileSelect}
          disabled={uploading || files.length >= maxFiles}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <Upload className="w-12 h-12 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            PDF, DOC, DOCX, JPG, PNG, GIF (max {maxSize}MB)
          </p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Uploaded Files ({files.length}/{maxFiles})</p>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">{file.fileName}</p>
                  <p className="text-xs text-gray-500">
                    {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

### 7. Update Teacher Homework Page

Add file upload to the homework creation form:

```typescript
// In app/dashboard/teacher/homework/page.tsx

import { FileUpload } from "@/components/ui/file-upload"

// Inside your component:
const [attachments, setAttachments] = useState([])

// In your form:
<div>
  <label className="block text-sm font-medium mb-2">
    Attachments (Optional)
  </label>
  <FileUpload
    onFilesChange={setAttachments}
    maxFiles={5}
    maxSize={10}
  />
</div>

// When submitting:
const handleSubmit = async () => {
  const response = await fetch('/api/homework', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      description,
      subject,
      classId,
      teacherId,
      dueDate,
      attachments, // Include uploaded files
    }),
  })
}
```

### 8. Display Attachments for Students

In student homework view:

```typescript
{homework.attachments?.map((attachment) => (
  <a
    key={attachment.id}
    href={attachment.fileUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100"
  >
    <FileText className="w-5 h-5 text-blue-500" />
    <span className="text-sm font-medium">{attachment.fileName}</span>
    <span className="text-xs text-gray-500">
      ({(attachment.fileSize / 1024 / 1024).toFixed(2)} MB)
    </span>
  </a>
))}
```

## Security Considerations

1. **File Size Limits**: Enforce max 10MB per file
2. **File Type Validation**: Only allow safe file types
3. **Virus Scanning**: Consider using ClamAV or similar
4. **Access Control**: Ensure only authorized users can access files
5. **Rate Limiting**: Prevent abuse of upload endpoint

## Cost Considerations

- **Cloudinary Free Tier**: 25GB storage, 25GB bandwidth/month
- **AWS S3**: Pay per GB stored and transferred
- **Vercel Blob**: 500MB free, then $0.15/GB

## Testing

1. Test file upload with various file types
2. Test file size limits
3. Test multiple file uploads
4. Test file deletion
5. Test file download/viewing

## Future Enhancements

1. Drag-and-drop file upload
2. Progress bars for uploads
3. File preview before upload
4. Compress images automatically
5. Support for video files
6. Bulk file operations

---

**Note**: This is a comprehensive feature. Start with Cloudinary (easiest) and implement step by step. Test thoroughly before deploying to production.
