import React, { useState } from 'react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { 
  Shield, Plus, Trash2, Edit2, Users, 
  Search, Filter, MoreVertical, X, Check,
  AlertCircle, AlertTriangle, Save
} from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Button } from "@/components/ui/Button";
import { useToast } from '@/contextHooks/useToasts';
import { useTheme } from '@/contextHooks/useTheme';

interface Role {
  id: number;
  name: string;
  claims?: string[];
  users_count: number;
  created_at: string;
}

interface Claim {
  value: string;
  label: string;
}

export default function RoleManager({ roles, availableClaims }: { roles: Role[], availableClaims: Claim[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleName, setRoleName] = useState('');
  const [selectedClaims, setSelectedClaims] = useState<string[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const { addToast } = useToast();
  const { theme } = useTheme();

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (role: Role | null = null) => {
    setEditingRole(role);
    setRoleName(role ? role.name : '');
    setSelectedClaims(role?.claims || []);
    setInviteEmail('');
    setIsModalOpen(true);
  };

  const handleOpenInviteModal = (role: Role) => {
    setEditingRole(role);
    setInviteEmail('');
    setIsInviteModalOpen(true);
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = { 
      name: roleName, 
      claims: selectedClaims,
      email: inviteEmail // Only for new roles
    };

    if (editingRole) {
      router.put(route('admin.roles.update', { role: editingRole.id }), data, {
        onSuccess: () => {
          setIsModalOpen(false);
          addToast({ type: 'success', title: 'Success', description: 'Role updated successfully' });
        }
      });
    } else {
      router.post(route('admin.roles.store'), data, {
        onSuccess: () => {
          setIsModalOpen(false);
          addToast({ type: 'success', title: 'Success', description: 'Role created successfully' });
        }
      });
    }
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRole) return;

    router.post(route('admin.roles.invite'), { 
      email: inviteEmail, 
      role_id: editingRole.id 
    }, {
      onSuccess: () => {
        setIsInviteModalOpen(false);
        addToast({ type: 'success', title: 'Success', description: `Invitation sent to ${inviteEmail}` });
      }
    });
  };

  const toggleClaim = (claimValue: string) => {
    setSelectedClaims(prev => 
      prev.includes(claimValue) 
        ? prev.filter(c => c !== claimValue) 
        : [...prev, claimValue]
    );
  };

  const handleDeleteRole = (id: number) => {
    if (confirm('Are you sure you want to delete this role? This might affect user permissions.')) {
      router.delete(route('admin.roles.destroy', { role: id }), {
        onSuccess: () => {
          addToast({ type: 'success', title: 'Deleted', description: 'Role removed successfully' });
        }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6" style={{ background: theme.bg, minHeight: '100vh' }}>
        {/* Header */}
        <div 
          className="flex justify-between items-center p-6 rounded-xl shadow-sm border"
          style={{ 
            background: theme.bgSecondary,
            borderColor: theme.border,
            boxShadow: theme.shadow
          }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl" style={{ background: `${theme.primary}10` }}>
              <Shield className="w-8 h-8" style={{ color: theme.primary }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: theme.text }}>Role Management</h1>
              <p style={{ color: theme.textSecondary }}>Define and manage user roles across your platform</p>
            </div>
          </div>
          <Button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 transition-colors"
            style={{ 
              background: theme.primary,
              color: theme.textInverse,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = theme.primaryHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = theme.primary)}
          >
            <Plus size={18} /> Add New Role
          </Button>
        </div>

        {/* Filters/Search */}
        <div 
          className="p-4 rounded-xl shadow-sm border flex gap-4"
          style={{ 
            background: theme.bgSecondary,
            borderColor: theme.border,
            boxShadow: theme.shadow
          }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: theme.textMuted }} />
            <input 
              type="text"
              placeholder="Search roles..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              style={{ 
                background: theme.bg,
                borderColor: theme.border,
                color: theme.text,
                '--tw-ring-color': `${theme.primary}33`
              } as any}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoles.map((role) => (
            <div 
              key={role.id}
              className="rounded-xl border p-6 shadow-sm transition-all group"
              style={{ 
                background: theme.bgSecondary,
                borderColor: theme.border,
                boxShadow: theme.shadow
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = theme.shadowMd)}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = theme.shadow)}
            >
              <div className="flex justify-between items-start mb-4">
                <div 
                  className="p-2 rounded-lg transition-colors"
                  style={{ background: theme.bg }}
                >
                  <Shield className="w-6 h-6" style={{ color: theme.textMuted }} />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleOpenModal(role)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: theme.textSecondary }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = theme.bg)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteRole(role.id)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: theme.error }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = `${theme.error}10`)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold mb-1" style={{ color: theme.text }}>{role.name}</h3>
              <div className="flex items-center gap-2 text-sm mb-2" style={{ color: theme.textSecondary }}>
                <Users size={14} />
                <span>{role.users_count} Users assigned</span>
              </div>

              {/* Claims Preview */}
              <div className="flex flex-wrap gap-1 mb-4">
                {role.claims?.map(claim => (
                  <span 
                    key={claim}
                    className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                    style={{ background: `${theme.primary}15`, color: theme.primary }}
                  >
                    {claim.replace(/-/g, ' ')}
                  </span>
                )) || <span className="text-[10px] text-slate-400 italic">No claims assigned</span>}
              </div>

              <div className="pt-4 border-t flex justify-between items-center" style={{ borderColor: theme.border }}>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: theme.textMuted }}>
                    Created {new Date(role.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    style={{ color: theme.primary }}
                    onClick={() => handleOpenInviteModal(role)}
                    onMouseEnter={(e) => (e.currentTarget.style.background = `${theme.primary}10`)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    Invite User
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {filteredRoles.length === 0 && (
            <div 
              className="col-span-full py-12 text-center rounded-xl border border-dashed"
              style={{ 
                background: theme.bgSecondary,
                borderColor: theme.border,
                color: theme.textMuted
              }}
            >
              <Shield className="w-12 h-12 mx-auto mb-3" style={{ color: theme.border }} />
              <p>No roles found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Role Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          style={{ background: theme.overlay }}
        >
          <div 
            className="rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
            style={{ background: theme.modal }}
          >
            <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: theme.border }}>
              <h2 className="text-xl font-bold" style={{ color: theme.text }}>
                {editingRole ? 'Edit Role' : 'Create New Role'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full transition-colors"
                style={{ color: theme.textMuted }}
                onMouseEnter={(e) => (e.currentTarget.style.background = theme.bg)}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveRole} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-bold mb-2 uppercase tracking-tighter opacity-50" style={{ color: theme.text }}>
                  Role Name
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Moderator, Content Editor"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                  style={{ 
                    background: theme.bg,
                    borderColor: theme.border,
                    color: theme.text,
                    '--tw-ring-color': `${theme.primary}33`
                  } as any}
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Claims Selection */}
              <div>
                <label className="block text-sm font-bold mb-3 uppercase tracking-tighter opacity-50" style={{ color: theme.text }}>
                  Permissions / Claims
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableClaims.map((claim) => (
                    <label 
                      key={claim.value}
                      className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors"
                      style={{ 
                        background: selectedClaims.includes(claim.value) ? `${theme.primary}10` : theme.bg,
                        borderColor: selectedClaims.includes(claim.value) ? theme.primary : theme.border
                      }}
                    >
                      <input 
                        type="checkbox"
                        className="w-4 h-4 rounded"
                        style={{ accentColor: theme.primary }}
                        checked={selectedClaims.includes(claim.value)}
                        onChange={() => toggleClaim(claim.value)}
                      />
                      <span className="text-xs font-bold" style={{ color: theme.text }}>{claim.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Invitation for new roles */}
              {!editingRole && (
                <div className="pt-4 border-t" style={{ borderColor: theme.border }}>
                   <label className="block text-sm font-bold mb-2 uppercase tracking-tighter opacity-50" style={{ color: theme.text }}>
                    Invite User (Optional)
                  </label>
                  <input 
                    type="email"
                    placeholder="Enter user email to send invitation"
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                    style={{ 
                      background: theme.bg,
                      borderColor: theme.border,
                      color: theme.text,
                      '--tw-ring-color': `${theme.primary}33`
                    } as any}
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                  <p className="mt-2 text-[10px] font-bold uppercase opacity-50" style={{ color: theme.textSecondary }}>
                    We'll create the role and send an invite to this email instantly.
                  </p>
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 rounded-xl"
                  onClick={() => setIsModalOpen(false)}
                  style={{ borderColor: theme.border, color: theme.text }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 transition-colors"
                  style={{ 
                    background: theme.primary,
                    color: theme.textInverse,
                    borderRadius: theme.borderRadius || '0.75rem'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = theme.primaryHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = theme.primary)}
                >
                  {editingRole ? 'Update Role' : 'Create & Invite'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Modal for existing roles */}
      {isInviteModalOpen && editingRole && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          style={{ background: theme.overlay }}
        >
          <div 
            className="rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
            style={{ background: theme.modal }}
          >
            <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: theme.border }}>
              <h2 className="text-xl font-bold" style={{ color: theme.text }}>
                Invite to {editingRole.name}
              </h2>
              <button 
                onClick={() => setIsInviteModalOpen(false)}
                className="p-2 rounded-full transition-colors"
                style={{ color: theme.textMuted }}
                onMouseEnter={(e) => (e.currentTarget.style.background = theme.bg)}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSendInvite} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2 uppercase tracking-tighter opacity-50" style={{ color: theme.text }}>
                  User Email
                </label>
                <input 
                  type="email"
                  required
                  placeholder="user@example.com"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                  style={{ 
                    background: theme.bg,
                    borderColor: theme.border,
                    color: theme.text,
                    '--tw-ring-color': `${theme.primary}33`
                  } as any}
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="pt-4 flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 rounded-xl"
                  onClick={() => setIsInviteModalOpen(false)}
                  style={{ borderColor: theme.border, color: theme.text }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 transition-colors"
                  style={{ 
                    background: theme.primary,
                    color: theme.textInverse,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = theme.primaryHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = theme.primary)}
                >
                  Send Invitation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

