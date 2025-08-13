"use client"

import { useEffect, useMemo, useState } from "react"
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
import { Edit, MoreHorizontal, Trash2, Eye, Package, Image as ImageIcon } from "lucide-react"
import { deleteProduct, fetchProducts, getProductPrimaryImageUrl, updateProduct, type Product } from "@/lib/api"
import { useRouter } from "next/navigation"

type EditableProduct = Product & { imageFiles?: File[] }

export function ProductsTable() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<EditableProduct | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    let ignore = false
    ;(async () => {
      try {
        setLoading(true)
        const data = await fetchProducts()
        if (!ignore) {
          setProducts(data)
        }
      } catch (e: any) {
        if (!ignore) {
          if (e?.message?.includes("Authentication required")) {
            router.push("/login")
          } else {
            setError(e?.message || "Failed to load products")
          }
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    })()
    return () => {
      ignore = true
    }
  }, [])

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p._id !== id))
    } catch (e: any) {
      if (e?.message?.includes("Authentication required")) {
        router.push("/login")
      } else {
        alert(e?.message || "Failed to delete product")
      }
    }
  }

  const handleSave = async () => {
    if (!editingProduct) return
    try {
      const { _id, imageFiles, images, createdAt, updatedAt, slug, ...rest } = editingProduct
      const updated = await updateProduct(
        _id,
        {
          name: rest.name,
          description: rest.description,
          price: rest.price,
          stock: rest.stock,
          category: rest.category,
          status: rest.status,
        },
        imageFiles
      )
      setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
      setIsEditDialogOpen(false)
      setEditingProduct(null)
    } catch (e: any) {
      if (e?.message?.includes("Authentication required")) {
        router.push("/login")
      } else {
        alert(e?.message || "Failed to update product")
      }
    }
  }

  const getStatusBadge = (status: Product["status"]) => {
    const variants: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      draft: "bg-yellow-100 text-yellow-800",
      discontinued: "bg-red-100 text-red-800",
    }
    return (
      <Badge className={variants[status] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  if (loading) {
    return <div className="p-4">Loading products...</div>
  }
  if (error) {
    return <div className="p-4 text-red-600">{error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const imageUrl = getProductPrimaryImageUrl(product)
              return (
                <TableRow key={product._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-16 border rounded flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <span className="font-medium">{formatCurrency(product.price)}</span>
                  </TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(product)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Make changes to your product here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={editingProduct.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingProduct({
                    ...editingProduct,
                    name: e.target.value
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingProduct.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditingProduct({
                    ...editingProduct,
                    description: e.target.value
                  })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingProduct({
                      ...editingProduct,
                      price: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingProduct({
                      ...editingProduct,
                      stock: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={editingProduct.category}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingProduct({
                    ...editingProduct,
                    category: e.target.value
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={editingProduct.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditingProduct({
                    ...editingProduct,
                    status: e.target.value as Product["status"],
                  })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                  <option value="discontinued">Discontinued</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="images">Replace Images (max 3)</Label>
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const files = e.target.files ? Array.from(e.target.files).slice(0, 3) : []
                    setEditingProduct({ ...editingProduct, imageFiles: files })
                  }}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}