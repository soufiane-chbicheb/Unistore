'use client';

import { useState } from 'react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { usePage, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import {
  Plus, Pencil, Trash2, Ticket, Search, Filter, Hash, Tag, Calendar, CheckCircle, XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { SectionHeader } from "@/admin/components/layout/SectionHeader";
import { useAdminThemeCtx } from "@/contextHooks/useAdminThemeCtx";
import MultiSelectDropdownForObject, { AllowedObjectsType } from "@/components/ui/MultiSelectDropdownForObject";

interface Coupon {
  id: number;
  code: string;
  description: string | null;
  type: 'percentage' | 'fixed';
  value: string;
  minimum_order_amount: string | null;
  minimum_items: number | null;
  max_uses: number | null;
  max_uses_per_user: number;
  times_used: number;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
}

interface Props {
  coupons: Coupon[];
}

export default function Index() {
  const { state: { currentTheme: theme } } = useAdminThemeCtx();
  const { coupons } = usePage().props as unknown as Props;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteName, setDeleteName] = useState<string>('');

  const filteredCoupons = (coupons || []).filter(c => {
    const matchesSearch = c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? c.is_active : !c.is_active);
    return matchesSearch && matchesStatus;
  });

  const handleDelete = () => {
    if (deleteId) {
      router.delete(route('coupons.destroy', deleteId), {
        onSuccess: () => setDeleteId(null),
      });
    }
  };

  const fmtDiscount = (type: string, value: string) => {
    if (type === 'percentage') return `${value}% off`;
    if (type === 'fixed') return `${value} MAD off`;
    return value;
  };

  const fmtDate = (d: string | null) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
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
        <SectionHeader title="Coupons" description="Manage promotional codes and discounts for your store" Icon={Ticket}>
          <Button 
            onClick={() => router.visit(route('coupons.create'))}
            className="hover:scale-105 transition-transform"
            style={{
              background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accentHover} 100%)`,
              boxShadow: `0 4px 15px ${theme.accent}40`,
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Coupon
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
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="transition-all focus:scale-[1.02] pl-9"
                style={{
                  border: `2px solid ${theme.border}`,
                }}
              />
            </div>
           
            <MultiSelectDropdownForObject 
              multiple={false}
              label="Filter by Status"
              selectedValues={[{value: statusFilter , label : statusFilter === "all" ? "All Status" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1) }]}
              onChange={(selected : AllowedObjectsType[]) => setStatusFilter(String(selected[0].value))} 
              options={[
                {label : "All Status" , value : "all" } ,
                {label : "Active" , value : "active" } ,
                {label : "Inactive" , value : "inactive"}
              ]}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredCoupons.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow style={{ background: theme.bgSecondary, borderBottom: `2px solid ${theme.border}` }}>
                    <TableHead style={{ color: theme.textSecondary, fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Code</TableHead>
                    <TableHead style={{ color: theme.textSecondary, fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Discount</TableHead>
                    <TableHead style={{ color: theme.textSecondary, fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Usage</TableHead>
                    <TableHead style={{ color: theme.textSecondary, fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Validity</TableHead>
                    <TableHead style={{ color: theme.textSecondary, fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Status</TableHead>
                    <TableHead className="text-right" style={{ color: theme.textSecondary, fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCoupons.map((coupon) => (
                    <TableRow 
                      key={coupon.id}
                      className="hover:bg-opacity-50 transition-colors"
                      style={{ 
                        borderBottom: `1px solid ${theme.border}`,
                        background: theme.bg,
                      }}
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-mono font-bold" style={{ color: theme.primary }}>{coupon.code}</span>
                          <span className="text-xs truncate max-w-[200px]" style={{ color: theme.textMuted }}>
                            {coupon.description || 'No description'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-medium" style={{ border: `1px solid ${theme.border}`, color: theme.text }}>
                          {fmtDiscount(coupon.type, coupon.value)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm" style={{ color: theme.textSecondary }}>
                          <span>{coupon.times_used} uses</span>
                          {coupon.max_uses && (
                            <span className="text-xs" style={{ color: theme.textMuted }}>Max: {coupon.max_uses}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-xs" style={{ color: theme.textMuted }}>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{fmtDate(coupon.valid_from)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{fmtDate(coupon.valid_until)}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className="capitalize font-semibold"
                          style={{
                            background: coupon.is_active ? `${theme.success}15` : `${theme.textMuted}15`,
                            color: coupon.is_active ? theme.success : theme.textMuted,
                            border: `1px solid ${coupon.is_active ? theme.success : theme.textMuted}30`,
                          }}
                        >
                          {coupon.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.visit(route('coupons.edit', coupon.id))}
                            className="hover:scale-110 transition-transform"
                            style={{ border: `1px solid ${theme.border}` }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDeleteId(coupon.id);
                              setDeleteName(coupon.code);
                            }}
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
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-16 text-center flex flex-col items-center gap-6">
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center animate-bounce"
                style={{
                  background: `linear-gradient(135deg, ${theme.bgSecondary} 0%, ${theme.bg} 100%)`,
                  boxShadow: theme.shadowMd,
                  border: `2px solid ${theme.border}`
                }}
              >
                <Ticket size={56} style={{ color: theme.textMuted }} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: theme.text }}>No Coupons Found</h3>
                <p className="text-base mb-6" style={{ color: theme.textMuted }}>
                  {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Start by creating your first coupon'}
                </p>
                <Button
                  onClick={() => router.visit(route('coupons.create'))}
                  className="hover:scale-105 transition-transform"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accentHover} 100%)`,
                    boxShadow: `0 4px 15px ${theme.accent}40`,
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Coupon
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        name={deleteName}
        entityType="item"
      />
    </div>
  );
}

Index.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

