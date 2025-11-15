import { createClient } from './supabase/client'

export async function uploadFile(
  bucket: 'inventory' | 'purchase' | 'sales' | 'production',
  file: File,
  folder?: string
): Promise<{ url: string | null; error: Error | null }> {
  const supabase = createClient()
  
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = folder ? `${folder}/${fileName}` : fileName

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      throw error
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return { url: publicUrl, error: null }
  } catch (error) {
    return { url: null, error: error as Error }
  }
}

export async function deleteFile(
  bucket: 'inventory' | 'purchase' | 'sales' | 'production',
  filePath: string
): Promise<{ error: Error | null }> {
  const supabase = createClient()
  
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])

    if (error) {
      throw error
    }

    return { error: null }
  } catch (error) {
    return { error: error as Error }
  }
}

export function getFilePathFromUrl(url: string): string {
  const urlParts = url.split('/')
  const bucketIndex = urlParts.findIndex(part => part === 'object')
  return urlParts.slice(bucketIndex + 2).join('/')
}
