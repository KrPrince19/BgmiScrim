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
  ArrowRight,
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
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden pt-12 pb-24 selection:bg-blue-500/30">
      {/* Background grid effect */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000012_1px,transparent_1px),linear-gradient(to_bottom,#00000012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-black tracking-tight mb-3"
            >
              Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Store</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 max-w-xl font-medium"
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
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all sm:text-sm shadow-sm"
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
        </div>

        {/* Featured Deal Card */}
        {activeCategory === "All" && !searchQuery && dealOfDay && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12 relative rounded-2xl overflow-hidden group border border-gray-200 bg-white p-0 shadow-md"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-100 z-0"></div>
            
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
            
            <div className="relative z-20 flex flex-col md:flex-row items-start pt-4 pb-8 md:pt-6 md:pb-12 px-8 md:px-12 gap-8">
              <div className="flex-1 w-full space-y-4 md:pt-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-bold border border-red-200 shadow-sm">
                  <Flame className="w-4 h-4" />
                  Deal of the Day
                </div>
                
                <h2 className="text-3xl md:text-5xl font-black leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                    {dealOfDay.name}
                  </span> 
                </h2>
                
                <p className="text-gray-600 max-w-lg text-lg font-medium">
                  Grab this exclusive limited-time offer. Epic items rotation happening soon, don't miss out on {dealOfDay.category.toLowerCase()}!
                </p>
                
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-black text-gray-900">
                    {dealOfDay.price > 0 ? `₹${dealOfDay.price}` : "DM to buy"}
                  </span>
                  {dealOfDay.discount > 0 && dealOfDay.price > 0 && <span className="text-xl text-gray-400 line-through mb-1 font-bold">₹{dealOfDay.originalPrice}</span>}
                  {dealOfDay.discount > 0 && dealOfDay.price > 0 && <span className="text-sm font-bold text-emerald-600 mb-1.5 ml-2 bg-emerald-100 px-2 py-0.5 rounded shadow-sm">{dealOfDay.discount}% OFF</span>}
                </div>
                
                {dealOfDay.price > 0 ? (
                  <button 
                    onClick={() => openPurchaseModal(dealOfDay)}
                    disabled={dealOfDay.isOutOfStock}
                    className={`flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold transition-all duration-300 w-full md:w-auto shadow-sm active:scale-95 ${dealOfDay.isOutOfStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
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
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all duration-300 w-full md:w-auto shadow-md active:scale-95"
                  >
                    <MessageCircle className="w-5 h-5" /> WhatsApp: 6205597789
                  </a>
                )}
              </div>
              
              <div className="flex-1 w-full flex justify-center relative">
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full blur-[60px] opacity-20"></div>
                  <div className="absolute inset-4 rounded-3xl overflow-hidden bg-white border border-gray-200 flex items-center justify-center shadow-xl relative z-10 group-hover:scale-105 transition-transform duration-500 p-0">
                    <img 
                       src={`${SERVER_URL}${dealOfDay.imageUrl}`} 
                       alt={dealOfDay.name} 
                       className="max-w-full max-h-full object-contain pointer-events-none drop-shadow-md"
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
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all whitespace-nowrap active:scale-95 shadow-sm ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-md border border-blue-600" 
                    : "bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500"}`} />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            {activeCategory === "All" ? "Trending Collections" : `${activeCategory} Collection`}
          </h3>
          <span className="text-sm font-medium text-gray-500">Showing {filteredItems.length} items</span>
        </div>

        {/* Store Grid */}
        {loading ? (
            <div className="py-20 flex justify-center">
               <div className="animate-spin text-blue-600"><Loader2 className="w-8 h-8" /></div>
            </div>
        ) : (
            <motion.div 
              layout
              className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
            >
              <AnimatePresence>
                {filteredItems.map((item) => {
                  const isMythic = item.rarity === 'Mythic';
                  const isLegendary = item.rarity === 'Legendary';
                  
                  const RarityIcon = item.category === "Outfits" ? Flame : 
                                    item.category === "Gun Skins" ? Crosshair : 
                                    item.category === "X-Suits" ? Star : 
                                    item.category === "UC" ? Zap : ShieldCheck;

                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="group relative flex flex-col bg-white rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      {/* Item Image Section */}
                      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 flex items-center justify-center border-b border-gray-100">
                        <img 
                          src={`${SERVER_URL}${item.imageUrl}`} 
                          alt={item.name} 
                          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${item.isOutOfStock ? 'grayscale opacity-50' : ''}`}
                        />
                        
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 via-transparent to-transparent opacity-90" />

                        {/* Floating Icon */}
                        <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 z-20">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/90 backdrop-blur-md border border-gray-200 flex items-center justify-center shadow-sm transform -rotate-12 group-hover:rotate-0 transition-transform duration-300">
                             <RarityIcon className={`w-4 h-4 md:w-5 md:h-5 ${isMythic ? 'text-amber-500' : isLegendary ? 'text-fuchsia-500' : 'text-blue-500'}`} />
                          </div>
                        </div>

                        {/* Discount Badge */}
                        {item.discount > 0 && (
                          <div className="absolute top-3 left-3 md:top-4 md:left-4 z-20 bg-red-600 text-white text-[8px] md:text-[10px] font-black px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg shadow-sm flex items-center gap-1 uppercase tracking-tighter">
                            {item.discount}% OFF
                          </div>
                        )}

                        {item.isOutOfStock && (
                            <div className="absolute inset-0 bg-white/80 z-30 flex flex-col items-center justify-center backdrop-blur-[2px]">
                                <PackageX className="w-6 h-6 md:w-8 md:h-8 text-gray-400 mb-2" />
                                <span className="uppercase text-[8px] md:text-[10px] font-black tracking-widest text-gray-500">Out of Stock</span>
                            </div>
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="p-3 md:p-5 bg-white flex flex-col gap-0.5 md:gap-1 relative">
                        <h3 className="text-[11px] md:text-base font-black text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{item.name}</h3>
                        <p className="text-[9px] md:text-xs text-gray-500 font-bold uppercase tracking-widest">
                          {item.category === "UC" ? `${item.price} UC` : `1 ${item.category}`}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2 md:mt-3">
                           <div className="flex flex-col">
                              {item.discount > 0 && (
                                <span className="text-[8px] md:text-[10px] text-gray-400 font-bold line-through">₹{item.originalPrice}</span>
                              )}
                              <span className="text-xs md:text-lg font-black text-gray-900">
                                {item.price > 0 ? `₹${item.price}` : "DM to Buy"}
                              </span>
                           </div>

                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               openPurchaseModal(item);
                             }}
                             disabled={item.isOutOfStock}
                             className={`w-7 h-7 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm active:scale-95 ${item.isOutOfStock ? 'bg-gray-100 text-gray-400 border border-gray-200' : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'}`}
                           >
                             <ArrowRight className="w-3.5 h-3.5 md:w-5 md:h-5" />
                           </button>
                        </div>
                        
                        {/* Hidden Info Button */}
                        {item.description && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAccount(item);
                            }}
                            className="absolute top-2 right-2 md:top-4 md:right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-gray-100 rounded-md hover:bg-gray-200 border border-gray-200"
                          >
                            <Info className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
        )}
        
        {!loading && filteredItems.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 border border-gray-200 shadow-sm">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-black mb-2 text-gray-900">No items found</h3>
            <p className="text-gray-500 font-medium max-w-sm">We couldn't find any items matching your search. Try different keywords or browse all categories.</p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="mt-6 px-6 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg font-bold transition-colors shadow-sm active:scale-95 text-gray-700"
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-xl w-full bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 border border-blue-100 rounded-lg">
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-gray-900">Purchase Item</h3>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{selectedItem.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[80vh]">
                {paymentSuccess ? (
                  <div className="text-center py-12">
                     <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100 shadow-sm">
                        <CheckCircle2 className="w-12 h-12" />
                     </div>
                     <h4 className="text-2xl font-black mb-2 text-gray-900">Payment Successful</h4>
                     <p className="text-gray-500 font-medium">You will get whatsapp message and dm on given number and 6205597789.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitPayment} className="space-y-6">
                    {paymentError && (
                      <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-bold flex items-center gap-3 shadow-sm">
                        <AlertCircle className="h-5 w-5" /> {paymentError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       <div className="p-4 bg-white rounded-2xl flex flex-col items-center justify-center border border-gray-200 shadow-sm">
                          <img src="/qr.png" alt="Scan to pay" className="w-32 h-32 object-contain" />
                          <p className="text-[10px] text-gray-500 mt-2 font-black uppercase tracking-tight">Scan via UPI App</p>
                       </div>
                       
                       <div className="space-y-4">
                          <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm">
                             <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">UPI ID</p>
                             <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-mono font-bold text-gray-900 truncate">{UPI_ID}</span>
                                <button type="button" onClick={handleCopyUPI} className="p-1.5 hover:bg-gray-200 rounded-md transition-colors border border-gray-200 bg-white">
                                   <Copy className="w-3.5 h-3.5 text-gray-600" />
                                </button>
                             </div>
                          </div>
                          
                          <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl shadow-sm">
                             <p className="text-[10px] text-blue-600 uppercase font-black tracking-widest mb-0.5">Amount to Pay</p>
                             <div className="text-2xl font-black text-gray-900">₹{selectedItem.price}</div>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-gray-600 uppercase tracking-widest font-black block">Transaction ID (UTR Number)</label>
                      <input
                        type="text"
                        placeholder="Enter 12-digit ID"
                        required
                        maxLength={12}
                        minLength={12}
                        value={transactionID}
                        onChange={(e) => setTransactionID(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-mono tracking-widest shadow-sm placeholder:text-gray-400 font-bold"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-gray-600 uppercase tracking-widest font-black block">Payment Screenshot</label>
                      <input
                        type="file"
                        accept="image/*"
                        id="store-screenshot"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label 
                        htmlFor="store-screenshot"
                        className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:bg-gray-100 cursor-pointer group transition-colors shadow-sm"
                      >
                         {screenshotPreview ? (
                            <img src={screenshotPreview} className="h-full w-full object-contain p-2 rounded-xl" alt="Preview" />
                         ) : (
                            <div className="flex flex-col items-center gap-2">
                               <Upload className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                               <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Upload Receipt</span>
                            </div>
                         )}
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 disabled:opacity-50"
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
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              className="relative max-w-4xl w-full bg-white rounded-[2rem] border border-gray-200 overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Left Side: Hero Image */}
              <div className="w-full md:w-[40%] bg-gray-50 relative flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-gray-200">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-200 to-transparent opacity-60"></div>
                <div className={`absolute top-8 left-8 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border border-gray-200 bg-white shadow-sm
                  ${selectedAccount.rarity === 'Mythic' ? 'text-amber-600' : 
                    selectedAccount.rarity === 'Legendary' ? 'text-fuchsia-600' : 
                    'text-blue-600'}`}>
                  {selectedAccount.rarity} Account
                </div>
                
                <img 
                  src={`${SERVER_URL}${selectedAccount.imageUrl}`} 
                  alt={selectedAccount.name} 
                  className="relative z-10 max-w-full max-h-full object-contain drop-shadow-md"
                />

                <div className="absolute bottom-8 left-8 right-8 z-20">
                   <h2 className="text-2xl font-black text-gray-900 leading-tight mb-2">{selectedAccount.name}</h2>
                   <div className="text-3xl font-black text-emerald-600">
                      {selectedAccount.price > 0 ? `₹${selectedAccount.price}` : "DM to buy"}
                   </div>
                </div>
              </div>

              {/* Right Side: Details */}
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
                   <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                      <span className="font-black uppercase tracking-tighter text-sm italic text-gray-900">Account Statistics</span>
                   </div>
                   <button 
                     onClick={() => setSelectedAccount(null)}
                     className="p-2 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-900 transition-colors border border-gray-200 bg-white shadow-sm"
                   >
                     <X className="w-5 h-5" />
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar min-h-0 relative">
                   <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white to-transparent pointer-events-none z-10"></div>
                   <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
                   <div className="grid grid-cols-1 gap-6">
                      {parseDescription(selectedAccount.description).map((section, idx) => (
                        <div key={idx} className="space-y-3">
                           <div className="flex items-center gap-2 opacity-70">
                              <section.icon className="w-4 h-4 text-gray-600" />
                              <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{section.category}</span>
                           </div>
                           <div className="flex flex-col gap-1.5">
                              {section.items.map((item, i) => (
                                <div key={i} className="flex items-start gap-3 py-1 group">
                                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0 shadow-sm" />
                                   <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors leading-relaxed uppercase tracking-wide">{item}</span>
                                </div>
                              ))}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-200">
                   {selectedAccount.price > 0 ? (
                      <button 
                        onClick={() => {
                          setSelectedAccount(null);
                          openPurchaseModal(selectedAccount);
                        }}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-sm active:scale-95 transition-all flex items-center justify-center gap-3"
                      >
                         <ShoppingCart className="w-5 h-5" /> Proceed to Purchase
                      </button>
                   ) : (
                      <a 
                        href="https://wa.me/916205597789"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-sm active:scale-95 transition-all flex items-center justify-center gap-3"
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
