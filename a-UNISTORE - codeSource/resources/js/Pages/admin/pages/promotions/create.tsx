'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { usePage, router, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import {
  Megaphone, ArrowLeft, Save, Trash2, Calendar, Percent, Banknote, ShoppingCart, Layers, Package, Info, Check, Truck, TrendingUp, Search, X, Clock
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
import { useTheme } from "@/contextHooks/useTheme";
import { Badge } from '@/components/ui/badge';
import { CustomDateTimePicker } from '@/components/ui/CustomDateTimePicker';
import { addWeeks, addMonths, format, parseISO } from 'date-fns';

interface Promotion {
  id?: number;
  name: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minimum_order_amount: number | null;
  minimum_items: number | null;
  max_uses: number | null;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
  max_discount_amount: number | null;
}

interface Props {
  promotion?: Promotion;
}

export default function Create() {
  const { theme } = useTheme();
  const { promotion } = usePage().props as unknown as Props;
  const isEditing = !!promotion;

  // Initialize Dates
  const initialStartDate = promotion?.valid_from ? parseISO(promotion.valid_from) : new Date();
  const initialEndDate = promotion?.valid_until ? parseISO(promotion.valid_until) : addWeeks(new Date(), 1);

  const { data, setData, post, put, processing, errors } = useForm({
    name: promotion?.name || '',
    type: promotion?.type || 'percentage',
    value: promotion?.value || 0,
    minimum_order_amount: promotion?.minimum_order_amount || null,
    minimum_items: promotion?.minimum_items || null,
    max_uses: promotion?.max_uses || null,
    valid_from: format(initialStartDate, "yyyy-MM-dd HH:mm:ss"),
    valid_until: format(initialEndDate, "yyyy-MM-dd HH:mm:ss"),
    is_active: promotion?.is_active ?? true,
    max_discount_amount: promotion?.max_discount_amount || null,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      put(route('promotions.update', promotion.id));
    } else {
      post(route('promotions.store'));
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
              onClick={() => router.visit(route('promotions.index'))}
              style={{ border: `1px solid ${theme.border}`, background: theme.card }}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight" style={{ color: theme.text }}>
                {isEditing ? `Edit Promotion: ${promotion.name}` : 'Create New Promotion'}
              </h1>
              <p className="text-sm" style={{ color: theme.textMuted }}>
                {isEditing ? 'Update your promotion configuration' : 'Set up a new automatic promotion for your store'}
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
            {isEditing ? 'Update Promotion' : 'Save Promotion'}
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
                <CardDescription style={{ color: theme.textMuted }}>Core details of the promotion</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" style={{ color: theme.text }}>Promotion Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Summer Sale 2024"
                      className="transition-all focus:ring-2"
                      style={{ 
                        background: theme.bg, 
                        border: `2px solid ${theme.border}`,
                        color: theme.text
                      }}
                      value={data.name}
                      onChange={e => setData('name', e.target.value)}
                    />
                    {errors.name && <p className="text-xs font-medium" style={{ color: theme.error }}>{errors.name}</p>}
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
              </CardContent>
            </Card>

            <Card style={{ background: theme.card, border: `1px solid ${theme.border}`, boxShadow: theme.shadowMd }}>
              <CardHeader className="border-b" style={{ borderColor: theme.border }}>
                <CardTitle className="flex items-center gap-2" style={{ color: theme.text }}>
                  <Percent className="h-5 w-5" style={{ color: theme.primary }} />
                  Discount Configuration
                </CardTitle>
                <CardDescription style={{ color: theme.textMuted }}>Define how the promotion discount is calculated</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label style={{ color: theme.text }}>Promotion Type</Label>
                    <Select value={data.type} onValueChange={val => setData('type', val as 'percentage' | 'fixed' | 'free_shipping')}>
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
                        <SelectItem value="free_shipping">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4" style={{ color: theme.primary }} />
                            <span>Free Shipping</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {data.type !== 'free_shipping' && (
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
                  )}

                  {data.type === 'percentage' && (
                    <div className="space-y-2">
                      <Label htmlFor="max_discount_amount" style={{ color: theme.text }}>Maximum Discount Amount (Optional)</Label>
                      <div className="relative">
                        <Input
                          id="max_discount_amount"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="pr-16 transition-all focus:ring-2"
                          style={{ 
                            background: theme.bg, 
                            border: `2px solid ${theme.border}`,
                            color: theme.text
                          }}
                          value={data.max_discount_amount || ''}
                          onChange={e => setData('max_discount_amount', e.target.value ? parseFloat(e.target.value) : null)}
                        />
                        <span 
                          className="absolute right-3 top-1/2 -translate-y-1/2 font-bold px-2 py-1 rounded"
                          style={{ background: theme.bgSecondary, color: theme.primary, fontSize: '0.75rem' }}
                        >
                          MAD
                        </span>
                      </div>
                      {errors.max_discount_amount && <p className="text-xs font-medium" style={{ color: theme.error }}>{errors.max_discount_amount}</p>}
                      <p className="text-xs" style={{ color: theme.textMuted }}>Limit the maximum discount value for percentage-based promotions.</p>
                    </div>
                  )}
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
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

Create.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

