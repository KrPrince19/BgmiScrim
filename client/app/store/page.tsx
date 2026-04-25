"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "@/context/SocketContext";
import { 
  ShoppingCart, 
  Flame, 
  Star, 
  Crosshair, 
  Zap, 
  Tag,
  Search,
  TrendingUp,
  PackageX,
  QrCode,
  Copy,
  ImageIcon,
  CheckCircle2,
  Upload,
  ShieldCheck,
  Crown,
  Car,
  ChevronRight,
  Info,
  BarChart3,
  X,
  Loader2,
  AlertCircle,
  User,
  MessageCircle
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// Types
type Category = "All" | "Outfits" | "Gun Skins" | "X-Suits" | "UC" | "Accounts";

interface StoreItem {
  _id: string;
  name: string;
  category: Category;
  originalPrice: number;
  price: number;
  discount: number;
  rating: number;
  rarity: "Mythic" | "Legendary" | "Epic" | "Rare";
  imageUrl: string;
  isDealOfDay: boolean;
  isOutOfStock: boolean;
  isHidden: boolean;
  description?: string;
}

const CATEGORIES: { name: Category; icon: any }[] = [
  { name: "All", icon: Tag },
  { name: "Outfits", icon: Flame },
  { name: "Gun Skins", icon: Crosshair },
  { name: "X-Suits", icon: Star },
  { name: "UC", icon: Zap },
  { name: "Accounts", icon: ShieldCheck },
];

export default function StorePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const SERVER_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace('/api', '');
  const [items, setItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Payment Modal State
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [transactionID, setTransactionID] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Detailed Account View State
  const [selectedAccount, setSelectedAccount] = useState<StoreItem | null>(null);

  const parseDescription = (desc?: string) => {
    if (!desc) return [];
    
    const lines = desc.split('\n').map(l => l.trim()).filter(l => l);
    const result: { category: string; items: string[]; icon: any }[] = [];
    
    let currentCategory = { category: "General Info", items: [] as string[], icon: Info };

    const keywords: { [key: string]: { label: string; icon: any } } = {
       "XSUIT": { label: "X-Suits", icon: User },
       "GUNLAB": { label: "Gun Lab", icon: Crosshair },
       "SUPERCARS": { label: "Supercars", icon: Car },
       "LOGINS": { label: "Login Info", icon: ShieldCheck },
       "ULTIMATE": { label: "Ultimate Sets", icon: Crown },
       "MYTHIC": { label: "Mythic Lobbies", icon: Star },
       "MATERIAL": { label: "Materials", icon: Zap },
       "ACC LVL": { label: "Account Stats", icon: BarChart3 },
    };

    lines.forEach(line => {
      const upperLine = line.toUpperCase();
      let foundHeader = false;

      for (const [key, data] of Object.entries(keywords)) {
        if (upperLine.includes(key) && line.length < 25) { // Likely a header
           if (currentCategory.items.length > 0) result.push(currentCategory);
           currentCategory = { category: data.label, items: [], icon: data.icon };
           foundHeader = true;
           break;
        }
      }

      if (!foundHeader) {
        currentCategory.items.push(line);
      }
    });

    if (currentCategory.items.length > 0) result.push(currentCategory);
    return result;
  };

  const UPI_ID = "7091910259@ybl";

  const fetchItems = useCallback(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/store`)
      .then((res) => res.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Failed to load store items:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleUpdate = (data: any) => {
      console.log('Client: Store update detected! ⚡', data);
      fetchItems();
    };

    socket.on('storeUpdate', handleUpdate);

    return () => {
      socket.off('storeUpdate', handleUpdate);
    };
  }, [socket, fetchItems]);

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const dealOfDay = items.find((item) => item.isDealOfDay);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    alert("UPI ID copied to clipboard!");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openPurchaseModal = (item: StoreItem) => {
    if (!user) {
      router.push("/login?redirect=/store");
      return;
    }
    setSelectedItem(item);
    setPaymentSuccess(false);
    setPaymentError("");
    setTransactionID("");
    setScreenshot(null);
    setScreenshotPreview(null);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionID || transactionID.length !== 12) {
      setPaymentError("Transaction ID must be 12 digits.");
      return;
    }
    if (!screenshot) {
      setPaymentError("Payment screenshot is required.");
      return;
    }

    setIsSubmitting(true);
    setPaymentError("");

    try {
      const formData = new FormData();
      formData.append("storeItemId", selectedItem?._id || "");
      formData.append("transactionID", transactionID);
      formData.append("screenshot", screenshot);

      await api.post("/payments/buy-item", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setPaymentSuccess(true);
      setTimeout(() => setSelectedItem(null), 3000);
    } catch (err: any) {
      setPaymentError(err.response?.data?.message || "Payment submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 overflow-x-hidden pt-12 pb-24">
      {/* Background grid effect */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-3"
            >
              Premium <span className="gradient-text">Store</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-zinc-400 max-w-xl"
            >
              Exclusive deals on mythic outfits, legendary gun skins, and X-suits. Upgrade your arsenal today.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-md w-full md:w-auto"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-zinc-500" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-3 border border-zinc-800 rounded-xl leading-5 bg-zinc-900/50 text-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all sm:text-sm glass-morphism"
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
        </div>

        {/* Featured Deal Card (Amazon/Flipkart Style Deals Card) */}
        {activeCategory === "All" && !searchQuery && dealOfDay && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12 relative rounded-2xl overflow-hidden group premium-card p-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 opacity-50 z-0"></div>
            
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
            
            <div className="relative z-20 flex flex-col md:flex-row items-start pt-4 pb-8 md:pt-6 md:pb-12 px-8 md:px-12 gap-8">
              <div className="flex-1 w-full space-y-4 md:pt-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium border border-red-500/30">
                  <Flame className="w-4 h-4" />
                  Deal of the Day
                </div>
                
                <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">
                    {dealOfDay.name}
                  </span> 
                </h2>
                
                <p className="text-zinc-400 max-w-lg text-lg">
                  Grab this exclusive limited-time offer. Epic items rotation happening soon, don't miss out on {dealOfDay.category.toLowerCase()}!
                </p>
                
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-bold">
                    {dealOfDay.price > 0 ? `₹${dealOfDay.price}` : "DM to buy"}
                  </span>
                  {dealOfDay.discount > 0 && dealOfDay.price > 0 && <span className="text-xl text-zinc-500 line-through mb-1">₹{dealOfDay.originalPrice}</span>}
                  {dealOfDay.discount > 0 && dealOfDay.price > 0 && <span className="text-sm font-semibold text-emerald-400 mb-1.5 ml-2 bg-emerald-500/10 px-2 py-0.5 rounded">{dealOfDay.discount}% OFF</span>}
                </div>
                
                {dealOfDay.price > 0 ? (
                  <button 
                    onClick={() => openPurchaseModal(dealOfDay)}
                    disabled={dealOfDay.isOutOfStock}
                    className={`flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold transition-all duration-300 w-full md:w-auto ${dealOfDay.isOutOfStock ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-zinc-100 text-zinc-900 hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]'}`}
                  >
                    {dealOfDay.isOutOfStock ? (
                        <><PackageX className="w-5 h-5" /> Out of Stock</>
                    ) : (
                        <><ShoppingCart className="w-5 h-5" /> Purchase Now</>
                    )}
                  </button>
                ) : (
                  <a 
                    href="https://wa.me/916205597789"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all duration-300 w-full md:w-auto shadow-lg shadow-emerald-600/20"
                  >
                    <MessageCircle className="w-5 h-5" /> WhatsApp: 6205597789
                  </a>
                )}
              </div>
              
              <div className="flex-1 w-full flex justify-center relative">
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-full blur-[80px] opacity-20"></div>
                  <div className="absolute inset-4 rounded-3xl overflow-hidden glass-morphism border-amber-500/30 flex items-center justify-center bg-zinc-950 shadow-2xl relative z-10 group-hover:scale-105 transition-transform duration-500 p-0">
                    <img 
                       src={`${SERVER_URL}${dealOfDay.imageUrl}`} 
                       alt={dealOfDay.name} 
                       className="max-w-full max-h-full object-contain pointer-events-none drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Categories Navbar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-6 mb-4 scrollbar-hide">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.name;
            
            return (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] border border-blue-500" 
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-zinc-500"}`} />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            {activeCategory === "All" ? "Trending Collections" : `${activeCategory} Collection`}
          </h3>
          <span className="text-sm text-zinc-500">Showing {filteredItems.length} items</span>
        </div>

        {/* Store Grid */}
        {loading ? (
            <div className="py-20 flex justify-center">
               <div className="animate-spin text-blue-500"><TrendingUp /></div>
            </div>
        ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {filteredItems.map((item) => {
                  const isMythic = item.rarity === 'Mythic';
                  const isLegendary = item.rarity === 'Legendary';
                  const isEpic = item.rarity === 'Epic';
                  
                  const rarityBadgeClasses = isMythic ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 
                                            isLegendary ? 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30' : 
                                            isEpic ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 
                                            'bg-blue-500/20 text-blue-300 border-blue-500/30';

                  const glowClasses = isMythic ? 'from-amber-400 to-orange-600' :
                                      isLegendary ? 'from-fuchsia-500 to-purple-600' :
                                      isEpic ? 'from-purple-400 to-pink-500' :
                                      'from-blue-400 to-cyan-500';

                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="group relative flex flex-col premium-card overflow-hidden"
                    >
                      {/* Item Image */}
                      <div className="relative aspect-square overflow-hidden bg-zinc-950 flex items-center justify-center p-6">
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent z-10 pointer-events-none"></div>
                        
                        {/* Discount Badge */}
                        {item.discount > 0 && (
                          <div className="absolute top-4 left-4 z-20 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-lg flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {item.discount}% OFF
                          </div>
                        )}
                        
                        {/* Rarity Badge */}
                        <div className={`absolute top-4 right-4 z-20 text-xs font-bold px-2.5 py-1 rounded-md shadow-lg border backdrop-blur-md bg-opacity-20 ${rarityBadgeClasses}`}>
                          {item.rarity}
                        </div>

                        {/* Animated glowing background */}
                        <div className={`w-32 h-32 rounded-full absolute bg-gradient-to-tr ${glowClasses} blur-[60px] opacity-30 group-hover:opacity-50 transition-opacity duration-500`}></div>
                        
                        {/* Center Image */}
                        <div className="relative z-10 w-full h-full flex items-center justify-center transform transition-transform duration-500 group-hover:scale-105">
                           <img 
                              src={`${SERVER_URL}${item.imageUrl}`} 
                              alt={item.name} 
                              className={`max-w-full max-h-full object-contain drop-shadow-2xl ${item.isOutOfStock ? 'grayscale opacity-70' : ''}`}
                           />
                        </div>

                        {item.isOutOfStock && (
                            <div className="absolute inset-0 bg-black/50 z-20 flex flex-col items-center justify-center backdrop-blur-[2px]">
                                <PackageX className="w-8 h-8 text-zinc-400 mb-2" />
                                <span className="uppercase text-xs font-black tracking-widest text-zinc-300">Out of Stock</span>
                            </div>
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="p-5 flex flex-col flex-grow">
                        <p className="text-xs text-zinc-500 font-medium mb-1 uppercase tracking-wider">{item.category}</p>
                        <h3 className="text-lg font-bold text-zinc-100 mb-2 line-clamp-1">{item.name}</h3>
                        
                        <div className="flex items-center gap-1 mb-4">
                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm text-zinc-300 font-medium">{item.rating}</span>
                        </div>

                        <div className="mt-auto flex items-end justify-between">
                          <div>
                            {item.discount > 0 && item.price > 0 && (
                              <p className="text-sm text-zinc-500 line-through">₹{item.originalPrice}</p>
                            )}
                            <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-200">
                              {item.price > 0 ? `₹${item.price}` : "DM to buy"}
                            </p>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            {item.description && (
                              <button 
                                onClick={() => setSelectedAccount(item)}
                                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-bold transition-all border border-blue-500/20"
                              >
                                <Info className="w-3.5 h-3.5" /> View Stats
                              </button>
                            )}
                            {item.price > 0 ? (
                              <button 
                                onClick={() => openPurchaseModal(item)}
                                disabled={item.isOutOfStock}
                                className={`p-3 rounded-xl transition-all duration-300 shadow-md group/btn relative overflow-hidden ${item.isOutOfStock ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-zinc-800 hover:bg-blue-600 text-white'}`}
                              >
                                {!item.isOutOfStock && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>}
                                <ShoppingCart className="w-5 h-5 relative z-10 mx-auto" />
                              </button>
                            ) : (
                              <a 
                                href="https://wa.me/916205597789"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-xl transition-all duration-300 flex items-center justify-center border border-emerald-500/20 group/wa"
                              >
                                <MessageCircle className="w-5 h-5 group-hover/wa:scale-110 transition-transform" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
        )}
        
        {!loading && filteredItems.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-zinc-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No items found</h3>
            <p className="text-zinc-500 max-w-sm">We couldn't find any items matching your search. Try different keywords or browse all categories.</p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="mt-6 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-xl w-full bg-zinc-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <ShoppingCart className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Purchase Item</h3>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{selectedItem.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-zinc-500" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[80vh]">
                {paymentSuccess ? (
                  <div className="text-center py-12">
                     <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-12 h-12" />
                     </div>
                     <h4 className="text-2xl font-bold mb-2 text-emerald-400">Payment Successful</h4>
                     <p className="text-zinc-500">You will get whatsapp message and dm on given number and 6205597789.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitPayment} className="space-y-6">
                    {paymentError && (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-3">
                        <AlertCircle className="h-5 w-5" /> {paymentError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       <div className="p-4 bg-white rounded-2xl flex flex-col items-center justify-center border border-white/10 shadow-inner">
                          <img src="/qr.png" alt="Scan to pay" className="w-32 h-32 object-contain" />
                          <p className="text-[10px] text-zinc-400 mt-2 font-black uppercase tracking-tight">Scan via UPI App</p>
                       </div>
                       
                       <div className="space-y-4">
                          <div className="p-4 bg-zinc-950/50 border border-white/5 rounded-2xl">
                             <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">UPI ID</p>
                             <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-mono truncate">{UPI_ID}</span>
                                <button type="button" onClick={handleCopyUPI} className="p-1.5 hover:bg-white/5 rounded-md">
                                   <Copy className="w-3.5 h-3.5 text-zinc-500" />
                                </button>
                             </div>
                          </div>
                          
                          <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                             <p className="text-[10px] text-blue-500 uppercase font-black tracking-widest mb-0.5">Amount to Pay</p>
                             <div className="text-2xl font-black">₹{selectedItem.price}</div>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-zinc-500 uppercase tracking-widest font-black block">Transaction ID (UTR Number)</label>
                      <input
                        type="text"
                        placeholder="Enter 12-digit ID"
                        required
                        maxLength={12}
                        minLength={12}
                        value={transactionID}
                        onChange={(e) => setTransactionID(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:ring-2 focus:ring-blue-500 transition-all font-mono tracking-widest"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-zinc-500 uppercase tracking-widest font-black block">Payment Screenshot</label>
                      <input
                        type="file"
                        accept="image/*"
                        id="store-screenshot"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label 
                        htmlFor="store-screenshot"
                        className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/10 rounded-2xl bg-zinc-950/30 hover:bg-zinc-950/50 cursor-pointer group"
                      >
                         {screenshotPreview ? (
                            <img src={screenshotPreview} className="h-full w-full object-contain p-2" alt="Preview" />
                         ) : (
                            <div className="flex flex-col items-center gap-2">
                               <Upload className="w-6 h-6 text-zinc-600 group-hover:text-blue-500" />
                               <span className="text-[10px] text-zinc-500 font-bold uppercase">Upload Receipt</span>
                            </div>
                         )}
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit Payment Request"}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Account Details Modal */}
      <AnimatePresence>
        {selectedAccount && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              className="relative max-w-4xl w-full bg-[#0c0c0e] rounded-[2rem] border border-white/10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Left Side: Hero Image */}
              <div className="w-full md:w-[40%] bg-zinc-900/50 relative flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-white/5">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent opacity-60"></div>
                <div className={`absolute top-8 left-8 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border border-white/10 backdrop-blur-md
                  ${selectedAccount.rarity === 'Mythic' ? 'bg-amber-500/20 text-amber-400' : 
                    selectedAccount.rarity === 'Legendary' ? 'bg-fuchsia-500/20 text-fuchsia-400' : 
                    'bg-blue-500/20 text-blue-400'}`}>
                  {selectedAccount.rarity} Account
                </div>
                
                <img 
                  src={`${SERVER_URL}${selectedAccount.imageUrl}`} 
                  alt={selectedAccount.name} 
                  className="relative z-10 max-w-full max-h-full object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                />

                <div className="absolute bottom-8 left-8 right-8 z-20">
                   <h2 className="text-2xl font-black text-white leading-tight mb-2">{selectedAccount.name}</h2>
                   <div className="text-3xl font-black text-emerald-400">
                      {selectedAccount.price > 0 ? `₹${selectedAccount.price}` : "DM to buy"}
                   </div>
                </div>
              </div>

              {/* Right Side: Details */}
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                      <span className="font-black uppercase tracking-tighter text-sm italic">Account Statistics</span>
                   </div>
                   <button 
                     onClick={() => setSelectedAccount(null)}
                     className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors"
                   >
                     <X className="w-6 h-6" />
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar min-h-0 relative">
                   <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-[#0c0c0e] to-transparent pointer-events-none z-10"></div>
                   <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-[#0c0c0e] to-transparent pointer-events-none z-10"></div>
                   <div className="grid grid-cols-1 gap-6">
                      {parseDescription(selectedAccount.description).map((section, idx) => (
                        <div key={idx} className="space-y-3">
                           <div className="flex items-center gap-2 opacity-50">
                              <section.icon className="w-4 h-4" />
                              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{section.category}</span>
                           </div>
                           <div className="flex flex-col gap-1.5">
                              {section.items.map((item, i) => (
                                <div key={i} className="flex items-start gap-3 py-1 group">
                                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                                   <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors leading-relaxed uppercase tracking-wide">{item}</span>
                                </div>
                              ))}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="p-6 bg-zinc-950/50 border-t border-white/5">
                   {selectedAccount.price > 0 ? (
                      <button 
                        onClick={() => {
                          setSelectedAccount(null);
                          openPurchaseModal(selectedAccount);
                        }}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-3"
                      >
                         <ShoppingCart className="w-5 h-5" /> Proceed to Purchase
                      </button>
                   ) : (
                      <a 
                        href="https://wa.me/916205597789"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-3"
                      >
                         <MessageCircle className="w-5 h-5" /> Contact: 6205597789
                      </a>
                   )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
