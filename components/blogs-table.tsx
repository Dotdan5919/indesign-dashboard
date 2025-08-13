"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Edit, MoreHorizontal, Trash2, Eye } from "lucide-react"
import { ApiBlog, deleteBlog, fetchBlogs, getBlogImageUrl, updateBlog } from "@/lib/blogs"
type BlogRow = {
  id: string
  title: string
  content: string
  status: "draft" | "published" | "archived"
  author?: string
  createdAt?: string
  updatedAt?: string
  tags: string[]
  image?: string
}

export function BlogsTable() {
  const [blogs, setBlogs] = useState<BlogRow[]>([])
  const [editingBlog, setEditingBlog] = useState<BlogRow | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editImageFile, setEditImageFile] = useState<File | null>(null)

  const loadBlogs = async () => {
    setLoading(true)
    try {
      const apiBlogs = await fetchBlogs()
      const rows: BlogRow[] = apiBlogs.map((b: ApiBlog) => ({
        id: b._id,
        title: b.title,
        content: b.content,
        status: (b.status?.toLowerCase() as any) || 'published',
        author: b.author_id,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
        tags: [],
        image: getBlogImageUrl(b.featured_image),
      }))
      setBlogs(rows)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBlogs()
  }, [])

  const handleEdit = (blog: BlogRow) => {
    setEditingBlog(blog)
    setEditImageFile(null)
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteBlog(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
    } catch (e: any) {
      alert(e?.message || 'Failed to delete')
    }
  }

  const handleSave = (updatedBlog: Blog) => {
    setBlogs(blogs.map(blog => 
      blog.id === updatedBlog.id ? updatedBlog : blog
    ))
    setIsEditDialogOpen(false)
    setEditingBlog(null)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      published: "bg-green-100 text-green-800",
      draft: "bg-yellow-100 text-yellow-800",
      archived: "bg-gray-100 text-gray-800"
    }
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status}
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      {loading && <div className="text-sm text-muted-foreground">Loading blogs...</div>}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>
                  {blog.image ? (
                    <img src={blog.image} alt={blog.title} className="w-16 h-16 object-cover rounded" />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{blog.title}</TableCell>
                <TableCell>{blog.author || '-'}</TableCell>
                <TableCell>{getStatusBadge(blog.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {blog.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {blog.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{blog.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : '-'}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(blog)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDelete(blog.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
                         <DialogDescription>
               Make changes to your blog post here. Click save when you&apos;re done.
             </DialogDescription>
          </DialogHeader>
          {editingBlog && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editingBlog.title}
                  onChange={(e) => setEditingBlog({
                    ...editingBlog,
                    title: e.target.value
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={editingBlog.content}
                  onChange={(e) => setEditingBlog({
                    ...editingBlog,
                    content: e.target.value
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="featured_image_edit">Featured image</Label>
                <Input
                  id="featured_image_edit"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditImageFile(e.target.files?.[0] ?? null)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={async () => {
              if (!editingBlog) return
              try {
                const updated = await updateBlog({
                  id: editingBlog.id,
                  title: editingBlog.title,
                  content: editingBlog.content,
                  featuredImageFile: editImageFile ?? undefined,
                })
                await loadBlogs()
                setIsEditDialogOpen(false)
                setEditingBlog(null)
              } catch (e: any) {
                alert(e?.message || 'Failed to save changes')
              }
            }}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 