"use client"

import * as React from "react"
import {
  ClipboardListIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  ReceiptText,
  CircleParking,
  StarIcon,
  Wallet,
  InboxIcon
} from "lucide-react"

import { ParkingOwner } from "./nav-owner"
import { NavDriver } from "./nav-driver"
import { NavMore } from "./nav-more"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useGetUser } from "@/hooks/userProfile"
import { NavUserSkeleton } from "./ui/nav-user-skeleton"

const data = {
  user: {
    name: "shri",
    email: "shri@mail.com",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocIVAAhEAF29llJtXcJQLIwBNWWyaVxkPG0G-uTX86jzDbSd4ebF=s576-c-no",
  },
  navDriver: [
    {
      title: "Driver Dashboard",
      url: "/driver",
      icon: LayoutDashboardIcon,
    },
    // {
    //   title: "Find Parking",
    //   url: "/driver/map",
    //   icon: SearchIcon,
    // },
    {
      title: "Bookings",
      url: "/driver/bookings",
      icon: ListIcon,
    },
    {
      title: "Favourites",
      url: "/driver/favourites",
      icon: StarIcon,
    },
    {
      title: "Payments & Invoices",
      url: "/driver/payments",
      icon: ReceiptText,
    },
  ],
  navOwner: [
    // {
    //   title: "Owner Dashboard",
    //   url: "/owner/dashboard",
    //   icon: LayoutDashboardIcon,
    // },
    {
      title: "My Parking Spaces",
      url: "/owner/parkings",
      icon: CircleParking,
    },
    // {
    //   title: "Add New Space",
    //   url: "/owner/add-space",
    //   icon: PlusCircleIcon,
    // },
    {
      title: "Booking Requests",
      url: "/owner/requests",
      icon: InboxIcon,
    },
    // {
    //   title: "Availability Calendar",
    //   url: "/owner/calendar",
    //   icon: CalendarIcon,
    // },
    // {
    //   title: "Pricing Management",
    //   url: "/owner/pricing",
    //   icon: BarChartIcon,
    // },
    // {
    //   title: "Earnings & Payouts",
    //   url: "/owner/earnings",
    //   icon: WalletIcon,
    // },
  ],
  navMore: [
    {
      title: "My Wallet",
      url: "/account",
      icon: Wallet,
    },
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    // {
    //   title: "Get Help",
    //   url: "#",
    //   icon: HelpCircleIcon,
    // },
    // {
    //   title: "Search",
    //   url: "#",
    //   icon: SearchIcon,
    // },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userData, loading, error } = useGetUser();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 h-12"
            >
              <a href="#">
                <Image
                  src="/icons/web-app-manifest-192x192.png"
                  alt="Dparker"
                  width={45}
                  height={45}
                />

                {/* <span className="text-base font-semibold">Dparkr</span> */}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavDriver items={data.navDriver} />
        <ParkingOwner items={data.navOwner} />
        <NavMore items={data.navMore} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {loading ? <NavUserSkeleton /> : <NavUser user={userData!} />}
      </SidebarFooter>
    </Sidebar>
  )
}
