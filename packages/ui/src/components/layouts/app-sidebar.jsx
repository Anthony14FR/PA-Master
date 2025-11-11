'use client'

import { useAuth } from '@kennelo/hooks/useAuth'
import { Avatar, AvatarFallback, AvatarImage } from '@kennelo/ui/avatar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@kennelo/ui/collapsible'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@kennelo/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@kennelo/ui/sidebar'
import {
  Bell,
  Building2,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  Home,
  LogOut,
  Settings,
  User
} from "lucide-react"
import { useState } from "react"

// Données fictives pour les entreprises
const companies = [
  {
    name: "Kennelo Inc",
    logo: "K",
    plan: "Enterprise",
  },
  {
    name: "Globex Corp",
    logo: "G",
    plan: "Pro",
  },
  {
    name: "Initech",
    logo: "I",
    plan: "Starter",
  },
]

// Données fictives pour les sous-menus d'entreprise
const companyMenuItems = [
  {
    title: "Équipes",
    url: "#",
  },
  {
    title: "Projets",
    url: "#",
  },
  {
    title: "Statistiques",
    url: "#",
  },
  {
    title: "Paramètres",
    url: "#",
  },
]

const items = [
  {
    title: "Home",
    url: "/dashboard/home",
  },
  {
    title: "Calendar",
    url: "#",
  },
  {
    title: "Search",
    url: "#",
  },
  {
    title: "Settings",
    url: "#",
  },
]

export function AppSidebar() {
  const { user, logout } = useAuth()
  const [activeCompany, setActiveCompany] = useState(companies[0])
  const [isCompanyMenuOpen, setIsCompanyMenuOpen] = useState(true)
  const [isApplicationMenuOpen, setIsApplicationMenuOpen] = useState(true)

  return (
    <Sidebar>
      <SidebarHeader>
        {/* Section Entreprise avec dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-black text-white">
                <span className="text-lg font-bold">{activeCompany.logo}</span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{activeCompany.name}</span>
                <span className="truncate text-xs">{activeCompany.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            {companies.map((company, index) => (
              <DropdownMenuItem
                key={company.name}
                onClick={() => setActiveCompany(company)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm bg-black text-white">
                  <span className="text-sm font-bold">{company.logo}</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{company.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{company.plan}</span>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border border-dashed">
                <Building2 className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Ajouter une entreprise</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Menu collapsible de l'entreprise */}
      </SidebarHeader>

      <SidebarContent>
        <Collapsible open={isCompanyMenuOpen} onOpenChange={setIsCompanyMenuOpen} className="group/collapsible">
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center gap-2 text-sm font-medium">
                <Building2 className="size-4" />
                <span>Entreprise</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="border-l py-0.5 px-2.5 border-sidebar-border gap-1 translate-x-px mx-3.5">
                  {companyMenuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        <Collapsible open={isApplicationMenuOpen} onOpenChange={setIsApplicationMenuOpen} className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center gap-2 text-sm font-medium">
                <Home className="size-4" />
                <span>Application</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="border-l py-0.5 px-2.5 border-sidebar-border gap-1 translate-x-px mx-3.5">
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>

      <SidebarFooter>
        {/* Section Utilisateur avec dropdown */}
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src="/profile.jpg"
                      alt={user?.name || 'User'}
                    />
                    <AvatarFallback className="rounded-lg">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name || 'Utilisateur'}</span>
                    <span className="truncate text-xs">{user?.email || 'utilisateur@exemple.com'}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem className="gap-2">
                  <User className="h-4 w-4" />
                  <span>Mon compte</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Facturation</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
} 