'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  ShoppingCart,
  Search,
  Filter,
  ShoppingBag,
  Trash2,
  ChevronRight,
  CreditCard,
  CheckCircle2,
  PlusCircle,
  Heart,
  Baby,
  Stethoscope,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Eye,
  MapPin,
  Utensils,
  Package,
  Milk,
  Shirt,
  Gamepad2,
  Users,
  AlertCircle,
  Truck,
  ShieldCheck,
  RefreshCw,
  ArrowUpDown
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

// --- THE REAL-WORLD SHOPPING CATALOG (SYNCED FROM GOOGLE SHOPPING) ---
interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  gender: 'boy' | 'girl' | 'unisex'
  image_url: string
}

interface CartItem extends Product {
  quantity: number
}

const ALL_PRODUCTS: Product[] = [
  // User's Must-Have Flagship (LOCAL ASSET)
  { id: 1, name: "Baby T-Shirt (Premium Ruffle Set)", price: 38, category: 'clothing', gender: 'girl', description: 'Creamy white knitted ruffle top with matching headband.', image_url: "/products/baby-tshirt-ruffle.png" },

  // --- REAL GOOGLE SEARCH PRODUCTS (WITH FULLY WORKING, HIGH-QUALITY LINKS) ---
  { id: 101, name: "Mother Sparsh Pure Water Wipes", price: 2.50, category: 'skincare', gender: 'unisex', description: '99% pure water unscented baby wipes.', image_url: "/products/mother-sparsh-wipes.png" },
  { id: 102, name: "Babyhug Advanced Diaper Box", price: 7.50, category: 'gear', gender: 'unisex', description: 'Advanced pant style diaper (Monthly Pack).', image_url: "data:image/webp;base64,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" },
  { id: 103, name: "Aveeno Baby Moisture Wash", price: 10.00, category: 'skincare', gender: 'unisex', description: 'Daily moisture wash and shampoo for sensitive skin.', image_url: "https://www.mybikroy.com/wp-content/uploads/2024/10/InShot_20241021_234844521.jpg" },
  { id: 104, name: "Luvlap Galaxy Premium Stroller", price: 79.00, category: 'gear', gender: 'unisex', description: 'Extra large seating space with smooth shocks.', image_url: "https://erp-image.sgliteasset.com/_next/image?url=https%3A%2F%2Fcdn1.sgliteasset.com%2Fperfectm_1%2Fimages%2Fproduct%2Fproduct-3999931%2Fkofy9DUg65b88689d58e9_1706591881.jpg&w=3840&q=100" },
  { id: 105, name: "BRANDONN Cotton Swaddle Wrap", price: 3.50, category: 'clothing', gender: 'unisex', description: 'Soft newborn wrap (0-9 Months).', image_url: "https://alitools.io/en/showcase/image?url=https%3A%2F%2Fae01.alicdn.com%2Fkf%2FHd8621195a4c347569c703b1b7636aacdp.jpg_480x480.jpg" },
  { id: 106, name: "Mee Mee Little Explorer Pram", price: 45.00, category: 'gear', gender: 'unisex', description: 'Lightweight compact traveler pram.', image_url: "https://themoonbrand.com/cdn/shop/files/MNBGKGD08_B.jpg?v=1749466285&width=1096" },
  { id: 107, name: "CAREIT Electric Baby Swing", price: 82.00, category: 'gear', gender: 'unisex', description: 'Electric rocker with bluetooth sound.', image_url: "https://images-cdn.ubuy.co.in/669622d30e06a63871683e0e-baby-swing-for-infant-electric.jpg" },
  { id: 108, name: "LuvLap Royal Hip Carrier", price: 21.00, category: 'gear', gender: 'unisex', description: 'Ergonomic hip seat baby carrier.', image_url: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcT1WOUB3HmazBv29IBpxqnPVzuS71O6EjeKl5ZcaD3OrcS4lvKL3usF3ucYWP6jIEWYB0ZTzB5NNdOpWVu43MMtwY2vs2e4jzmi9a0PiCyz58kYNjgP5Nc36TJZq7IPjGgyr4ymBHA&usqp=CAc" },
  { id: 109, name: "LuvLap StarShine All-Terrain Stroller", price: 51.00, category: 'gear', gender: 'unisex', description: 'Durable multi-position stroller.', image_url: "https://m.media-amazon.com/images/I/81J8Jw11kkL._AC_UF894,1000_QL80_.jpg" },
  { id: 110, name: "INFANTSO Bouncer & Rocker", price: 44.00, category: 'gear', gender: 'unisex', description: '3-in-1 activity bouncer with toys.', image_url: "https://www.infantso.com/cdn/shop/files/3_46e91efb-584d-4d6b-bd09-7c1a2e4bba1c_1024x1024.png?v=1738738242" },
  { id: 111, name: "Himalaya Healthcare Gift Pack", price: 4.00, category: 'skincare', gender: 'unisex', description: 'Essential skin care starter pack.', image_url: "https://m.media-amazon.com/images/I/71kwVZ-3zML._AC_UF894,1000_QL80_.jpg" },
  { id: 112, name: "TIDY SLEEP 7pcs Cotton Apparel Set", price: 12.50, category: 'clothing', gender: 'unisex', description: 'Pure cotton essential clothing set.', image_url: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/SEPTEMBER/9/yaxPbe51_01f0a3bb50d54b319b5c7e7159c3e123.jpg" },
  { id: 113, name: "VBM 13-in-1 Grooming Set", price: 7.50, category: 'medicine', gender: 'unisex', description: 'Complete infant healthcare grooming kit.', image_url: "https://images-eu.ssl-images-amazon.com/images/I/51z+Zjyf3jL._AC_UL210_SR210,210_.jpg" },
  { id: 114, name: "Chipmunks Newborn Grooming Kit", price: 2.00, category: 'medicine', gender: 'unisex', description: 'Safe nail and hair care for infants.', image_url: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQhTehr3cF261OM3K_hkZ5JSGnT7sPyAMomWWJwPKCxmSG4BV5Uids27xvV1X23YOjfaVauvoHFPqh-QOpFld3XNVmbAUpn" },
  { id: 115, name: "3-Piece Soft Swaddle Blanket", price: 8.00, category: 'clothing', gender: 'unisex', description: 'Breathable and stretchy swaddle pack.', image_url: "https://images-static.nykaa.com/media/catalog/product/2/5/2589fa7JOHNS00003025_3.jpg?tr=w-500" },
  { id: 116, name: "Johnson's Premium Gift Set", price: 18.00, category: 'skincare', gender: 'unisex', description: 'Deluxe hospital bag essentials pack.', image_url: "https://m.media-amazon.com/images/I/61FQYJQJVRL._AC_UF894,1000_QL80_.jpg" },
  { id: 117, name: "Himalaya Basket Gift Pack", price: 11.00, category: 'skincare', gender: 'unisex', description: 'Grand basket of baby care items.', image_url: "https://m.media-amazon.com/images/I/61FQYJQJVRL._AC_UF894,1000_QL80_.jpg" },
  { id: 118, name: "Infantbond 56-in-1 Combo Set", price: 27.50, category: 'gear', gender: 'unisex', description: 'Mammoth newborn essentials big box.', image_url: "https://m.media-amazon.com/images/I/91PhwoVYHdL._AC_UF350,350_QL80_.jpg" },
  { id: 119, name: "GIGGLEBOX Premium Gift Hamper", price: 6.50, category: 'clothing', gender: 'unisex', description: 'Stylish apparel and toy gift hamper.', image_url: "https://m.media-amazon.com/images/I/61bD3N3yT2L._AC_UF894,1000_QL80_.jpg" },
  { id: 120, name: "MyneeMoe 22-Piece Gift Box", price: 52.00, category: 'clothing', gender: 'unisex', description: 'Luxury royal baby gift box collection.', image_url: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQTyVAn_7EFdudIuZRhAl7vICFqublDHHcHSefQG5dsBC-asuZnqAbAoq6UUoo2LCtrrQeR-QcxePYNiYL3ez86IQ-4mvPuHo4sOdRgSFml7-IiQ6bkgDBVNg" },
  { id: 121, name: "EIO 13-Piece Solid Clothing Set", price: 7.50, category: 'clothing', gender: 'unisex', description: 'Soft solids kids clothing gift set.', image_url: "https://www.jiomart.com/images/product/original/rvepppntkw/eio-new-born-baby-clothing-gift-set-13-pieces-mint-product-images-rvepppntkw-0-202309081913.jpg?im=Resize=(1000,1000)" },
  { id: 122, name: "Toddylon 56 Combo Essentials", price: 26.00, category: 'gear', gender: 'unisex', description: 'The ultimate newborn starter pack.', image_url: "https://m.media-amazon.com/images/I/81K0S2PBuBL._AC_UF894,1000_QL80_.jpg" },
  { id: 123, name: "Mother Sparsh Premium Box", price: 5.20, category: 'skincare', gender: 'unisex', description: 'Natural skincare premium gift box.', image_url: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSp95NEtKZUz5Fs5FqUpIh8zQnVY9fL_BcSQHiaOqIXrixSU6KGEOpQIPOBJEOtlgO9F1y2T4ohPmaITWRbQH2c8lYUf5FmtZuzOUP_xEZcPGSloZsGSxA83KO_lBUDyGnlE0qpRTgcOpg&usqp=CAc" },
  { id: 124, name: "Milky Soft Bathing Bar", price: 1.50, category: 'skincare', gender: 'unisex', description: 'Delicate moisturizing soap for soft skin.', image_url: "https://rukminim2.flixcart.com/image/480/640/kruyw7k0/soap/y/p/p/2-150-milky-soft-bathing-bar-mamaearth-original-imag5jv4zcvxxggc.jpeg?q=90" },
];

const CATEGORIES = [
  { id: 'all', label: 'All Store', icon: ShoppingBag, color: 'text-gray-600', bg: 'bg-gray-100' },
  { id: 'clothing', label: 'Fashion', icon: Shirt, color: 'text-pink-600', bg: 'bg-pink-100' },
  { id: 'skincare', label: 'Care', icon: Sparkles, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { id: 'food', label: 'Nutrition', icon: Milk, color: 'text-orange-600', bg: 'bg-orange-100' },
  { id: 'gear', label: 'Gear', icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 'medicine', label: 'Health', icon: Stethoscope, color: 'text-rose-600', bg: 'bg-rose-100' },
]

export default function BabyShop() {
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState<'low' | 'high' | ''>('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [cart, setCart] = useState<CartItem[]>([])
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set())
  const [isBagOpen, setIsBagOpen] = useState(false)
  const { toast } = useToast()

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    toast({ title: "Product Added 🛍️", description: `${product.name} is in your bag.` })
  }

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const toggleSave = (id: number) => {
    setSavedIds(prev => {
      const updated = new Set(prev)
      if (updated.has(id)) updated.delete(id)
      else updated.add(id)
      return updated
    })
  }

  const handleBuyNow = () => {
    if (cart.length === 0) {
      toast({ title: "Cart is empty!", variant: "destructive" });
      return;
    }
    if (!deliveryAddress) {
      toast({ title: "Address Required", description: "Please enter your delivery location.", variant: "destructive" });
      return;
    }
    setIsCheckingOut(true)
    setTimeout(() => {
      setIsCheckingOut(false)
      setShowSuccess(true)
      setCart([])
    }, 2000)
  }

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  const [products, setProducts] = useState<Product[]>(ALL_PRODUCTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const resp = await fetch('http://127.0.0.1:8000/api/products')
        if (resp.ok) {
          const data = await resp.json()
          if (data && data.length > 0) {
            setProducts(data)
          }
        }
      } catch (err) {
        console.error('Failed to fetch products', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (activeCategory === 'all' || p.category === activeCategory)
  ).sort((a, b) => {
    if (sortOrder === "low") return a.price - b.price
    if (sortOrder === "high") return b.price - a.price
    return 0
  })

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-1000 pb-32 min-h-screen bg-blue-100/30">

      {/* Hero Banner Section (Store Photo) */}
      <div className="relative h-[300px] w-full overflow-hidden rounded-b-[4rem] shadow-2xl group">
        <img 
          src="/shop-hero.png" 
          alt="Baby Shop Interior" 
          className="w-full h-full object-cover transition-transform duration-[10000ms] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-blue-900/20 to-transparent flex flex-col justify-end p-12 text-white">
          <div className="space-y-2">
            <Badge className="bg-blue-600 text-white font-black px-4 py-1.5 rounded-full border-none shadow-lg text-[10px] uppercase tracking-widest leading-none">Official Store</Badge>
            <h1 className="text-5xl font-black italic tracking-tighter leading-none">Welcome to BabyCare Shop</h1>
            <p className="text-blue-100 font-bold text-lg opacity-90 max-w-xl">Premium essentials curated for your little one's comfort and care, right at your fingertips.</p>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-10">
        {/* Header Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-10">
          <div className="relative w-full lg:w-[500px] group">
            <Search className="absolute left-5 top-4 h-5 w-5 text-gray-400 group-focus-within:text-pink-600 transition-colors" />
            <Input
              placeholder="Search 25+ real store products..."
              className="pl-14 h-14 rounded-2xl bg-white border-none shadow-xl shadow-gray-100/50 group-focus-within:ring-2 ring-pink-100 text-lg font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-none lg:w-48">
              <ArrowUpDown className="absolute left-4 top-4 h-4 w-4 text-gray-400 pointer-events-none" />
              <select
                className="w-full h-12 pl-10 pr-6 rounded-xl bg-white border-none shadow-lg shadow-gray-100/50 text-sm font-bold appearance-none focus:ring-2 ring-pink-100 transition-all outline-none"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
              >
                <option value="">Sort Price</option>
                <option value="low">Low to High</option>
                <option value="high">High to Low</option>
              </select>
            </div>

            <Sheet open={isBagOpen} onOpenChange={setIsBagOpen}>
              <SheetTrigger asChild>
                <Button size="lg" className="h-12 lg:w-40 rounded-xl bg-slate-900 text-white hover:bg-black font-bold text-sm shadow-xl group flex justify-between px-6">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    <span>Bag</span>
                  </div>
                  {cart.length > 0 && (
                    <Badge className="bg-pink-600 text-white rounded-full ml-1 h-5 min-w-[20px] p-1 flex items-center justify-center text-[10px]">
                      {cart.reduce((a, b) => a + b.quantity, 0)}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="rounded-l-[3rem] border-none shadow-2xl p-0 flex flex-col w-[450px]">
                <SheetHeader className="p-10 bg-white border-b border-gray-50 text-left">
                  <SheetTitle className="text-3xl font-black text-gray-900 tracking-tighter leading-none italic">Shopping Bag</SheetTitle>
                  <SheetDescription className="text-pink-600 font-bold text-xs mt-1 uppercase tracking-widest">Premium choices from Google Shopping.</SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-20">
                      <ShoppingBag className="w-20 h-20 text-gray-200" />
                      <h4 className="text-xl font-bold text-gray-300 italic uppercase tracking-widest text-xs">Bag is empty</h4>
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {cart.map(item => (
                        <li key={item.id} className="flex gap-4 items-center bg-white rounded-2xl p-3 border border-gray-50 shadow-sm animate-in slide-in-from-right-4 transition-all hover:scale-[1.02]">
                          <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                          <div className="flex-1 space-y-1">
                            <h5 className="font-bold text-slate-900 text-sm leading-tight">{item.name}</h5>
                            <p className="text-blue-700 font-extrabold text-lg">${item.price}</p>
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-xs font-bold text-slate-400">Qty: {item.quantity}</span>
                              <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-rose-600 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {cart.length > 0 && (
                  <SheetFooter className="p-10 bg-gray-50/50 border-t border-gray-100">
                    <div className="w-full space-y-6">
                      <div className="flex justify-between items-end">
                        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-1">Total Bill</p>
                        <p className="text-5xl font-black text-gray-900 tracking-tighter italic border-b-4 border-pink-100 pb-1">${cartTotal}</p>
                      </div>

                      <div className="space-y-3">
                        <div className="relative">
                          <MapPin className="absolute left-4 top-4 h-5 w-5 text-pink-500" />
                          <Input
                            placeholder="Your delivery address..."
                            className="pl-12 h-14 rounded-2xl bg-white border-none font-bold text-sm shadow-inner"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                          />
                        </div>

                        <Dialog open={isCheckingOut || showSuccess} onOpenChange={(v) => !v && setShowSuccess(false)}>
                          <DialogTrigger asChild>
                            <Button onClick={handleBuyNow} className="w-full h-16 bg-pink-600 hover:bg-pink-700 text-white rounded-2xl text-lg font-black shadow-xl shadow-pink-100 italic">
                              Place Order <ArrowRight className="ml-2 w-6 h-6" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="rounded-[3rem] p-0 border-none shadow-2xl max-w-lg overflow-hidden">
                            {isCheckingOut ? (
                              <div className="p-16 text-center">
                                <RefreshCw className="w-16 h-16 text-pink-500 animate-spin mx-auto mb-6" />
                                <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase tracking-widest text-xs italic">Syncing with logistics...</h3>
                              </div>
                            ) : showSuccess ? (
                              <div className="p-16 text-center space-y-8">
                                <div className="w-24 h-24 bg-emerald-50 rounded-full mx-auto flex items-center justify-center shadow-xl shadow-emerald-50">
                                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                </div>
                                <div className="space-y-3">
                                  <h3 className="text-3xl font-black text-gray-900 leading-none italic uppercase tracking-tighter">Order Placed!</h3>
                                  <p className="text-gray-400 font-bold text-sm leading-relaxed">Packing your premium items for: <br /> <b className="text-gray-800">{deliveryAddress}</b></p>
                                </div>
                                <Button className="w-full bg-slate-900 h-14 rounded-xl font-bold text-xs uppercase tracking-widest" onClick={() => { setShowSuccess(false); setDeliveryAddress(''); }}>Explore More</Button>
                              </div>
                            ) : null}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </SheetFooter>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth py-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-3 px-8 py-5 rounded-[2rem] font-black transition-all duration-700 border-2 whitespace-nowrap ${activeCategory === cat.id ? `${cat.bg} border-transparent text-gray-900 shadow-2xl scale-[1.03]` : 'bg-white/40 border-gray-50 text-gray-400 hover:border-pink-50 hover:text-gray-600'}`}
            >
              <cat.icon className={`w-5 h-5 ${activeCategory === cat.id ? cat.color : 'opacity-40'}`} />
              <span className="text-[10px] uppercase tracking-[0.2em] italic">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Main Grid View */}
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
          {filteredProducts.map((p, idx) => (
            <div key={p.id} className="group relative animate-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 40}ms` }}>
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-white relative shadow-sm border-[6px] border-white ring-1 ring-gray-100 transition-all duration-1000 group-hover:shadow-[0_20px_50px_rgba(255,182,193,0.3)] group-hover:-translate-y-4">
                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110" />

                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  <Badge className="bg-white/95 backdrop-blur-md text-gray-900 font-black px-4 py-1.5 rounded-full border-none shadow-lg text-[8px] uppercase tracking-widest italic leading-none">In Stock</Badge>
                </div>

                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                  <button onClick={() => addToCart(p)} className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-3xl hover:bg-pink-600 hover:text-white transition-all hover:scale-110 text-gray-400">
                    <PlusCircle className="w-8 h-8" />
                  </button>
                  <button onClick={() => toggleSave(p.id)} className={`h-16 w-16 rounded-full flex items-center justify-center shadow-3xl transition-all hover:scale-110 ${savedIds.has(p.id) ? 'bg-pink-600 text-white' : 'bg-white text-gray-400 hover:text-pink-600'}`}>
                    <Heart className={`w-8 h-8 ${savedIds.has(p.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="pt-6 px-4 text-center space-y-2">
                <h4 className="text-[15px] font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">{p.name}</h4>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl font-black text-blue-900 tracking-tight">
                    <span className="text-sm align-top font-bold text-blue-400 mr-0.5">$</span>
                    {p.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
