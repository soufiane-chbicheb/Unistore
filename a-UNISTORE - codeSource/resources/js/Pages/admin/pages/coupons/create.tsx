'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { usePage, router, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import {
  Ticket, ArrowLeft, Save, Trash2, Calendar, Percent, Banknote, ShoppingCart, Layers, Package, Info, Check, Search, X, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import MultiSelectDropdownForObject, { AllowedObjectsType } from '@/components/ui/MultiSelectDropdownForObject';
import { useForm } from '@inertiajs/react';
import { useAdminThemeCtx } from "@/contextHooks/useAdminThemeCtx";
import { Badge } from '@/components/ui/badge';
import { CustomDateTimePicker } from '@/components/ui/CustomDateTimePicker';
import { addDays, addWeeks, addMonths, format, parseISO } from 'date-fns';

interface Product {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface Coupon {
  id?: number;
  code: string;
  description: string | null;
  type: 'percentage' | 'fixed';
  value: number;
  minimum_order_amount: number | null;
  minimum_items: number | null;
  max_uses: number | null;
  max_uses_per_user: number;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
  applicable_product_ids: number[] | null;
  applicable_category_ids: number[] | null;
  applicable_sub_category_ids: number[] | null;
}

interface Props {
  coupon?: Coupon;
  products: Product[];
  categories: Category[];
  subCategories: Category[];
}

export default function Create() {
  const { state: { currentTheme: theme } } = useAdminThemeCtx();
  const { coupon, products, categories, subCategories } = usePage().props as unknown as Props;
  const isEditing = !!coupon;

  // Initialize Dates
  const initialStartDate = coupon?.valid_from ? parseISO(coupon.valid_from) : new Date();
  const initialEndDate = coupon?.valid_until ? parseISO(coupon.valid_until) : addWeeks(new Date(), 1);

  const { data, setData, post, put, processing, errors } = useForm({
    code: coupon?.code || '',
    description: coupon?.description || '',
    type: coupon?.type || 'percentage',
    value: coupon?.value || 0,
    minimum_order_amount: coupon?.minimum_order_amount || null,
    minimum_items: coupon?.minimum_items || null,
    max_uses: coupon?.max_uses || null,
    max_uses_per_user: coupon?.max_uses_per_user || 1,
    valid_from: format(initialStartDate, "yyyy-MM-dd HH:mm:ss"),
    valid_until: format(initialEndDate, "yyyy-MM-dd HH:mm:ss"),
    is_active: coupon?.is_active ?? true,
    applicable_product_ids: coupon?.applicable_product_ids || [],
    applicable_category_ids: coupon?.applicable_category_ids || [],
    applicable_sub_category_ids: coupon?.applicable_sub_category_ids || [],
  });

  const [startDate, setStartDate] = useState<Date | undefined>(initialStartDate);
  const [startTime, setStartTime] = useState(format(initialStartDate, "HH:mm"));
  const [endDate, setEndDate] = useState<Date | undefined>(initialEndDate);
  const [endTime, setEndTime] = useState(format(initialEndDate, "HH:mm"));
  const [duration, setDuration] = useState<string>("custom");

  // Sync Start Date/Time to form
  useEffect(() => {
    if (startDate) {
      const [hours, minutes] = startTime.split(':');
      const updatedDate = new Date(startDate);
      updatedDate.setHours(parseInt(hours), parseInt(minutes), 0);
      setData('valid_from', format(updatedDate, "yyyy-MM-dd HH:mm:ss"));
    }
  }, [startDate, startTime]);

  // Sync End Date/Time to form
  useEffect(() => {
    if (endDate) {
      const [hours, minutes] = endTime.split(':');
      const updatedDate = new Date(endDate);
      updatedDate.setHours(parseInt(hours), parseInt(minutes), 0);
      setData('valid_until', format(updatedDate, "yyyy-MM-dd HH:mm:ss"));
    }
  }, [endDate, endTime]);

  // Duration Logic
  const handleDurationChange = (val: string) => {
    setDuration(val);
    if (!startDate || val === "custom") return;

    let newEndDate = new Date(startDate);
    switch (val) {
      case "1w": newEndDate = addWeeks(startDate, 1); break;
      case "2w": newEndDate = addWeeks(startDate, 2); break;
      case "3w": newEndDate = addWeeks(startDate, 3); break;
      case "1m": newEndDate = addMonths(startDate, 1); break;
      case "3m": newEndDate = addMonths(startDate, 3); break;
    }
    setEndDate(newEndDate);
  };

  const categoryOptions: AllowedObjectsType[] = categories.map(c => ({ value: c.id, label: c.name }));
  const subCategoryOptions: AllowedObjectsType[] = subCategories.map(c => ({ value: c.id, label: c.name }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      put(route('coupons.update', coupon.id));
    } else {
      post(route('coupons.store'));
    }
  };

  const selectedProducts = products.filter(p => data.applicable_product_ids?.includes(p.id));

  const toggleProduct = (productId: number) => {
    const current = data.applicable_product_ids || [];
    if (current.includes(productId)) {
      setData('applicable_product_ids', current.filter(id => id !== productId));
    } else {
      setData('applicable_product_ids', [...current, productId]);
    }
  };

  return (
    <div 
      className="min-h-screen p-6 space-y-6"
      style={{ background: theme.bg }}
    >
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              type="button"
              onClick={() => router.visit(route('coupons.index'))}
              style={{ border: `1px solid ${theme.border}`, background: theme.card }}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight" style={{ color: theme.text }}>
                {isEditing ? `Edit Coupon: ${coupon.code}` : 'Create New Coupon'}
              </h1>
              <p className="text-sm" style={{ color: theme.textMuted }}>
                {isEditing ? 'Update your coupon configuration' : 'Set up a new promotional code for your customers'}
              </p>
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={processing} 
            className="px-8 shadow-lg hover:scale-105 transition-all"
            style={{
              background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accentHover} 100%)`,
              boxShadow: `0 4px 15px ${theme.accent}40`,
            }}
          >
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Update Coupon' : 'Save Coupon'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <Card style={{ background: theme.card, border: `1px solid ${theme.border}`, boxShadow: theme.shadowMd }}>
              <CardHeader className="border-b" style={{ borderColor: theme.border }}>
                <CardTitle className="flex items-center gap-2" style={{ color: theme.text }}>
                  <Info className="h-5 w-5" style={{ color: theme.primary }} />
                  Basic Information
                </CardTitle>
                <CardDescription style={{ color: theme.textMuted }}>Core details of the coupon</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="code" style={{ color: theme.text }}>Coupon Code</Label>
                    <Input
                      id="code"
                      placeholder="e.g. SUMMER2024"
                      className="uppercase font-mono font-bold transition-all focus:ring-2"
                      style={{ 
                        background: theme.bg, 
                        border: `2px solid ${theme.border}`,
                        color: theme.text
                      }}
                      value={data.code}
                      onChange={e => setData('code', e.target.value.toUpperCase())}
                    />
                    {errors.code && <p className="text-xs font-medium" style={{ color: theme.error }}>{errors.code}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="is_active" style={{ color: theme.text }}>Status</Label>
                    <div 
                      className="flex items-center gap-3 h-11 px-4 rounded-md border"
                      style={{ background: theme.bg, borderColor: theme.border }}
                    >
                      <Switch
                        id="is_active"
                        checked={data.is_active}
                        onCheckedChange={checked => setData('is_active', checked)}
                      />
                      <span className="text-sm font-medium" style={{ color: theme.text }}>
                        {data.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" style={{ color: theme.text }}>Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this coupon offers..."
                    rows={3}
                    className="transition-all focus:ring-2"
                    style={{ 
                      background: theme.bg, 
                      border: `2px solid ${theme.border}`,
                      color: theme.text
                    }}
                    value={data.description}
                    onChange={e => setData('description', e.target.value)}
                  />
                  {errors.description && <p className="text-xs font-medium" style={{ color: theme.error }}>{errors.description}</p>}
                </div>
              </CardContent>
            </Card>

            <Card style={{ background: theme.card, border: `1px solid ${theme.border}`, boxShadow: theme.shadowMd }}>
              <CardHeader className="border-b" style={{ borderColor: theme.border }}>
                <CardTitle className="flex items-center gap-2" style={{ color: theme.text }}>
                  <Percent className="h-5 w-5" style={{ color: theme.primary }} />
                  Discount Configuration
                </CardTitle>
                <CardDescription style={{ color: theme.textMuted }}>Define how much discount is applied</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label style={{ color: theme.text }}>Discount Type</Label>
                    <Select value={data.type} onValueChange={val => setData('type', val as 'percentage' | 'fixed')}>
                      <SelectTrigger style={{ background: theme.bg, border: `2px solid ${theme.border}`, color: theme.text }}>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
                        <SelectItem value="percentage">
                          <div className="flex items-center gap-2">
                            <Percent className="h-4 w-4" style={{ color: theme.primary }} />
                            <span>Percentage (%)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="fixed">
                          <div className="flex items-center gap-2">
                            <Banknote className="h-4 w-4" style={{ color: theme.primary }} />
                            <span>Fixed Amount (MAD)</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="value" style={{ color: theme.text }}>Discount Value</Label>
                    <div className="relative">
                      <Input
                        id="value"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pr-16 transition-all focus:ring-2"
                        style={{ 
                          background: theme.bg, 
                          border: `2px solid ${theme.border}`,
                          color: theme.text
                        }}
                        value={data.value}
                        onChange={e => setData('value', parseFloat(e.target.value))}
                      />
                      <span 
                        className="absolute right-3 top-1/2 -translate-y-1/2 font-bold px-2 py-1 rounded"
                        style={{ background: theme.bgSecondary, color: theme.primary, fontSize: '0.75rem' }}
                      >
                        {data.type === 'percentage' ? '%' : 'MAD'}
                      </span>
                    </div>
                    {errors.value && <p className="text-xs font-medium" style={{ color: theme.error }}>{errors.value}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card style={{ background: theme.card, border: `1px solid ${theme.border}`, boxShadow: theme.shadowMd }}>
              <CardHeader className="border-b" style={{ borderColor: theme.border }}>
                <CardTitle className="flex items-center gap-2" style={{ color: theme.text }}>
                  <Layers className="h-5 w-5" style={{ color: theme.primary }} />
                  Categories Applicability
                </CardTitle>
                <CardDescription style={{ color: theme.textMuted }}>Restrict coupon to specific categories</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label style={{ color: theme.text }}>Restrict to Categories</Label>
                    <MultiSelectDropdownForObject
                      label="Categories"
                      options={categoryOptions}
                      selectedValues={categoryOptions.filter(o => data.applicable_category_ids?.includes(o.value as number))}
                      onChange={selected => setData('applicable_category_ids', selected.map(s => s.value as number))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label style={{ color: theme.text }}>Restrict to Sub-categories</Label>
                    <MultiSelectDropdownForObject
                      label="Sub-categories"
                      options={subCategoryOptions}
                      selectedValues={subCategoryOptions.filter(o => data.applicable_sub_category_ids?.includes(o.value as number))}
                      onChange={selected => setData('applicable_sub_category_ids', selected.map(s => s.value as number))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info & Product Assignment */}
          <div className="space-y-8">
            <Card style={{ background: theme.card, border: `1px solid ${theme.border}`, boxShadow: theme.shadowMd }}>
              <CardHeader className="border-b" style={{ borderColor: theme.border }}>
                <CardTitle className="flex items-center gap-2 text-base" style={{ color: theme.text }}>
                  <Calendar className="h-4 w-4" style={{ color: theme.primary }} />
                  Validity Period
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <CustomDateTimePicker 
                  label="Starts At"
                  date={startDate}
                  setDate={setStartDate}
                  time={startTime}
                  setTime={setStartTime}
                />
                
                <div className="space-y-4 pt-2 border-t" style={{ borderColor: theme.border }}>
                  <Label style={{ color: theme.text }}>End Date Duration</Label>
                  <Select value={duration} onValueChange={handleDurationChange}>
                    <SelectTrigger style={{ background: theme.bg, border: `2px solid ${theme.border}`, color: theme.text }}>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
                      <SelectItem value="1w">1 Week</SelectItem>
                      <SelectItem value="2w">2 Weeks</SelectItem>
                      <SelectItem value="3w">3 Weeks</SelectItem>
                      <SelectItem value="1m">1 Month</SelectItem>
                      <SelectItem value="3m">3 Months</SelectItem>
                      <SelectItem value="custom">Custom Date</SelectItem>
                    </SelectContent>
                  </Select>

                  <CustomDateTimePicker 
                    label="Ends At"
                    disabled={duration !== "custom"}
                    date={endDate}
                    setDate={setEndDate}
                    time={endTime}
                    setTime={setEndTime}
                  />
                </div>
                {errors.valid_until && <p className="text-xs font-medium" style={{ color: theme.error }}>{errors.valid_until}</p>}
              </CardContent>
            </Card>

            <Card style={{ background: theme.card, border: `1px solid ${theme.border}`, boxShadow: theme.shadowMd }}>
              <CardHeader className="border-b" style={{ borderColor: theme.border }}>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="flex items-center gap-2" style={{ color: theme.text }}>
                    <Package className="h-5 w-5" style={{ color: theme.primary }} />
                    Products
                  </CardTitle>
                  <div className="w-48">
                    <MultiSelectDropdownForObject 
                      multiple={true}
                      label="Assign Products"
                      options={products.map(p => ({ label: p.name, value: p.id }))}
                      selectedValues={[]}
                      onChange={(selected: AllowedObjectsType[]) => {
                        const newIds = selected.map(s => s.value as number);
                        const current = data.applicable_product_ids || [];
                        const uniqueIds = Array.from(new Set([...current, ...newIds]));
                        setData('applicable_product_ids', uniqueIds);
                      }}
                    />
                  </div>
                </div>
                <CardDescription style={{ color: theme.textMuted }}>Assign specific products to this coupon</CardDescription>
              </CardHeader>
              <CardContent className="p-4 max-h-[400px] overflow-auto">
                <div className="space-y-2">
                  {selectedProducts.length > 0 ? (
                    selectedProducts.map(product => (
                      <div 
                        key={product.id}
                        className="flex items-center justify-between p-2 rounded-md transition-all group"
                        style={{ background: theme.bg, border: `1px solid ${theme.border}` }}
                      >
                        <span className="text-sm font-medium" style={{ color: theme.text }}>{product.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => toggleProduct(product.id)}
                          style={{ color: theme.error }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg" style={{ borderColor: theme.border }}>
                      <Package className="mx-auto h-8 w-8 mb-2" style={{ color: theme.textMuted }} />
                      <p className="text-xs" style={{ color: theme.textMuted }}>No products assigned. Coupon will apply to all products if no category restriction exists.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card style={{ background: theme.card, border: `1px solid ${theme.border}`, boxShadow: theme.shadowMd }}>
              <CardHeader className="border-b" style={{ borderColor: theme.border }}>
                <CardTitle className="flex items-center gap-2 text-base" style={{ color: theme.text }}>
                  <ShoppingCart className="h-4 w-4" style={{ color: theme.primary }} />
                  Usage Limits
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="minimum_order_amount" style={{ color: theme.text }}>Min. Order Amount (MAD)</Label>
                  <Input
                    id="minimum_order_amount"
                    type="number"
                    step="0.01"
                    placeholder="No minimum"
                    style={{ background: theme.bg, border: `2px solid ${theme.border}`, color: theme.text }}
                    value={data.minimum_order_amount || ''}
                    onChange={e => setData('minimum_order_amount', e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimum_items" style={{ color: theme.text }}>Min. Items Quantity</Label>
                  <Input
                    id="minimum_items"
                    type="number"
                    placeholder="No minimum"
                    style={{ background: theme.bg, border: `2px solid ${theme.border}`, color: theme.text }}
                    value={data.minimum_items || ''}
                    onChange={e => setData('minimum_items', e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_uses" style={{ color: theme.text }}>Total Usage Limit</Label>
                  <Input
                    id="max_uses"
                    type="number"
                    placeholder="Unlimited"
                    style={{ background: theme.bg, border: `2px solid ${theme.border}`, color: theme.text }}
                    value={data.max_uses || ''}
                    onChange={e => setData('max_uses', e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_uses_per_user" style={{ color: theme.text }}>Limit Per User</Label>
                  <Input
                    id="max_uses_per_user"
                    type="number"
                    style={{ background: theme.bg, border: `2px solid ${theme.border}`, color: theme.text }}
                    value={data.max_uses_per_user}
                    onChange={e => setData('max_uses_per_user', parseInt(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

Create.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

