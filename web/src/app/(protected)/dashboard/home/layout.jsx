import { AppSidebar } from "@/shared/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/shared/components/ui/sidebar"

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="p-4">
          <SidebarTrigger />
        </div>
        <div className="p-4">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}