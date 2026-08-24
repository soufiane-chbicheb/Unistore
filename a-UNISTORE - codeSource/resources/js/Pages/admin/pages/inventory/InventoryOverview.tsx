// admin/pages/inventory/InventoryOverview.tsx

import { useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { AlertTriangle, Package } from "lucide-react";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";

// Types
interface Product {
    id: string;
    name: string;
    sku: string;
    stock: number;
}

interface StockHistory {
    id: string;
    productName: string;
    change: number;
    previousStock: number;
    newStock: number;
    reason: string;
    createdAt: string;
}

interface InventoryOverviewProps {
    products: Product[];
    stockHistory: StockHistory[];
}

// Mock data
const mockProducts: Product[] = [
    { id: "1", name: "Classic T-Shirt", sku: "TSH-001", stock: 45 },
    { id: "2", name: "Slim Fit Jeans", sku: "JNS-002", stock: 8 },
    { id: "3", name: "Summer Dress", sku: "DRS-003", stock: 0 },
    { id: "4", name: "Wool Sweater", sku: "SWT-004", stock: 23 },
];

const mockStockHistory: StockHistory[] = [
    { id: "1", productName: "Classic T-Shirt", change: 20, previousStock: 25, newStock: 45, reason: "Restock", createdAt: "2024-01-15T10:30:00Z" },
    { id: "2", productName: "Slim Fit Jeans", change: -5, previousStock: 13, newStock: 8, reason: "Sold", createdAt: "2024-01-14T14:20:00Z" },
    { id: "3", productName: "Summer Dress", change: -3, previousStock: 3, newStock: 0, reason: "Damaged", createdAt: "2024-01-13T09:00:00Z" },
    { id: "4", productName: "Wool Sweater", change: 10, previousStock: 13, newStock: 23, reason: "Restock", createdAt: "2024-01-12T16:45:00Z" },
];

const formatDateTime = (date: string) => {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
};

export default function InventoryOverview({
    products = mockProducts,
    stockHistory = mockStockHistory,
}: InventoryOverviewProps) {
    const [activeTab, setActiveTab] = useState<"all" | "low" | "out" | "history">("all");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const { data, setData, post, processing, reset } = useForm({
        productId: "",
        change: "",
        reason: "",
    });

    const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock < 10);
    const outOfStockProducts = products.filter((p) => p.stock === 0);

    const handleOpenDialog = (product: Product) => {
        setSelectedProduct(product);
        setData("productId", product.id);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedProduct(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/admin/inventory/update-stock", {
            onSuccess: () => handleCloseDialog(),
        });
    };

    const getStockBadgeClass = (stock: number) => {
        if (stock === 0) return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
        if (stock < 10) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    };

    const renderProductTable = (productList: Product[], emptyMessage: string, showStock = true) => (
        productList.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-700/50">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Product</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">SKU</th>
                            {showStock && <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Stock</th>}
                            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {productList.map((product) => (
                            <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="px-4 py-4 font-medium text-slate-900 dark:text-slate-100">{product.name}</td>
                                <td className="px-4 py-4 font-mono text-sm text-slate-500 dark:text-slate-400">{product.sku}</td>
                                {showStock && (
                                    <td className="px-4 py-4">
                                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getStockBadgeClass(product.stock)}`}>
                                            {product.stock} units
                                        </span>
                                    </td>
                                )}
                                <td className="px-4 py-4 text-right">
                                    <button
                                        onClick={() => handleOpenDialog(product)}
                                        className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        {product.stock === 0 ? "Restock" : "Update Stock"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">{emptyMessage}</div>
        )
    );

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    Inventory Management
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Monitor stock levels and manage inventory
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 sm:grid-cols-3">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Products</span>
                        <Package className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{products.length}</div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Low Stock</span>
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div className="text-3xl font-bold text-yellow-600">{lowStockProducts.length}</div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Out of Stock</span>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="text-3xl font-bold text-red-600">{outOfStockProducts.length}</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="space-y-4">
                <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
                    {[
                        { key: "all", label: "All Products" },
                        { key: "low", label: "Low Stock" },
                        { key: "out", label: "Out of Stock" },
                        { key: "history", label: "Stock History" },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as typeof activeTab)}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === tab.key
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            {activeTab === "all" && "All Products"}
                            {activeTab === "low" && "Low Stock Products"}
                            {activeTab === "out" && "Out of Stock Products"}
                            {activeTab === "history" && "Stock Movement History"}
                        </h2>
                    </div>

                    {activeTab === "all" && renderProductTable(products, "No products in inventory")}
                    {activeTab === "low" && renderProductTable(lowStockProducts, "All products are well stocked")}
                    {activeTab === "out" && renderProductTable(outOfStockProducts, "No products out of stock", false)}

                    {activeTab === "history" && (
                        stockHistory.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-700/50">
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Product</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Change</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Previous</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">New</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Reason</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {stockHistory.map((record) => (
                                            <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                                <td className="px-4 py-4 font-medium text-slate-900 dark:text-slate-100">{record.productName}</td>
                                                <td className="px-4 py-4">
                                                    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                                                        record.change > 0
                                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                    }`}>
                                                        {record.change > 0 ? `+${record.change}` : record.change}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-slate-500 dark:text-slate-400">{record.previousStock}</td>
                                                <td className="px-4 py-4 font-semibold text-slate-900 dark:text-slate-100">{record.newStock}</td>
                                                <td className="px-4 py-4 text-slate-500 dark:text-slate-400">{record.reason}</td>
                                                <td className="px-4 py-4 text-slate-500 dark:text-slate-400">{formatDateTime(record.createdAt)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-12 text-center text-slate-500 dark:text-slate-400">No stock history yet</div>
                        )
                    )}
                </div>
            </div>

            {/* Modal */}
            {isDialogOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="fixed inset-0 bg-black/50" onClick={handleCloseDialog} />
                        <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-xl">
                            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Update Stock</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Adjust stock quantity for {selectedProduct?.name}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="p-4 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            Current Stock
                                        </label>
                                        <input
                                            type="text"
                                            value={selectedProduct?.stock || 0}
                                            disabled
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            Change Amount
                                        </label>
                                        <input
                                            type="number"
                                            value={data.change}
                                            onChange={(e) => setData("change", e.target.value)}
                                            placeholder="e.g., 50 or -10"
                                            required
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Use positive numbers to add stock, negative to remove
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            Reason
                                        </label>
                                        <input
                                            type="text"
                                            value={data.reason}
                                            onChange={(e) => setData("reason", e.target.value)}
                                            placeholder="e.g., Restock, Sale, Damaged"
                                            required
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 p-4 border-t border-slate-200 dark:border-slate-700">
                                    <button
                                        type="button"
                                        onClick={handleCloseDialog}
                                        className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                    >
                                        {processing ? "Updating..." : "Update Stock"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


InventoryOverview.layout = (page:any) => <AdminLayout children={page} />
