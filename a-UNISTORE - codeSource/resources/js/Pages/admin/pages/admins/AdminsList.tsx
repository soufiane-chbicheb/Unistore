import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Shield, Check, Upload, Search } from "lucide-react";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";
import { SectionHeader } from "@/admin/components/layout/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAdminThemeCtx } from "@/contextHooks/useAdminThemeCtx";
import { Input } from "@/components/ui/Input";
import CustomSelect from "@/components/ui/CustomSelect";
import { router, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import { useToast } from "@/contextHooks/useToasts";

interface Role {
    id: number;
    name: string;
    claims: string[];
}

interface AdminUser {
    id: number;
    name: string;
    email: string;
    roles: Role[];
    created_at: string;
}

interface AdminsListProps {
    admins: AdminUser[];
    roles: Role[];
}

interface FormData {
    name: string;
    email: string;
    password: string;
    role_ids: number[];
}

export default function AdminsList({ admins: initialAdmins, roles }: AdminsListProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState<AdminUser | null>(null);
    const [processing, setProcessing] = useState(false);
    const { addToast } = useToast();
    const [data, setData] = useState<FormData>({
        name: "",
        email: "",
        password: "",
        role_ids: [],
    });

    const { state: { currentTheme: theme } } = useAdminThemeCtx();

    const filteredAdmins = initialAdmins.filter(admin => {
        const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             admin.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "all" || admin.roles.some(r => r.name === roleFilter);
        return matchesSearch && matchesRole;
    });

    const handleOpenDialog = (admin?: AdminUser) => {
        if (admin) {
            setEditingAdmin(admin);
            setData({
                name: admin.name,
                email: admin.email,
                password: "",
                role_ids: admin.roles.map(r => r.id),
            });
        } else {
            setEditingAdmin(null);
            setData({
                name: "",
                email: "",
                password: "",
                role_ids: [],
            });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingAdmin(null);
    };

    const toggleRole = (roleId: number) => {
        setData(prev => ({
            ...prev,
            role_ids: prev.role_ids.includes(roleId)
                ? prev.role_ids.filter(id => id !== roleId)
                : [...prev.role_ids, roleId]
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        if (editingAdmin) {
            router.put(route('admin.roles.update_user', { user: editingAdmin.id }), data, {
                onSuccess: () => {
                    handleCloseDialog();
                    addToast({ type: 'success', title: 'Success', description: 'Admin updated successfully' });
                },
                onFinish: () => setProcessing(false)
            });
        } else {
            // Usually we might have a dedicated endpoint for creating admins
            // but for now let's assume we use an invitation system or a simple user creation
            router.post(route('admin.roles.store_user'), data, {
                onSuccess: () => {
                    handleCloseDialog();
                    addToast({ type: 'success', title: 'Success', description: 'Admin created successfully' });
                },
                onFinish: () => setProcessing(false)
            });
        }
    };

    const handleDelete = (admin: AdminUser) => {
        setAdminToDelete(admin);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!adminToDelete) return;
        
        router.delete(route('admin.roles.destroy_user', { user: adminToDelete.id }), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setAdminToDelete(null);
                addToast({ type: 'success', title: 'Success', description: 'Admin removed successfully' });
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 ">
            <div className="space-y-6 p-6 max-w-7xl mx-auto">
                <SectionHeader
                    title="Admin Management"
                    description="Manage administrative users and their assigned roles"
                >
                    <Button onClick={() => handleOpenDialog()}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Admin
                    </Button>
                </SectionHeader>

                <Card
                    className="overflow-hidden"
                    style={{
                        background: theme.card,
                        border: `1px solid ${theme.border}`,
                        borderRadius: theme.borderRadius,
                        boxShadow: theme.shadowLg,
                    }}
                >
                    <CardHeader
                        style={{
                            background: theme.bg,
                            borderBottom: `1px solid ${theme.border}`,
                        }}
                    >
                        <div className="flex flex-wrap items-center gap-4">
                            <h2 className="text-lg font-semibold mr-auto" style={{ color: theme.text }}>
                                All Admins ({filteredAdmins.length})
                            </h2>

                            <div className="relative min-w-[220px]">
                                <Input
                                    placeholder="Search admins..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ border: `2px solid ${theme.border}` }}
                                />
                            </div>

                            <CustomSelect
                                placeholder="Filter by Role"
                                value={roleFilter}
                                onChange={(val) => setRoleFilter(val)}
                                options={[
                                    { label: "All Roles", value: "all" },
                                    ...roles.map(r => ({ label: r.name, value: r.name }))
                                ]}
                            />
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {filteredAdmins.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow style={{ background: theme.bgSecondary, borderBottom: `2px solid ${theme.border}` }}>
                                            {["Name", "Email", "Roles", "Joined", "Actions"].map((head) => (
                                                <TableHead key={head} className={head === "Actions" ? "text-right" : ""} style={{ color: theme.textSecondary, fontWeight: 600, textTransform: "uppercase", fontSize: "0.85rem" }}>
                                                    {head}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {filteredAdmins.map((admin) => (
                                            <TableRow key={admin.id} className="hover:bg-opacity-50 transition-colors" style={{ background: theme.bg, borderBottom: `1px solid ${theme.border}` }}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="flex items-center justify-center rounded-full h-10 w-10 overflow-hidden text-white font-semibold text-sm"
                                                            style={{
                                                                backgroundColor: `hsl(${(admin.id * 137) % 360}, 70%, 50%)`,
                                                            }}
                                                        >
                                                            {admin.name.slice(0, 2).toUpperCase()}
                                                        </div>
                                                        <span className="font-medium" style={{ color: theme.text }}>{admin.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell style={{ color: theme.textMuted }}>{admin.email}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {admin.roles.length > 0 ? admin.roles.map(role => (
                                                            <Badge key={role.id} style={{ background: `${theme.primary}15`, color: theme.primary, border: `1px solid ${theme.primary}30` }}>
                                                                {role.name}
                                                            </Badge>
                                                        )) : (
                                                            <span className="text-xs text-slate-400 italic">No roles</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell style={{ color: theme.textMuted }}>{new Date(admin.created_at).toLocaleDateString()}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(admin)} style={{ border: `1px solid ${theme.border}` }}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(admin)} style={{ border: `1px solid ${theme.border}`, color: theme.error }}>
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
                            <div className="py-16 text-center" style={{ color: theme.textMuted }}>
                                No admins found matching your criteria.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    name={adminToDelete?.name || ""}
                    entityType="admin"
                />

                {isDialogOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm" style={{ background: theme.overlay }}>
                        <div className="rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" style={{ background: theme.modal }}>
                            <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: theme.border }}>
                                <h2 className="text-xl font-bold" style={{ color: theme.text }}>
                                    {editingAdmin ? "Edit Admin" : "Add New Admin"}
                                </h2>
                                <Button variant="ghost" size="icon" onClick={handleCloseDialog}>
                                    <Shield className={editingAdmin ? "text-blue-500" : "text-green-500"} />
                                </Button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-1 opacity-60">Full Name</label>
                                        <Input
                                            value={data.name}
                                            onChange={(e) => setData({ ...data, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1 opacity-60">Email Address</label>
                                        <Input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData({ ...data, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1 opacity-60">
                                            Password {editingAdmin && "(leave blank to keep current)"}
                                        </label>
                                        <Input
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData({ ...data, password: e.target.value })}
                                            required={!editingAdmin}
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-bold mb-2 opacity-60">Assigned Roles</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {roles.map((role) => (
                                                <label 
                                                    key={role.id}
                                                    className="flex items-center gap-2 p-2 rounded-lg border cursor-pointer hover:bg-slate-50 transition-colors"
                                                    style={{ 
                                                        borderColor: data.role_ids.includes(role.id) ? theme.primary : theme.border,
                                                        background: data.role_ids.includes(role.id) ? `${theme.primary}05` : 'transparent'
                                                    }}
                                                >
                                                    <input 
                                                        type="checkbox"
                                                        checked={data.role_ids.includes(role.id)}
                                                        onChange={() => toggleRole(role.id)}
                                                        style={{ accentColor: theme.primary }}
                                                    />
                                                    <span className="text-xs font-semibold">{role.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 flex gap-3">
                                    <Button type="button" variant="outline" className="flex-1" onClick={handleCloseDialog}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing} className="flex-1" style={{ background: theme.primary, color: theme.textInverse }}>
                                        {processing ? "Saving..." : (editingAdmin ? "Update Admin" : "Create Admin")}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

AdminsList.layout = (page: any) => <AdminLayout>{page}</AdminLayout>;
