"use client"

import {
  FolderIcon,
  MoreHorizontalIcon,
  ShareIcon,
  type LucideIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function ParkingOwner({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Parking Owner Menu</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild size='lg'>
              <a href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
            {/* <DropdownMenu> */}
            {/*   <DropdownMenuTrigger asChild> */}
            {/*     <SidebarMenuAction */}
            {/*       showOnHover */}
            {/*       className="rounded-sm data-[state=open]:bg-accent" */}
            {/*     > */}
            {/*       <MoreHorizontalIcon /> */}
            {/*       <span className="sr-only">More</span> */}
            {/*     </SidebarMenuAction> */}
            {/*   </DropdownMenuTrigger> */}
            {/*   <DropdownMenuContent */}
            {/*     className="w-24 rounded-lg" */}
            {/*     side={isMobile ? "bottom" : "right"} */}
            {/*     align={isMobile ? "end" : "start"} */}
            {/*   > */}
            {/*     <DropdownMenuItem> */}
            {/*       <FolderIcon /> */}
            {/*       <span>Open</span> */}
            {/*     </DropdownMenuItem> */}
            {/*     <DropdownMenuItem> */}
            {/*       <ShareIcon /> */}
            {/*       <span>Share</span> */}
            {/*     </DropdownMenuItem> */}
            {/*   </DropdownMenuContent> */}
            {/* </DropdownMenu> */}
          </SidebarMenuItem>
        ))}
        {/* <SidebarMenuItem> */}
        {/*   <SidebarMenuButton className="text-sidebar-foreground/70" size='lg'> */}
        {/*     <MoreHorizontalIcon className="text-sidebar-foreground/70" /> */}
        {/*     <span>More</span> */}
        {/*   </SidebarMenuButton> */}
        {/* </SidebarMenuItem> */}
      </SidebarMenu>
    </SidebarGroup>
  )
}
