import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  CheckCircle,
  Truck,
  QrCode,
  Copy,
  Check,
  Banknote,
  Building2,
  CreditCard,
  Loader2
} from "lucide-react";
import { cn } from "../utils/cn";
import type { CartItem } from "../types/cart";
import { sendOrderNotification } from "../utils/telegram";
import abaQrCode from "../assets/aba-qr-code.png";

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onClearCart: () => void;
  lang: "en" | "km";
}

interface FormData {
  paymentMethod: "cash" | "bank";
  notes: string;
}

const Checkout = ({ isOpen, onClose, items, onClearCart, lang }: CheckoutProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    paymentMethod: "bank",
    notes: "",
  });

  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryFee = totalPrice > 50 ? 0 : 3.99;
  const grandTotal = totalPrice + deliveryFee;

  // ABA Bank Account Details
  const bankAccount = {
    accountName: "VICHEA CHANN",
    accountNumber: "014317827",
    khrAccountNumber: "014317828",
    bankName: "ABA Bank",
    swiftCode: "ABAKHPP",
    currency: "USD",
    amount: grandTotal.toFixed(2),
  };

  const orderId = `TN${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;

  const texts = {
    en: {
      title: "Checkout",
      orderSummary: "Order Summary",
      items: "items",
      subtotal: "Subtotal",
      delivery: "Delivery Fee",
      freeDelivery: "Free Delivery",
      total: "Total",
      notes: "Order Notes (Optional)",
      placeOrder: "Order Now",
      processing: "Processing...",
      orderPlaced: "Order Placed!",
      orderSuccess: "Your order has been placed successfully",
      orderNumber: "Order #",
      estimatedDelivery: "Estimated Delivery",
      deliveryTime: "30-45 minutes",
      continueShopping: "Continue Shopping",
      paymentMethod: "Payment Method",
      cashOnDelivery: "Cash on Delivery",
      bankTransfer: "Bank Transfer",
      scanToPay: "Scan QR Code to Pay",
      compatibleBanks: "Scan with ABA, ACLEDA, Wing, Bakong, or any banking app",
      back: "Back",
      copied: "Copied!",
    },
    km: {
      title: "បញ្ជាទិញ",
      orderSummary: "សង្ខេបការបញ្ជាទិញ",
      items: "មុខ",
      subtotal: "សរុបរង",
      delivery: "ថ្លៃដឹកជញ្ជូន",
      freeDelivery: "ដឹកជញ្ជូនឥតគិតថ្លៃ",
      total: "សរុប",
      notes: "កំណត់ចំណាំ (ស្រេចចិត្ត)",
      placeOrder: "បញ្ជាទិញ",
      processing: "កំពុងដំណើរការ...",
      orderPlaced: "បញ្ជាទិញជោគជ័យ!",
      orderSuccess: "ការបញ្ជាទិញរបស់អ្នកបានជោគជ័យ",
      orderNumber: "លេខបញ្ជាទិញ #",
      estimatedDelivery: "ពេលប្រគល់ប៉ាន់ស្មាន",
      deliveryTime: "៣០-៤៥ នាទី",
      continueShopping: "បន្តការទិញទំនិញ",
      paymentMethod: "វិធីបង់ប្រាក់",
      cashOnDelivery: "បង់ប្រាក់ពេលទទួលទំនិញ",
      bankTransfer: "ផ្ទេរតាមធនាគារ",
      scanToPay: "ស្កេន QR ដើម្បីបង់ប្រាក់",
      compatibleBanks: "ស្កេនជាមួយ ABA, ACLEDA, Wing, Bakong, ឬកម្មវិធីធនាគារណាមួយ",
      copied: "បានចម្លង!",
      back: "ត្រឡប់ក្រោយ",
    },
  };

  const t = texts[lang];

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        orderId: orderId,
        items: items.map((item) => ({
          name: item.product.name[lang],
          quantity: item.quantity,
          price: item.product.price,
        })),
        total: grandTotal,
        paymentMethod: formData.paymentMethod as "cash" | "bank",
        notes: formData.notes || undefined,
      };

      await sendOrderNotification(orderData);
      setIsSuccess(true);
      onClearCart();
    } catch (error) {
      console.error("Order submission error:", error);
      alert(lang === "en" ? "Failed to place order. Please try again." : "មិនអាចបញ្ជាទិញបាន។ សូមព្យាយាមម្តងទៀត។");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyAllDetails = () => {
    const details = `🏦 ${bankAccount.bankName}\n📋 Account: ${bankAccount.accountName}\n🔢 Number: ${bankAccount.accountNumber}\n💵 Amount: $${bankAccount.amount}\n📝 Reference: ${orderId}`;
    navigator.clipboard.writeText(details);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 3000);
  };

  const handleContinueShopping = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 rounded-full p-2 text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
              >
                <X className="h-5 w-5" />
              </button>

              {!isSuccess ? (
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 border-b border-emerald-100/60 pb-4">
                    <h2 className={cn(
                      "text-xl font-bold text-slate-900",
                      lang === "km" && "khmer-font"
                    )}>
                      {t.title}
                    </h2>
                  </div>

                  <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    {/* Left: Order Summary */}
                    <div>
                      <h3 className={cn(
                        "mb-4 text-sm font-semibold text-slate-700",
                        lang === "km" && "khmer-font"
                      )}>
                        {t.orderSummary} ({totalItems} {t.items})
                      </h3>

                      <div className="max-h-60 space-y-3 overflow-y-auto pr-2">
                        {items.map((item) => (
                          <div
                            key={item.product.id}
                            className="flex gap-3 rounded-xl border border-emerald-100/60 p-3"
                          >
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-emerald-50">
                              <img
                                src={item.product.image}
                                alt={item.product.name[lang]}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/64";
                                }}
                              />
                            </div>
                            <div className="flex flex-1 flex-col">
                              <h4 className={cn(
                                "text-sm font-semibold text-slate-800",
                                lang === "km" && "khmer-font"
                              )}>
                                {item.product.name[lang]}
                              </h4>
                              <p className="text-xs text-slate-400">
                                {t.items}: {item.quantity}
                              </p>
                              <p className="text-sm font-bold text-emerald-600">
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 space-y-2 rounded-xl bg-emerald-50/50 p-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">{t.subtotal}</span>
                          <span className="font-semibold text-slate-800">
                            ${totalPrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">{t.delivery}</span>
                          <span className="font-semibold text-slate-800">
                            {deliveryFee === 0 ? (
                              <span className="text-emerald-500">{t.freeDelivery}</span>
                            ) : (
                              `$${deliveryFee.toFixed(2)}`
                            )}
                          </span>
                        </div>
                        <div className="border-t border-emerald-100/60 pt-2">
                          <div className="flex justify-between text-base font-bold">
                            <span className="text-slate-800">{t.total}</span>
                            <span className="text-emerald-600">
                              ${grandTotal.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Payment Method */}
                    <div>
                      <form onSubmit={handleSubmit}>
                        <h3 className={cn(
                          "mb-4 text-sm font-semibold text-slate-700",
                          lang === "km" && "khmer-font"
                        )}>
                          {t.paymentMethod}
                        </h3>

                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, paymentMethod: "bank" })}
                              className={cn(
                                "flex items-center justify-center gap-2 rounded-xl border-2 p-3 text-sm font-medium transition-all",
                                formData.paymentMethod === "bank"
                                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                  : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200"
                              )}
                            >
                              <Building2 className="h-4 w-4" />
                              {t.bankTransfer}
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, paymentMethod: "cash" })}
                              className={cn(
                                "flex items-center justify-center gap-2 rounded-xl border-2 p-3 text-sm font-medium transition-all",
                                formData.paymentMethod === "cash"
                                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                  : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200"
                              )}
                            >
                              <Banknote className="h-4 w-4" />
                              {t.cashOnDelivery}
                            </button>
                          </div>

                          {formData.paymentMethod === "bank" && (
                            <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/30 p-4">
                              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                                <QrCode className="h-4 w-4" />
                                {t.scanToPay}
                              </h4>
                              
                              <div className="mb-3 rounded-lg bg-emerald-100/30 p-2 text-center">
                                <p className="text-xs text-emerald-700">
                                  {t.compatibleBanks}
                                </p>
                              </div>
                              
                              {/* QR Code Only */}
                              <div className="flex flex-col items-center">
                                <div className="rounded-xl border-2 border-emerald-200/60 bg-white p-4">
                                  <img
                                    src={abaQrCode}
                                    alt="ABA QR Code"
                                    className="h-48 w-48 object-contain"
                                  />
                                </div>
                              </div>

                              {/* Copy Details Button Only */}
                              <button
                                type="button"
                                onClick={handleCopyAllDetails}
                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-200/60 bg-white px-4 py-2 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
                              >
                                {copiedAll ? (
                                  <>
                                    <Check className="h-4 w-4" />
                                    {t.copied || "Copied!"}
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-4 w-4" />
                                    {lang === "en" ? "Copy Account Details" : "ចម្លងព័ត៌មានគណនី"}
                                  </>
                                )}
                              </button>
                            </div>
                          )}

                          <div>
                            <label className="block text-xs font-medium text-slate-600">
                              {t.notes}
                            </label>
                            <div className="relative mt-1">
                              <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                rows={2}
                                className="w-full rounded-xl border border-emerald-200/60 bg-emerald-50/30 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                placeholder={lang === "en" ? "Special instructions..." : "កំណត់ចំណាំពិសេស..."}
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={cn(
                            "mt-6 w-full rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-200/50 transition-all hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70",
                            lang === "km" && "khmer-font"
                          )}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              {t.processing}
                            </span>
                          ) : (
                            t.placeOrder
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 sm:p-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 animate-ping rounded-full bg-emerald-200/50" />
                    <div className="relative rounded-full bg-emerald-100 p-4">
                      <CheckCircle className="h-16 w-16 text-emerald-500" />
                    </div>
                  </motion.div>

                  <h2 className={cn(
                    "mt-6 text-2xl font-bold text-slate-900",
                    lang === "km" && "khmer-font"
                  )}>
                    {t.orderPlaced}
                  </h2>
                  <p className={cn(
                    "text-sm text-slate-600",
                    lang === "km" && "khmer-font"
                  )}>
                    {t.orderSuccess}
                  </p>

                  <div className="mt-6 w-full max-w-sm rounded-2xl bg-emerald-50/50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">{t.orderNumber}</span>
                      <span className="text-sm font-bold text-emerald-600">{orderId}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-slate-600">{t.estimatedDelivery}</span>
                      <span className="flex items-center gap-1 text-sm font-medium text-slate-800">
                        <Truck className="h-4 w-4 text-emerald-500" />
                        {t.deliveryTime}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between border-t border-emerald-100/60 pt-2">
                      <span className="text-sm text-slate-600">{t.total}</span>
                      <span className="text-lg font-bold text-emerald-600">
                        ${grandTotal.toFixed(2)}
                      </span>
                    </div>
                    {formData.paymentMethod === "bank" && (
                      <div className="mt-2 flex items-center gap-2 border-t border-emerald-100/60 pt-2">
                        <CreditCard className="h-4 w-4 text-emerald-500" />
                        <span className="text-xs text-emerald-600">
                          {lang === "en" ? "ABA Bank Transfer" : "ផ្ទេរតាមធនាគារ ABA"}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleContinueShopping}
                    className="mt-6 rounded-xl bg-emerald-500 px-8 py-3 text-sm font-bold text-white shadow-md shadow-emerald-200/50 transition-colors hover:bg-emerald-400"
                  >
                    {t.continueShopping}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Checkout;