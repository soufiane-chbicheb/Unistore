import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, ShoppingBag, Star, Calendar, FileText, Bell, StickyNote, AlertTriangle, Package, Heart, CreditCard, Edit2, Shield, Trash2, Plus } from 'lucide-react';
import EmptyListSection from '@/admin/components/partials/EmptyListSection';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { useToast } from '@/contextHooks/useToasts';
import { useAdminThemeCtx } from '@/contextHooks/useAdminThemeCtx';
import { router } from '@inertiajs/react';
import { Button } from "@/components/ui/Button";

interface Role {
  id: number;
  name: string;
}

interface CustomerData {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  memberSince: string;
  totalOrders: number;
  totalSpent: number;
  recentOrders: any[] | null;
  avatarUrl?: string | null;
  primaryInterest?: string | null;
  allInterests?: string[] | null;
  importantNotes?: string[] | null;
  roles?: Role[];
}

export default function CustomerDetails({ customer: backendCustomer, allRoles }: { customer?: CustomerData, allRoles: Role[] }) {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const { addToast } = useToast();
  const { state: { currentTheme: theme } } = useAdminThemeCtx();
  
  // Default fallback if no data passed (though middleware/controller should handle this)
  const customer: CustomerData = backendCustomer || {
    id: 0,
    name: 'Unknown Customer',
    email: 'N/A',
    phone: 'N/A',
    address: 'N/A',
    status: 'Inactive',
    memberSince: 'N/A',
    totalOrders: 0,
    totalSpent: 0,
    recentOrders: null,
    roles: []
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Heart },
    { id: 'roles', label: 'Roles', icon: Shield },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'preferences', label: 'Preferences', icon: Star },
    { id: 'notes', label: 'Notes', icon: StickyNote }
  ];

  const handleBack = () => {
    window.location.href = '/admin/customers';
  };

  const handleAssignRole = (roleId: string) => {
    if (!roleId) return;
    router.post(route('admin.users.assignRole', { user: customer.id }), { role_id: roleId }, {
      onSuccess: () => addToast({ type: 'success', title: 'Assigned', description: 'Role assigned successfully' })
    });
  };

  const handleRemoveRole = (roleId: number) => {
    router.delete(route('admin.users.removeRole', { user: customer.id }), { 
      data: { role_id: roleId },
      onSuccess: () => addToast({ type: 'success', title: 'Removed', description: 'Role removed successfully' })
    });
  };

  return (
    <div 
      className="min-h-screen p-6 transition-colors duration-300"
      style={{ background: theme.bg }}
    >
      {/* Back Button */}
      <button 
        onClick={handleBack}
        className="flex items-center gap-2 mb-6 transition-colors"
        style={{ color: theme.textSecondary }}
      >
        <span className="text-xl">←</span>
        <span className="font-medium">Back to Customers</span>
      </button>

      {/* Customer Header Card */}
      <div 
        className="rounded-lg shadow-sm p-6 mb-6"
        style={{ 
          background: theme.bgSecondary,
          border: `1px solid ${theme.border}`,
          borderRadius: theme.borderRadius
        }}
      >
        {/* ... (existing header content) ... */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex gap-6">
            {/* Avatar */}
            <div 
              className="w-32 h-32 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${theme.bg}, ${theme.border})`, border: `2px solid ${theme.border}` }}
            >
              {customer.avatarUrl ? (
                <img src={customer.avatarUrl} alt={customer.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16" style={{ color: theme.textSecondary }} />
              )}
            </div>

            {/* Customer Info */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-bold" style={{ color: theme.text }}>{customer.name}</h1>
                  <button 
                    className="transition-colors"
                    style={{ color: theme.textMuted }}
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                </div>
                <p style={{ color: theme.textSecondary }}>
                  {customer.status} • Member since {customer.memberSince}
                </p>
              </div>

              <div className="flex items-center gap-2" style={{ color: theme.textSecondary }}>
                <Mail className="w-4 h-4" style={{ color: theme.textMuted }} />
                <span>{customer.email}</span>
                <button 
                  className="transition-colors ml-1"
                  style={{ color: theme.textMuted }}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2" style={{ color: theme.textSecondary }}>
                <MapPin className="w-4 h-4" style={{ color: theme.textMuted }} />
                <span>{customer.address}</span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <span 
            className="px-4 py-2 rounded-md text-sm font-semibold"
            style={{
              background: customer.status === 'Active' ? theme.success : theme.textMuted,
              color: theme.textInverse
            }}
          >
            {customer.status}
          </span>
        </div>

        {/* Contact Row */}
        <div 
          className="flex items-center justify-between pt-4 border-t"
          style={{ borderColor: theme.border }}
        >
          <div className="flex items-center gap-2" style={{ color: theme.textSecondary }}>
            <Phone className="w-4 h-4" style={{ color: theme.textMuted }} />
            <span>{customer.phone}</span>
          </div>
          <div className="flex items-center gap-2" style={{ color: theme.textSecondary }}>
            <User className="w-4 h-4" style={{ color: theme.textMuted }} />
            <span>Orders: {customer.totalOrders} • Spent: {customer.totalSpent} MAD</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div 
        className="rounded-lg shadow-sm mb-6 overflow-x-auto"
        style={{ background: theme.bgSecondary, border: `1px solid ${theme.border}` }}
      >
        <div 
          className="flex border-b min-w-max"
          style={{ borderColor: theme.border }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
                  isActive
                    ? ''
                    : 'hover:bg-opacity-50'
                }`}
                style={{
                  color: isActive ? theme.primary : theme.textSecondary,
                  background: isActive ? `${theme.primary}10` : 'transparent',
                }}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {isActive && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ background: theme.primary }}
                  ></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Interests and Notes (same as before) */}
            <div 
              className="rounded-lg shadow-sm p-6"
              style={{ background: theme.bgSecondary, border: `1px solid ${theme.border}` }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Heart className="w-5 h-5" style={{ color: theme.textSecondary }} />
                <h2 className="text-xl font-bold" style={{ color: theme.text }}>Customer Interests</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2" style={{ color: theme.textSecondary }}>Primary Interest</h3>
                  {customer.primaryInterest ? (
                    <span 
                      className="inline-block px-4 py-2 rounded-md font-medium"
                      style={{ background: theme.primary, color: theme.textInverse }}
                    >{customer.primaryInterest}</span>
                  ) : (
                    <div className="italic py-2" style={{ color: theme.textMuted }}>No primary interest set</div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2" style={{ color: theme.textSecondary }}>All Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {customer.allInterests?.map((interest, i) => (
                      <span 
                        key={i} 
                        className="border px-3 py-1.5 rounded-md text-sm font-medium"
                        style={{ background: theme.bg, color: theme.text, borderColor: theme.border }}
                      >{interest}</span>
                    )) || <div className="italic py-2" style={{ color: theme.textMuted }}>No interests recorded</div>}
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="rounded-lg shadow-sm p-6"
              style={{ background: theme.bgSecondary, border: `1px solid ${theme.border}` }}
            >
              <div className="flex items-center gap-2 mb-6">
                <AlertTriangle className="w-5 h-5" style={{ color: theme.error }} />
                <h2 className="text-xl font-bold" style={{ color: theme.text }}>Important Notes</h2>
              </div>
              {customer.importantNotes && customer.importantNotes.length > 0 ? (
                <div className="space-y-3">
                  {customer.importantNotes.map((note, i) => (
                    <div 
                      key={i} 
                      className="border rounded-md p-4 flex items-start gap-3"
                      style={{ background: `${theme.error}10`, borderColor: `${theme.error}30` }}
                    >
                      <AlertTriangle className="w-5 h-5 mt-0.5" style={{ color: theme.error }} />
                      <span className="font-medium" style={{ color: theme.error }}>{note}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div 
                  className="border rounded-md p-4 text-center italic"
                  style={{ background: theme.bg, borderColor: theme.border, color: theme.textMuted }}
                >No important notes</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'roles' && (
          <div 
            className="rounded-lg shadow-sm p-6"
            style={{ background: theme.bgSecondary, border: `1px solid ${theme.border}` }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6" style={{ color: theme.text }} />
                <h2 className="text-xl font-bold" style={{ color: theme.text }}>Assigned Roles</h2>
              </div>
              <div className="flex gap-2">
                <select 
                  className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
                  style={{ 
                    background: theme.bg, 
                    color: theme.text, 
                    borderColor: theme.border,
                    boxShadow: `0 0 0 2px ${theme.primary}20` 
                  }}
                  onChange={(e) => handleAssignRole(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>Add a role...</option>
                  {allRoles.filter(r => !customer.roles?.some(ur => ur.id === r.id)).map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {customer.roles && customer.roles.length > 0 ? (
                customer.roles.map((role) => (
                  <div 
                    key={role.id} 
                    className="flex items-center justify-between p-4 rounded-xl border transition-all group"
                    style={{ background: theme.bg, borderColor: theme.border }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ background: `${theme.success}20` }}
                      >
                        <Shield className="w-4 h-4" style={{ color: theme.success }} />
                      </div>
                      <span className="font-semibold" style={{ color: theme.text }}>{role.name}</span>
                    </div>
                    <button 
                      onClick={() => handleRemoveRole(role.id)}
                      className="p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      style={{ color: theme.textMuted }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <div 
                  className="col-span-full py-8 text-center rounded-xl border border-dashed italic"
                  style={{ background: theme.bg, borderColor: theme.border, color: theme.textMuted }}
                >
                  This user has no assigned roles.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ... (Orders tab would go here if implemented) ... */}
      </div>
    </div>
  );
}



CustomerDetails.layout = (page : any) => <AdminLayout children={page}/> 

