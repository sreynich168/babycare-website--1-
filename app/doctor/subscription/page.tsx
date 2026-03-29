'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { CheckCircle2, Crown, Zap, Shield, ArrowRight, CreditCard, Loader2 } from 'lucide-react'

export default function SubscriptionPage() {
  const [trialDaysLeft] = useState(0) // Trial expired (3 days passed)
  const [isSubscribed, setIsSubscribed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('doctor_subscribed') === 'true'
    }
    return false
  })
  const [checkoutStep, setCheckoutStep] = useState<'plans' | 'payment'>('plans')
  const [paymentMethod, setPaymentMethod] = useState('visa')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setIsSubscribed(true)
      localStorage.setItem('doctor_subscribed', 'true')
    }, 2000)
  }

  const paymentDetails = {
    visa: { title: "Card Details", content: "World wide Visa/Mastercard accepted." },
    paypal: { title: "PayPal Account", content: "Send to: Sren CHANMANICH sren / srensreynich122@gmail.com" },
    indianbank: { title: "Indian Bank QR", qr: "/qr_khmer_bank.jpg" },
    khqr: { title: "KHQR (Cambodia)", qr: "/qr_indain bank.jpg" }
  } as any

  if (isSubscribed) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out text-center mt-12">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Crown className="w-12 h-12 text-emerald-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Active Pro Subscription</h1>
        <p className="text-xl text-slate-600">Your account is fully upgraded. Enjoy unlimited access to all features.</p>

        <Card className="mt-8 border-emerald-100 shadow-lg bg-emerald-50">
          <CardContent className="p-6">
            <h3 className="font-bold text-emerald-900 text-lg mb-4">Your Pro Benefits:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center text-emerald-700">
                <CheckCircle2 className="w-5 h-5 mr-3 shrink-0" />
                <span>Unlimited Appointments</span>
              </div>
              <div className="flex items-center text-emerald-700">
                <CheckCircle2 className="w-5 h-5 mr-3 shrink-0" />
                <span>Premium Priority Listing</span>
              </div>
              <div className="flex items-center text-emerald-700">
                <CheckCircle2 className="w-5 h-5 mr-3 shrink-0" />
                <span>Advanced Analytics</span>
              </div>
              <div className="flex items-center text-emerald-700">
                <CheckCircle2 className="w-5 h-5 mr-3 shrink-0" />
                <span>Dedicated Support</span>
              </div>
            </div>
          </CardContent>
          <div className="bg-emerald-100 p-4 text-emerald-800 text-sm font-semibold rounded-b-xl border-t border-emerald-200">
            Payment has been securely processed and funds delivered to your Admin Account.
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Upgrade to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">BabyCare Pro</span>
        </h1>
        <p className="text-xl text-slate-600">Connect with more patients and grow your medical practice.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Trial Status */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl mix-blend-screen pointer-events-none" />
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Zap className="w-6 h-6 mr-3 text-rose-400 fill-rose-400" />
              Free Trial Expired
            </CardTitle>
            <CardDescription className="text-slate-300">Your 3-day trial has ended. Please subscribe to continue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-rose-400">0 Days Remaining</span>
                <span className="text-slate-400">Total: 3 Days</span>
              </div>
              <Progress value={100} className="h-3 bg-slate-700 [&>div]:bg-rose-500" />
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-700">
              <div className="flex items-start">
                <CheckCircle2 className="w-5 h-5 mr-3 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">Basic Profile Listing</p>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="w-5 h-5 mr-3 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">Accept up to 5 bookings</p>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="w-5 h-5 mr-3 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">Standard Chat Features</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Plan */}
        <Card className="border-2 border-blue-500 shadow-xl bg-white relative overflow-hidden transform md:-translate-y-4">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
          <div className="absolute top-4 right-4 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
            RECOMMENDED
          </div>

          <CardHeader>
            <CardTitle className="text-2xl">Professional Plan</CardTitle>
            <div className="mt-4 flex items-baseline text-5xl font-extrabold text-slate-900">
              $49<span className="text-xl text-slate-500 font-semibold ml-1">/mo</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle2 className="w-5 h-5 mr-3 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-slate-700 font-medium">Unlimited Patient Bookings</p>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="w-5 h-5 mr-3 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-slate-700 font-medium">Priority Top Placement in Search</p>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="w-5 h-5 mr-3 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-slate-700 font-medium">Advanced Earning Analytics</p>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="w-5 h-5 mr-3 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-slate-700 font-medium">Verified Shield Badge <Shield className="inline w-4 h-4 text-blue-500 ml-1" /></p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pb-8 pt-4">
            <Button
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg shadow-lg shadow-blue-500/25 font-bold group"
              onClick={() => setCheckoutStep('payment')}
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {checkoutStep === 'payment' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <Card className="w-full max-w-lg shadow-2xl border-0 animate-in zoom-in-95 duration-300">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="text-2xl font-bold flex items-center">
                <CreditCard className="w-6 h-6 mr-3 text-blue-600" /> Secure Checkout
              </CardTitle>
              <CardDescription>Select your payment method below.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-blue-50 p-4 rounded-xl mb-6 border border-blue-100 flex justify-between items-center">
                <span className="font-semibold text-blue-900">BabyCare Pro (1 Month)</span>
                <span className="text-xl font-bold text-blue-700">$49.00</span>
              </div>

              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                <div className="flex items-center space-x-3 border p-4 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                  <RadioGroupItem value="visa" id="visa" />
                  <Label htmlFor="visa" className="font-semibold flex-1 cursor-pointer">VISA / Mastercard</Label>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4" />
                </div>
                <div className="flex items-center space-x-3 border p-4 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="font-semibold flex-1 cursor-pointer">PayPal</Label>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
                </div>
                <div className="flex items-center space-x-3 border p-4 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                  <RadioGroupItem value="indianbank" id="indianbank" />
                  <Label htmlFor="indianbank" className="font-semibold flex-1 cursor-pointer">Indian Bank</Label>
                  <span className="font-bold text-emerald-700">₹ INR</span>
                </div>
                <div className="flex items-center space-x-3 border p-4 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                  <RadioGroupItem value="khqr" id="khqr" />
                  <Label htmlFor="khqr" className="font-semibold flex-1 cursor-pointer">KHQR (Cambodia)</Label>
                  <span className="font-bold text-rose-600">៛ KHR</span>
                </div>
              </RadioGroup>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                  {paymentMethod === 'visa' && <CreditCard className="w-4 h-4 mr-2" />}
                  {paymentMethod === 'paypal' && <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4 mr-2" />}
                  {paymentDetails[paymentMethod]?.title}
                </h4>

                {paymentMethod === 'paypal' ? (
                  <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300 text-center">
                    <p className="font-bold text-blue-800 break-all">{paymentDetails.paypal.content}</p>
                    <p className="text-xs text-slate-500 mt-2">Proceed after manual transfer.</p>
                  </div>
                ) : paymentMethod === 'visa' ? (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600">Enter your card details securely below.</p>
                    <div className="grid grid-cols-2 gap-4">
                      <input className="col-span-2 border rounded-xl h-11 px-4 text-sm" placeholder="Card Number" />
                      <input className="border rounded-xl h-11 px-4 text-sm" placeholder="MM/YY" />
                      <input className="border rounded-xl h-11 px-4 text-sm" placeholder="CVV" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300">
                    <div className="w-48 h-48 bg-white border-4 border-white shadow-sm rounded-2xl flex items-center justify-center overflow-hidden mb-4">
                      <img
                        src={paymentDetails[paymentMethod]?.qr}
                        alt="Payment QR"
                        className="w-full h-full object-contain"
                        onError={(e: any) => { e.target.src = "https://placehold.co/400x400/fff/000?text=Scan+to+Pay" }}
                      />
                    </div>
                    <p className="text-sm font-bold text-slate-700">Scan this QR to pay via {paymentDetails[paymentMethod]?.title}</p>
                    <p className="text-xs text-slate-500 mt-1">Check success notification after scan.</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 border-t p-6 flex gap-4">
              <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setCheckoutStep('plans')} disabled={isProcessing}>
                Cancel
              </Button>
              <Button onClick={handleCheckout} className="flex-[2] h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md" disabled={isProcessing}>
                {isProcessing ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
                ) : (
                  `Pay $49.00 securely`
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
