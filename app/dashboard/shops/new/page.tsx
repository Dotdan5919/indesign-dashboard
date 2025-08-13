import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { NewShopForm } from "@/components/new-shop-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import ProfileProvider from "@/context/ProfileContext"

export default function NewShopPage() {
  return (
    <ProfileProvider>
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="flex items-center gap-4 px-4 lg:px-6">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/dashboard/shops">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">New Shop</h1>
                  <p className="text-muted-foreground">
                    Create a new online shop for your business
                  </p>
                </div>
              </div>
              <div className="px-4 lg:px-6">
                <NewShopForm />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </ProfileProvider>
  )
} 