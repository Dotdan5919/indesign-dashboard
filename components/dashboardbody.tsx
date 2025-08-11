import React from 'react'
import { SidebarInset } from './ui/sidebar'
import { SiteHeader } from './site-header'
import { SectionCards } from './section-cards'
import { ChartAreaInteractive } from './chart-area-interactive'
import { DataTable } from './data-table'
import data from "@/app/dashboard/data.json"
import useProfile from '@/hooks/useProfile'
export default function Dashboardbody() {

   const {isLoading}=useProfile();
   

   if (isLoading) {

    return <div className="flex items-center justify-center h-full">Loading...</div>; // or a loading spinner
    }

  return (
   <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
  )
}
