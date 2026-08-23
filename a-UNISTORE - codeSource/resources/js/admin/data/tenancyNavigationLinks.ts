import {
  LayoutDashboard, Store, Users, Shield, Lock as LockIcon, List, Plus, 
  BarChart3, TrendingUp, Settings, Sliders, Palette
} from 'lucide-react';

interface SubLink {
  title: string;
  icon: React.ElementType;
  href: string;         // route name — resolve with route(href) in sidebar
  disabled?: boolean;   // true = route not yet defined in Laravel
}

interface MenuItem {
  title: string;
  icon: React.ElementType;
  href?: string;
  badge?: number;
  badgeColor?: string;
  subLinks?: SubLink[];
  section?: boolean;
  sectionTitle?: string;
}

export const tenancyNavigationLinks: MenuItem[] = [
  // ── OVERVIEW ──────────────────────────────────────────────────────────
  { section: true, sectionTitle: "Tenancy Overview", icon: BarChart3, title: 'overview' },
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    subLinks: [
      { title: "Stats", icon: BarChart3, href: "tenancy.dashboard" },
      { title: "Growth", icon: TrendingUp, href: "tenancy.dashboard" },
    ]
  },

  // ── STORE MANAGEMENT ──────────────────────────────────────────────────
  { section: true, sectionTitle: "Store Management", icon: Store, title: 'stores' },
  {
    title: "Stores",
    icon: Store,
    subLinks: [
      { title: "All Stores", icon: List, href: "tenancy.stores" },
      { title: "Create Store", icon: Plus, href: "tenancy.stores" },
    ]
  },

  // ── ACCESS CONTROL ────────────────────────────────────────────────────
  { section: true, sectionTitle: "Access Control", icon: Shield, title: 'access' },
  {
    title: "Roles",
    icon: Shield,
    subLinks: [
      { title: "All Roles", icon: List, href: "tenancy.roles" },
      { title: "Permissions", icon: LockIcon, href: "tenancy.roles" },
    ]
  },
  {
    title: "Admins",
    icon: Users,
    subLinks: [
      { title: "All Admins", icon: List, href: "tenancy.roles" },
      { title: "Invite Admin", icon: Plus, href: "tenancy.roles" },
    ]
  },

  // ── SYSTEM SETTINGS ───────────────────────────────────────────────────
  { section: true, sectionTitle: "System", icon: Settings, title: 'system' },
  {
    title: "Settings",
    icon: Settings,
    subLinks: [
      { title: "Global Config", icon: Sliders, href: "tenancy.dashboard" },
      { title: "Appearance", icon: Palette, href: "tenancy.dashboard" },
    ]
  },
];
