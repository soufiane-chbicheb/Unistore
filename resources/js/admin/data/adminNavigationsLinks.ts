import {
  LayoutDashboard, BarChart3, TrendingUp, Zap, Package, List, Plus, Pencil,
  Trash, Upload, Star, Palette, Ruler, FolderTree, GitBranch, MessageSquare,
  ShoppingCart, Clock, CheckCircle, XCircle, RotateCcw, Users, Crown, Tag,
  Box, AlertTriangle, History as HistoryIcon, Warehouse, Flag, Megaphone,
  Mail, Image as ImageIcon, Percent, FileText, DollarSign, PieChart, Ship,
  Map as MapIcon, Truck, Navigation, Shield, Lock as LockIcon, Settings,
  Sliders, CreditCard, Receipt, Store, Search, Bell, Settings2, FolderGit,
  SectionIcon, LayoutGrid,
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

export const menuItems: MenuItem[] = [

  // ── ANALYTICS & OVERVIEW ────────────────────────────────────────────────────
  { section: true, sectionTitle: "Analytics & Overview", icon: BarChart3, title: 'analytics' },

  {
    title: "Dashboard",
    icon: LayoutDashboard,
    subLinks: [
      { title: "Overview", icon: BarChart3, href: "dashboard.overview" },
      { title: "Sales", icon: DollarSign, href: "dashboard.sales_analytics" },
      { title: "Customers", icon: TrendingUp, href: "dashboard.customers_analytics" },
      { title: "Inventory", icon: Zap, href: "dashboard.inventory_analytics" },
      { title: "alerts", icon: Zap, href: "" },
    ]
  },
  {
    title: "Reports",
    icon: BarChart3,
    subLinks: [
      { title: "Sales Report", icon: DollarSign, href: "dashboard.sales_analytics" },
      { title: "Product Performance", icon: TrendingUp, href: "" },
      { title: "Customer Insights", icon: Users, href: "dashboard.customers_analytics" },
      { title: "Financial Reports", icon: PieChart, href: "" },
    ]
  },

  // ── CATALOG MANAGEMENT ───────────────────────────────────────────────────────
  { section: true, sectionTitle: "Catalog Management", icon: Package, title: 'catalog' },

  {
    title: "Products",
    icon: Package,
    subLinks: [
      { title: "Drafts", icon: FolderGit, href: "drafts.index" },  // ✅
      { title: "All Products", icon: List, href: "products" },  // ✅
      { title: "Add Product", icon: Plus, href: "products.create" },  // ✅
      { title: "Bulk Upload", icon: Upload, href: "" },
      { title: "Featured Products", icon: Star, href: "" },
    ]
  },
  {
    title: "Variants",
    icon: Palette,
    subLinks: [
      { title: "Manage Attributes", icon: Ruler, href: "get.attributes" },  // ✅
    ]
  },
  {
    title: "Categories",
    icon: FolderTree,
    subLinks: [
      { title: "All Categories", icon: List, href: "categories.index" },
      { title: "Add Category", icon: Plus, href: "categories.create" },  // ✅
      { title: "Category Tree", icon: GitBranch, href: "categories.tree" },
    ]
  },
  {
    title: "Inventory",
    icon: Box,
    subLinks: [
      { title: "Stock Levels", icon: BarChart3, href: "" },
      { title: "Low Stock Alert", icon: AlertTriangle, href: "" },
      { title: "Stock History", icon: HistoryIcon, href: "" },
      { title: "Warehouses", icon: Warehouse, href: "" },
    ]
  },

  // ── SALES & ORDERS ───────────────────────────────────────────────────────────
  { section: true, sectionTitle: "Sales & Orders", icon: ShoppingCart, title: 'sales' },

  {
    title: "Orders",
    icon: ShoppingCart,
    subLinks: [
      { title: "All Orders", icon: List, href: "orders.index" },  // ✅
      { title: "Pending Orders", icon: Clock, href: "" },
      { title: "Processing", icon: Package, href: "" },
      { title: "Shipped", icon: Ship, href: "" },
      { title: "Completed", icon: CheckCircle, href: "" },
      { title: "Cancelled", icon: XCircle, href: "" },
      { title: "Returns", icon: RotateCcw, href: "" },
    ]
  },
  {
    title: "Store",
    icon: Store,
    subLinks: [

      { title: "Home editor", icon: SectionIcon, href: "home.editor.index", disabled: false },
      { title: "collections", icon: SectionIcon, href: "collections.index", disabled: false },
      { title: "banners", icon: SectionIcon, href: "banners.index", disabled: false },
      { title: "theme", icon: Palette, href: "store.theme", disabled: false },
      { title: "product cards", icon: LayoutGrid, href: "store.cards", disabled: false },
    ]
  },
  {
    title: "Shipping",
    icon: Ship,
    subLinks: [
      { title: "Shipping Setup", icon: MapIcon, href: "admin.shipping.index" },  // ✅
      { title: "Shipping Rates", icon: DollarSign, href: "" },
      { title: "Carriers", icon: Truck, href: "" },
      { title: "Track Shipments", icon: Navigation, href: "" },
    ]
  },

  // ── CUSTOMERS & COMMUNICATIONS ───────────────────────────────────────────────
  { section: true, sectionTitle: "Customers & Communications", icon: Users, title: 'customers' },

  {
    title: "Customers",
    icon: Users,
    subLinks: [
      { title: "All Customers", icon: List, href: "customers.index" },
      { title: "VIP Customers", icon: Crown, href: "" },
      { title: "Customer Groups", icon: Users, href: "" },
      { title: "Customer Analytics", icon: BarChart3, href: "dashboard.customers_analytics" },
    ]
  },
  {
    title: "Messages",
    icon: MessageSquare,
    badge: 5,
    badgeColor: 'bg-red-500',
    subLinks: [
      { title: "Messages", icon: List, href: "messages" },
    ]
  },
  {
    title: "Reviews",
    icon: MessageSquare,
    badge: 12,
    badgeColor: 'bg-orange-500',
    subLinks: [
      { title: "All Reviews", icon: List, href: "reviews.index" },
      { title: "Pending Approval", icon: Clock, href: "reviews.pending" },
      { title: "Approved", icon: CheckCircle, href: "" },
      { title: "Reported Reviews", icon: Flag, href: "" },
    ]
  },

  // ── MARKETING & PROMOTIONS ───────────────────────────────────────────────────
  { section: true, sectionTitle: "Marketing & Promotions", icon: Megaphone, title: 'marketing' },

  {
    title: "Promotions",
    icon: Megaphone,
    subLinks: [
      { title: "All Promotions", icon: List, href: "promotions.index" },  // ✅
      { title: "Add Promotion", icon: Plus, href: "promotions.create" }, // ✅
      { title: "Email Campaigns", icon: Mail, href: "" },
      { title: "Newsletter", icon: FileText, href: "" },
    ]
  },
  {
    title: "Coupons",
    icon: Tag,
    subLinks: [
      { title: "All Coupons", icon: List, href: "coupons.index" },  // ✅
      { title: "Create Coupon", icon: Plus, href: "coupons.create" }, // ✅
    ]
  },

  // ── CONFIGURATIONS ───────────────────────────────────────────────────────────
  { section: true, sectionTitle: "Configurations", icon: Settings2, title: 'configurations' },

  {
    title: "Admins",
    icon: Shield,
    subLinks: [
      { title: "All Admins", icon: List, href: "admins.index" },
      { title: "Roles & Permissions", icon: LockIcon, href: "admin.roles.index" },
      { title: "Activity Log", icon: HistoryIcon, href: "" },
    ]
  },
  {
    title: "Settings",
    icon: Settings,
    subLinks: [
      { title: "Configure Store", icon: Sliders, href: "admin.settings" },  
      { title: "Admin Theme", icon: Palette, href: "admin.theme" }, 
      { title: "Payment Methods", icon: CreditCard, href: "" },
      { title: "Tax Settings", icon: Receipt, href: "" },
      { title: "Store Settings", icon: Store, href: "" },
      { title: "SEO Settings", icon: Search, href: "" },
      { title: "Notifications", icon: Bell, href: "" },
    ]
  },
];