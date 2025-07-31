import { IconTrendingDown, IconTrendingUp, IconArticle, IconBuildingStore, IconPackage } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Link href="/dashboard/blogs" className="block">
        <Card className="@container/card hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardDescription>Blog Posts</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              12
            </CardTitle>
            <CardAction>
              <IconArticle className="size-5" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Manage your blog content <IconArticle className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Create, edit, and publish posts
            </div>
          </CardFooter>
        </Card>
      </Link>
      <Link href="/dashboard/shops" className="block">
        <Card className="@container/card hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardDescription>Online Shops</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              3
            </CardTitle>
            <CardAction>
              <IconBuildingStore className="size-5" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Manage your stores <IconBuildingStore className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Control multiple shop instances
            </div>
          </CardFooter>
        </Card>
      </Link>
      <Link href="/dashboard/products" className="block">
        <Card className="@container/card hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardDescription>Products</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              156
            </CardTitle>
            <CardAction>
              <IconPackage className="size-5" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Manage your catalog <IconPackage className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Add, edit, and track inventory
            </div>
          </CardFooter>
        </Card>
      </Link>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $75,250.00
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Across all your shops
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
