"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import {
    Loader2, Plus, Trash2, X, Check, Image as ImageIcon, ShoppingBag, EyeOff, Eye, PackageX, PackageCheck, Edit2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const emptyForm = { name: "", category: "Outfits", originalPrice: "", price: "", discount: "", rarity: "Epic", isDealOfDay: false, description: "" };

export default function StoreManagePage() {
    const { user, loading: authLoading } = useAuth();
    const SERVER_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace('/api', '');
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [form, setForm] = useState(emptyForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [editingItem, setEditingItem] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const fetchItems = async () => {
        try {
            // Pass adminView to see hidden items
            const { data } = await api.get("/store?adminView=true");
            setItems(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authLoading || !user) return;
        fetchItems();
    }, [user, authLoading]);

    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;

        const handleUpdate = (data: any) => {
            console.log('Admin: Store update detected! ⚡', data);
            fetchItems();
        };

        socket.on('storeUpdate', handleUpdate);

        return () => {
            socket.off('storeUpdate', handleUpdate);
        };
    }, [socket]);

    const openCreate = () => {
        setForm(emptyForm);
        setImageFile(null);
        setEditingItem(null);
        setError("");
        setShowModal(true);
    };

    const openEdit = (item: any) => {
        setForm({
            name: item.name,
            category: item.category,
            originalPrice: String(item.originalPrice),
            price: String(item.price),
            discount: String(item.discount),
            rarity: item.rarity,
            isDealOfDay: item.isDealOfDay,
            description: item.description || ""
        });
        setImageFile(null);
        setEditingItem(item._id);
        setError("");
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this store item entirely? This action cannot be undone.")) return;
        try {
            await api.delete(`/store/${id}`);
            fetchItems();
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to delete");
        }
    };

    const toggleStock = async (id: string) => {
        try {
            await api.put(`/store/${id}/stock`);
            fetchItems();
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to update stock");
        }
    };

    const toggleHide = async (id: string) => {
        try {
            await api.put(`/store/${id}/hide`);
            fetchItems();
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to update visibility");
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        if (!imageFile && !editingItem) {
            setError("Please upload an image for the item");
            setSaving(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("category", form.category);
            formData.append("originalPrice", form.originalPrice);
            formData.append("price", form.price);
            formData.append("discount", form.discount || "0");
            formData.append("rarity", form.rarity);
            formData.append("isDealOfDay", String(form.isDealOfDay));
            formData.append("description", form.description || "");
            if (imageFile) formData.append("image", imageFile);

            if (editingItem) {
                await api.put(`/store/${editingItem}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            } else {
                await api.post("/store", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }
            
            setShowModal(false);
            fetchItems();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to save item");
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || !user || loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-red-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-black text-white">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-h-screen">
                <MobileHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
                <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-4xl font-black tracking-tight mb-1 font-heading uppercase text-red-600 flex items-center gap-3">
                                    <ShoppingBag className="h-8 w-8 text-white" /> Store Center
                                </h1>
                                <p className="text-zinc-500 font-medium tracking-tight">Manage collections, deals, and stock visibility.</p>
                            </div>
                            <button
                                onClick={openCreate}
                                className="flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-bold transition-all shadow-lg shadow-red-600/20 text-white"
                            >
                                <Plus className="h-4 w-4" /> Add Item
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {items.length === 0 ? (
                                <div className="col-span-full text-center py-20 glass-morphism rounded-3xl text-zinc-500 font-bold italic tracking-widest border border-dashed border-white/5">
                                    NO ITEMS FOUND IN STORE.
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.div
                                        key={item._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`premium-card overflow-hidden flex flex-col transition-all ${item.isHidden ? 'opacity-50 grayscale' : ''}`}
                                    >
                                        <div className="relative h-64 bg-zinc-950 flex items-center justify-center overflow-hidden p-4">
                                            {item.imageUrl ? (
                                                <img src={`${SERVER_URL}${item.imageUrl}`} alt={item.name} className="max-w-full max-h-full object-contain" />
                                            ) : (
                                                <ImageIcon className="text-zinc-700 h-16 w-16" />
                                            )}
                                            {item.isDealOfDay && (
                                                <div className="absolute top-2 left-2 bg-red-500 px-2 py-1 rounded text-xs font-black uppercase shadow-lg shadow-red-500/20 text-white">
                                                    Deal of the Day
                                                </div>
                                            )}
                                            {item.isHidden && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-10">
                                                    <span className="text-white font-black text-lg tracking-widest uppercase flex items-center gap-2">
                                                        <EyeOff className="h-5 w-5" /> Hidden
                                                    </span>
                                                </div>
                                            )}
                                            {item.isOutOfStock && !item.isHidden && (
                                                <div className="absolute inset-0 bg-red-900/40 flex flex-col items-center justify-center backdrop-blur-sm z-10">
                                                    <PackageX className="h-8 w-8 text-white mb-2" />
                                                    <span className="text-white font-black text-sm tracking-widest uppercase bg-red-600 px-3 py-1 rounded-lg">
                                                        Out of Stock
                                                    </span>
                                                </div>
                                            )}
                                            <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded text-[10px] font-black uppercase text-white backdrop-blur-md">
                                                {item.rarity}
                                            </div>
                                        </div>
                                        <div className="p-5 flex flex-col flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black leading-none">{item.category}</span>
                                                    <h3 className="font-bold text-lg leading-tight line-clamp-1">{item.name}</h3>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-emerald-400 font-black">
                                                        {item.price > 0 ? `${item.price} UC` : "DM to buy"}
                                                    </div>
                                                    {item.discount > 0 && item.price > 0 && <div className="text-zinc-500 text-xs line-through">{item.originalPrice} UC</div>}
                                                </div>
                                            </div>

                                            <div className="mt-auto pt-4 flex gap-2">
                                                <button
                                                    onClick={() => toggleHide(item._id)}
                                                    className={`h-10 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-all flex-1 ${item.isHidden ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'}`}
                                                    title={item.isHidden ? 'Show' : 'Hide'}
                                                >
                                                    {item.isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                                </button>
                                                <button
                                                    onClick={() => toggleStock(item._id)}
                                                    className={`h-10 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-all flex-1 ${item.isOutOfStock ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'}`}
                                                    title={item.isOutOfStock ? 'In Stock' : 'Out Stock'}
                                                >
                                                    {item.isOutOfStock ? <PackageCheck className="h-4 w-4" /> :  <PackageX className="h-4 w-4" />}
                                                </button>
                                                <button
                                                    onClick={() => openEdit(item)}
                                                    className="h-10 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg font-bold flex items-center justify-center transition-all flex-1"
                                                    title="Edit Item"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="h-10 px-3 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-lg font-bold flex items-center justify-center transition-all flex-1"
                                                    title="Delete Item"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Create Modal */}
                        <AnimatePresence>
                            {showModal && (
                                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="glass-morphism border border-white/10 rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-2xl font-black uppercase tracking-tighter italic text-white flex items-center gap-2">
                                                <ShoppingBag className="text-red-500" /> {editingItem ? 'Edit' : 'New'} Item
                                            </h2>
                                            <button onClick={() => setShowModal(false)}><X className="h-5 w-5 text-zinc-400 hover:text-white" /></button>
                                        </div>

                                        {error && (
                                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold text-center">
                                                {error}
                                            </div>
                                        )}

                                        <form onSubmit={handleSave} className="space-y-4 text-white">
                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-1 block">Item Name</label>
                                                <input
                                                    type="text" required placeholder="e.g. Glacier M416"
                                                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-red-500 font-bold"
                                                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-1 block">Category</label>
                                                    <select
                                                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-red-500 font-bold"
                                                        value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                                                    >
                                                        <option value="Outfits">Outfits</option>
                                                        <option value="Gun Skins">Gun Skins</option>
                                                        <option value="X-Suits">X-Suits</option>
                                                        <option value="UC">UC</option>
                                                        <option value="Accounts">Accounts</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-1 block">Rarity</label>
                                                    <select
                                                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-red-500 font-bold"
                                                        value={form.rarity} onChange={(e) => setForm({ ...form, rarity: e.target.value })}
                                                    >
                                                        <option value="Mythic">Mythic (Red)</option>
                                                        <option value="Legendary">Legendary (Purple)</option>
                                                        <option value="Epic">Epic (Pink)</option>
                                                        <option value="Rare">Rare (Blue)</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-1 block">Original Price (UC)</label>
                                                    <input
                                                        type="number" placeholder="1000 (0 for DM to buy)" min="0"
                                                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-red-500 font-bold"
                                                        value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-1 block">Selling Price (UC)</label>
                                                    <input
                                                        type="number" placeholder="800 (0 for DM to buy)" min="0"
                                                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-red-500 font-bold"
                                                        value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-1 block">Discount % (Badge)</label>
                                                    <input
                                                        type="number" placeholder="20" min="0" max="100"
                                                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-red-500 font-bold"
                                                        value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })}
                                                    />
                                                </div>
                                                <div className="flex items-center mt-5">
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={form.isDealOfDay}
                                                            onChange={(e) => setForm({ ...form, isDealOfDay: e.target.checked })}
                                                            className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-red-500 focus:ring-offset-zinc-900"
                                                        />
                                                        <span className="text-sm font-bold">Deal of the Day?</span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-1 block">Detailed Description (Optional - For accounts/traits)</label>
                                                <textarea
                                                    rows={4}
                                                    placeholder="Paste account details here (ACC LVL, XSUITS, etc.)"
                                                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-red-500 font-medium text-sm custom-scrollbar"
                                                    value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                                />
                                            </div>

                                            <div className="pt-2">
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-1 block">Item Image (Square recommended)</label>
                                                <div className="file-input-wrapper relative border-2 border-dashed border-zinc-700 hover:border-red-500 bg-zinc-900/50 rounded-xl p-4 transition-all text-center">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        onChange={(e) => {
                                                            if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
                                                        }}
                                                    />
                                                    <ImageIcon className="mx-auto h-8 w-8 text-zinc-500 mb-2" />
                                                    {imageFile ? (
                                                        <p className="text-sm text-emerald-400 font-bold max-w-full truncate">{imageFile.name}</p>
                                                    ) : (
                                                        <p className="text-sm font-bold text-zinc-400">Click to upload file</p>
                                                    )}
                                                </div>
                                            </div>

                                            <button type="submit" disabled={saving} className="w-full py-4 bg-red-600 hover:bg-red-500 rounded-xl font-black flex items-center justify-center gap-2 transition-all mt-4 shadow-lg shadow-red-600/20 text-white">
                                                {saving ? <Loader2 className="animate-spin h-5 w-5" /> : <><Check className="h-5 w-5" /> {editingItem ? 'Update Item' : 'Publish to Store'}</>}
                                            </button>
                                        </form>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    );
}
