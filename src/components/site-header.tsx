import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { MenuIcon } from "lucide-react";
import {useSidebar} from "@/components/ui/sidebar"

const pageTitles: Record<string, string> = {
  '/driver': 'Driver Dashboard',
  '/driver/favourites': 'Favourite Parkings',
  '/driver/bookings': 'Recent Bookings',
  '/driver/payments': 'Payment History',
  '/owner/parkings': 'My Parking Spaces',
  '/owner/requests': 'Recent Booking Requests',
  '/reports': 'Reports', 
  '/settings': 'Settings',
}

export function SiteHeader() {
  const pathname = usePathname()
  const title = pageTitles[pathname] || 'Dashboard'
  const { toggleSidebar } = useSidebar()

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear
      sticky top-0 sm:static  sm:bg-transparent  z-50 sm:z-auto
       bg-black/40 backdrop-blur-md sm:backdrop-blur-0
      ">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 hidden sm:block" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>

        <div className="ml-auto sm:hidden" onClick={()=> toggleSidebar()}>
          <MenuIcon className="w-5 h-5" />
        </div>
      </div>
    </header>
  )
}
