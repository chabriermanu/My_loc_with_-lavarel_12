import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';
import Nav from '@/components/Nav';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar"> 
            <div className="flex flex-col min-h-screen"> 
                <Nav /> {/* Toujours en haut */} 
                <div className="flex flex-row flex-1"> 
                    <AppSidebar /> {/* À gauche */} 
                    <AppContent className="flex-1"> 
                        <AppSidebarHeader />
                         {children} 
                    </AppContent> 
                </div> 
            </div> 
        </AppShell>
    );
}
