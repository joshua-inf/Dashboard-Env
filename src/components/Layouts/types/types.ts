export interface MenuItem {
    icon: React.ReactNode;
    label: string;
    route: string | undefined;
    children?: MenuItem[];
    badge?: string;
}

export interface SidebarItemProps {
    item: Partial<MenuItem>[];
    pageName: string;
    setPageName: (name: string) => void;
    withIcons?: boolean;
}

export interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}
