import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Pencil, Trash2, Image as ImageIcon, Star, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { formatCurrency } from "@/admin/utils/helpers";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";
import { Cover } from "@/types/inventoryTypes";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import { SectionHeader } from "@/admin/components/layout/SectionHeader";
import { PaginationSlide } from "@/components/ui/PaginationSlide";
import { useAdminThemeCtx } from "@/contextHooks/useAdminThemeCtx";
import MultiSelectDropdownForObject, { AllowedObjectsType } from "@/components/ui/MultiSelectDropdownForObject";

// ===================== TYPES =====================
export interface ProductListItem {
  id: string;
  name: string | null;
  brand?: string;
  price?: string | number;
  compareAtPrice?: string;
  stockQuantity?: number;
  sku?: string;
  thumbnail?: Cover | null;
  category?: { id: string; name: string }[];
  is_featured?: boolean;
  status: "active" | "draft" | "inactive" | "published";
  variants?: {
    id: string;
    sku?: string;
    price?: number;
    stock?: number;
    is_default?: boolean;
  }[];
  nichCategory?: { id: string; name: string };
  subCategories?: { id: string; name: string }[];
}

// ===================== COMPONENT =====================
export default function ProductsList() {
  const { products = [] } = usePage().props as { products: ProductListItem[] };
  const { state: { currentTheme: theme } } = useAdminThemeCtx();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const itemsPerPage = 10;

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      (product.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.sku || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Helper to get product image with fallback
  const getProductImage = (product: ProductListItem) => {
    if (product.thumbnail?.url && !product.thumbnail.url.includes('/storage/products/')) {
      return product.thumbnail.url;
    }
    // Fallback to a high-quality placeholder if no image or if it's a default storage path that might not exist
    return `https://picsum.photos/seed/${product.id}/200/200`;
  };

  const deleteProduct = () => {
    if (!deleteId) return;
    setDeleteId(null);
  };

  return (
    <div 
      className="space-y-6 p-6 min-h-screen"
      style={{ 
        background: `linear-gradient(135deg, ${theme.bg} 0%, ${theme.bgSecondary} 100%)`,
      }}
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div 
          className="absolute w-[500px] h-[500px] rounded-full -top-[250px] -right-[250px] animate-pulse"
          style={{
            background: `radial-gradient(circle, ${theme.accent}10 0%, transparent 70%)`,
          }}
        />
        <div 
          className="absolute w-[400px] h-[400px] rounded-full -bottom-[200px] -left-[200px] animate-pulse"
          style={{
            background: `radial-gradient(circle, ${theme.info}10 0%, transparent 70%)`,
            animationDelay: '2s',
          }}
        />
      </div>

      <div>
       
        <SectionHeader title="Products" description="Manage your product inventory with precision" Icon={Package} >
          <Button 
          onClick={() => router.visit(route("products.create"))}
          className="hover:scale-105 transition-transform"
          style={{
            background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accentHover} 100%)`,
            boxShadow: `0 4px 15px ${theme.accent}40`,
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
        </SectionHeader>
        
      </div>

      <Card 
        className="overflow-hidden"
        style={{
          background: theme.card,
          border: `1px solid ${theme.border}`,
          borderRadius: theme.borderRadius,
          boxShadow: theme.shadowLg,
        }}
      >
        <CardHeader style={{ background: theme.bg, borderBottom: `1px solid ${theme.border}` }}>
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search 
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" 
                style={{ color: theme.textMuted }}
              />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="transition-all focus:scale-[1.02]"
                style={{
                  border: `2px solid ${theme.border}`,
                }}
              >
                <Search size={16} />
              </Input>
            </div>
           
            <MultiSelectDropdownForObject 
            multiple={false}
            label="Filter by Status"
            selectedValues={[{value: statusFilter , label : statusFilter === "all" ? "All Status" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1) }]}
            onChange={(selected : AllowedObjectsType[]) => setStatusFilter(String(selected[0].value))} 
            options={[{label : "All Status" , value : "all" } ,
            {label : "Active" , value : "active" } ,
            {label : "Draft" , value : "draft" } ,
            {label : "Inactive" , value : "inactive"}
            ]}

             />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredProducts.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow style={{ background: theme.bgSecondary, borderBottom: `2px solid ${theme.border}` }}>
                      <TableHead style={{ color: theme.textSecondary, fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Product</TableHead>
                      <TableHead style={{ color: theme.textSecondary, fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Categories</TableHead>
                      <TableHead style={{ color: theme.textSecondary, fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>SKU</TableHead>
                      <TableHead style={{ color: theme.textSecondary, fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Price</TableHead>
                      <TableHead style={{ color: theme.textSecondary, fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Stock</TableHead>
                      <TableHead style={{ color: theme.textSecondary, fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Status</TableHead>
                      <TableHead className="text-right" style={{ color: theme.textSecondary, fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product: ProductListItem) => {
                      const variants = product.variants || [];
                      const defaultVariant = variants.find((v) => v.is_default) || variants[0];
                      const totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);
                      const price = defaultVariant?.price;
                      const sku = defaultVariant?.sku;

                      return (
                        <TableRow
                          key={product.id}
                          className="hover:bg-opacity-50 transition-colors"
                          style={{
                            borderBottom: `1px solid ${theme.border}`,
                            background: theme.bg,
                          }}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={getProductImage(product)}
                                alt={product.name || "Product"}
                                className="h-14 w-14 rounded-lg object-cover"
                                style={{ border: `2px solid ${theme.border}` }}
                                onError={(e) => {
                                  // Fallback if the image fails to load
                                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${product.name || "Product"}`;
                                }}
                              />
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-semibold" style={{ color: theme.text }}>
                                    {product.name || 'Unnamed Product'}
                                  </p>
                                  {product.is_featured && (
                                    <Star
                                      size={14}
                                      style={{ color: theme.warning }}
                                      fill={theme.warning}
                                    />
                                  )}
                                </div>
                                {product.brand && (
                                  <p className="text-sm" style={{ color: theme.textMuted }}>
                                    {product.brand}
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1.5">
                              {product.nichCategory && (
                                <span
                                  className="px-2 py-1 rounded-md text-xs font-semibold"
                                  style={{
                                    background: `${theme.accent}15`,
                                    color: theme.accent,
                                    border: `1px solid ${theme.accent}30`,
                                  }}
                                >
                                  {product.nichCategory.name}
                                </span>
                              )}
                              {(product.subCategories || []).map((cat) => (
                                <span
                                  key={cat.id}
                                  className="px-2 py-1 rounded-md text-xs font-semibold"
                                  style={{
                                    background: `${theme.info}15`,
                                    color: theme.info,
                                    border: `1px solid ${theme.info}30`,
                                  }}
                                >
                                  {cat.name}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className="font-mono text-sm px-2 py-1 rounded"
                              style={{
                                background: theme.bgSecondary,
                                color: theme.textSecondary,
                              }}
                            >
                              {sku ?? "—"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold" style={{ color: theme.text }}>
                              {price !== undefined && price !== null ? formatCurrency(price) : "—"}
                            </span>
                          </TableCell>
                          <TableCell>
                            {totalStock < 10 ? (
                              <Badge
                                variant="destructive"
                                className="font-semibold"
                                style={{
                                  background: `${theme.error}15`,
                                  color: theme.error,
                                  border: `1px solid ${theme.error}30`,
                                }}
                              >
                                Low: {totalStock}
                              </Badge>
                            ) : (
                              <span style={{ color: theme.textSecondary, fontWeight: '500' }}>
                                {totalStock}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className="capitalize font-semibold"
                              style={{
                                background: product.status === 'published'
                                  ? `${theme.success}15`
                                  : product.status === 'draft'
                                    ? `${theme.warning}15`
                                    : `${theme.textMuted}15`,
                                color: product.status === 'published'
                                  ? theme.success
                                  : product.status === 'draft'
                                    ? theme.warning
                                    : theme.textMuted,
                                border: `1px solid ${product.status === 'published'
                                  ? theme.success
                                  : product.status === 'draft'
                                    ? theme.warning
                                    : theme.textMuted
                                  }30`,
                              }}
                            >
                              {product.status || 'Unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.visit(route("product.edit", { product: product.slug || product.id }))}
                                className="hover:scale-110 transition-transform"
                                style={{
                                  border: `1px solid ${theme.border}`,
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteId(product.id)}
                                className="hover:scale-110 transition-transform"
                                style={{
                                  border: `1px solid ${theme.border}`,
                                  color: theme.error,
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

            </>
          ) : (
            <div className="py-16 text-center flex flex-col items-center gap-6">
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center animate-bounce"
                style={{
                  background: `linear-gradient(135deg, ${theme.bgSecondary} 0%, ${theme.border} 100%)`,
                  boxShadow: theme.shadowMd,
                }}
              >
                <Package size={56} style={{ color: theme.textMuted }} />
              </div>
              <div>
                <h3 
                  className="text-2xl font-bold mb-2"
                  style={{ color: theme.text }}
                >
                  No Products Found
                </h3>
                <p 
                  className="text-base mb-6"
                  style={{ color: theme.textMuted }}
                >
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your filters or search term'
                    : 'Get started by adding your first product'}
                </p>
                <Button
                  onClick={() => router.visit(route("products.create"))}
                  className="hover:scale-105 transition-transform"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accentHover} 100%)`,
                    boxShadow: `0 4px 15px ${theme.accent}40`,
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Product
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {deleteId && (
        <DeleteConfirmationModal
          name={"with id: " + deleteId}
          entityType="product"
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={deleteProduct}
        />
      )}
    </div>
  );
}

ProductsList.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

