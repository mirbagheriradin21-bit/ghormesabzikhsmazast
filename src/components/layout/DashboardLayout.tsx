import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { StatusBar } from "@/components/dashboard/StatusBar";
import { BackendStatusIndicator } from "@/components/dashboard/BackendStatusIndicator";
import { ConnectionGuideModal } from "@/components/dashboard/ConnectionGuideModal";
import { useConnection } from "@/contexts/ConnectionContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isPrimaryConnected } = useConnection();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <header className="h-14 border-b border-border bg-card/50 flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">Fzero (ISC Dubai)</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">Dubai Autodrome</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BackendStatusIndicator />
              <ConnectionGuideModal />
              {isPrimaryConnected && (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success pulse-live" />
                  <span className="text-xs text-success font-medium uppercase tracking-wider">Live</span>
                </div>
              )}
            </div>
          </header>

          {/* Status Bar */}
          <StatusBar
            connectionStatus="connected"
            signalStrength={-55}
            snr={22}
            batteryLevel={78}
            uptime="01:23:45"
            dataRate={42}
          />

          {/* Main Content */}
          <main className={`flex-1 p-4 overflow-auto grid-pattern transition-all duration-500 ${isPrimaryConnected ? 'shadow-[inset_0_0_60px_hsl(var(--primary)/0.03)]' : ''}`}>
            {children}
          </main>

          {/* Footer */}
          <footer className="px-6 py-3 bg-card/50 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>ATLAS_LITE v1.0</span>
              <span>•</span>
              <span className="font-mono">Session: PST-2024-001</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Powered by</span>
              <span className="gradient-text-quantum font-semibold">Quantum-Enhanced AI</span>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
