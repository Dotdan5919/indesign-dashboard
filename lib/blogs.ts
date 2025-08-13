export type ApiBlog = {
  _id: string
  title: string
  content: string
  featured_image?: string
  status?: string
  author_id?: string
  likes?: number
  likers?: string[]
  createdAt?: string
  updatedAt?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL as string

function ensureApiUrl() {
  if (!API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not set')
  }
}

export async function fetchBlogs(): Promise<ApiBlog[]> {
  ensureApiUrl()
  const res = await fetch(`${API_URL}/blogs`, {
    credentials: 'include',
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch blogs')
  const data = await res.json()
  return Array.isArray(data) ? data : (data.blogs ?? [])
}

export async function createBlog(params: {
  title: string
  content: string
  featuredImageFile: File
}): Promise<ApiBlog> {
  ensureApiUrl()
  const form = new FormData()
  form.append('title', params.title)
  form.append('content', params.content)
  form.append('featured_image', params.featuredImageFile)

  const res = await fetch(`${API_URL}/blogs`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to create blog')
  }
  const data = await res.json().catch(() => ({}))
  return (data.blog || data) as ApiBlog
}

export async function updateBlog(params: {
  id: string
  title?: string
  content?: string
  featuredImageFile?: File
}): Promise<ApiBlog> {
  ensureApiUrl()
  const form = new FormData()
  if (params.title) form.append('title', params.title)
  if (params.content) form.append('content', params.content)
  if (params.featuredImageFile) form.append('featured_image', params.featuredImageFile)

  const res = await fetch(`${API_URL}/blogs/update/${params.id}`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to update blog')
  }
  // Server may respond with various shapes; try to extract updated blog
  const data = await res.json().catch(() => ({}))
  return (data.blog || data.UpdateBlog || data) as ApiBlog
}

export async function deleteBlog(id: string): Promise<void> {
  ensureApiUrl()
  const res = await fetch(`${API_URL}/blogs/delete/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to delete blog')
  }
}

export async function toggleLikeBlog(id: string): Promise<{ likes: number }> {
  ensureApiUrl()
  const res = await fetch(`${API_URL}/blogs/like/${id}`, {
    method: 'POST',
    credentials: 'include',
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to toggle like')
  }
  const data = await res.json().catch(() => ({}))
  return { likes: data.likes ?? 0 }
}

export function getBlogImageUrl(featuredImage?: string) {
  if (!featuredImage) return ''
  if (!API_URL) return featuredImage
  return `${API_URL}/uploads/images/${featuredImage}`
}

