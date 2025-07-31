"use client"

import { useState } from "react"
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

interface Blog {
  id: string
  title: string
  content: string
  excerpt: string
  status: "draft" | "published" | "archived"
  author: string
  createdAt: string
  updatedAt: string
  tags: string[]
  image: string // URL to blog image
}

const mockBlogs: Blog[] = [
  {
    id: "1",
    title: "Getting Started with Next.js",
    content: "Next.js is a powerful React framework...",
    excerpt: "Learn how to build modern web applications with Next.js",
    status: "published",
    author: "John Doe",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    tags: ["Next.js", "React", "Web Development"],
    image: "/next.svg"
  },
  {
    id: "2",
    title: "E-commerce Best Practices",
    content: "Building a successful e-commerce platform...",
    excerpt: "Essential strategies for creating a profitable online store",
    status: "draft",
    author: "Jane Smith",
    createdAt: "2024-01-18",
    updatedAt: "2024-01-18",
    tags: ["E-commerce", "Business", "Marketing"],
    image: "/vercel.svg"
  },
  {
    id: "3",
    title: "UI/UX Design Principles",
    content: "Creating user-friendly interfaces...",
    excerpt: "Key principles for designing intuitive user experiences",
    status: "published",
    author: "Mike Johnson",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-15",
    tags: ["Design", "UX", "UI"],
    image: "/globe.svg"
  }
]

export function BlogsTable() {
  const [blogs, setBlogs] = useState<Blog[]>(mockBlogs)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setBlogs(blogs.filter(blog => blog.id !== id))
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
                  <img src={blog.image} alt={blog.title} className="w-16 h-16 object-cover rounded" />
                </TableCell>
                <TableCell className="font-medium">{blog.title}</TableCell>
                <TableCell>{blog.author}</TableCell>
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
                <TableCell>{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
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
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={editingBlog.image}
                  onChange={(e) => setEditingBlog({
                    ...editingBlog,
                    image: e.target.value
                  })}
                />
              </div>
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
                  value={editingBlog.excerpt}
                  onChange={(e) => setEditingBlog({
                    ...editingBlog,
                    excerpt: e.target.value
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={editingBlog.content}
                  onChange={(e) => setEditingBlog({
                    ...editingBlog,
                    content: e.target.value
                  })}
                  rows={6}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={editingBlog.status}
                  onChange={(e) => setEditingBlog({
                    ...editingBlog,
                    status: e.target.value as "draft" | "published" | "archived"
                  })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => editingBlog && handleSave(editingBlog)}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 