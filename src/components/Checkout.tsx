import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  CheckCircle,
  QrCode,
  Copy,
  Check,
  Banknote,
  Building2,
  Loader2,
  User,
  Phone,
  MapPin,
  Download
} from "lucide-react";
import { cn } from "../utils/cn";
import type { CartItem } from "../types/cart";
import { sendOrderNotification, sendInvoiceFile } from "../utils/telegram";
import abaQrCode from "../assets/aba-qr-code.png";
import logo from "../assets/logo.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onClearCart: () => void;
  lang: "en" | "km";
}

interface FormData {
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: "cash" | "bank";
  notes: string;
}

const Checkout = ({ isOpen, onClose, items, onClearCart, lang }: CheckoutProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  const [grandTotal, setGrandTotal] = useState(0); // Store total separately
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    phone: "",
    address: "",
    paymentMethod: "bank",
    notes: "",
  });

  // Calculate total from current items
  const calculateTotal = (items: CartItem[]) => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  // Use the stored grandTotal for display, or calculate from items
  const totalPrice = grandTotal || calculateTotal(orderItems) || calculateTotal(items);
  const bankAccount = {
    accountName: "VICHEA CHANN",
    accountNumber: "014317827",
    khrAccountNumber: "014317828",
    bankName: "ABA Bank",
    swiftCode: "ABAKHPP",
    currency: "USD",
    amount: totalPrice.toFixed(2),
  };

  const orderId = `TN${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;
  const orderDate = new Date().toLocaleString();

  const texts = {
    en: {
      title: "Checkout",
      orderSummary: "Order Summary",
      items: "items",
      total: "Total",
      notes: "Order Notes (Optional)",
      placeOrder: "Place Order",
      processing: "Processing...",
      orderPlaced: "Order Placed!",
      orderSuccess: "Your order has been placed successfully",
      orderNumber: "Order #",
      estimatedDelivery: "Estimated Delivery",
      deliveryTime: "30-45 minutes",
      continueShopping: "Continue Shopping",
      paymentMethod: "Payment Method",
      cashOnDelivery: "Cash on Delivery",
      bankTransfer: "Bank Transfer (ABA)",
      scanToPay: "Scan QR Code to Pay",
      compatibleBanks: "Scan with ABA, ACLEDA, Wing, Bakong, or any banking app",
      back: "Back",
      customerName: "Full Name",
      phone: "Phone Number",
      address: "Delivery Address",
      personalInfo: "Personal Information",
      required: "Required",
      downloadInvoice: "Download Invoice (PDF)",
      invoice: "INVOICE",
      orderDetails: "Order Details",
      customerDetails: "Customer Details",
      paymentDetails: "Payment Details",
      item: "Item",
      qty: "Qty",
      price: "Price",
      subtotal: "Subtotal",
      amount: "Amount",
      thankYou: "Thank you for your order!",
      formalThankYou: "We sincerely appreciate your trust in choosing our products. Your order has been confirmed and will be processed with the utmost care. We look forward to serving you again.",
      email: "hello@treyngeatneakmae.com",
      location: "Phnom Penh, Cambodia",
    },
    km: {
      title: "បញ្ជាទិញ",
      orderSummary: "សង្ខេបការបញ្ជាទិញ",
      items: "មុខ",
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
      bankTransfer: "ផ្ទេរតាមធនាគារ (ABA)",
      scanToPay: "ស្កេន QR ដើម្បីបង់ប្រាក់",
      compatibleBanks: "ស្កេនជាមួយ ABA, ACLEDA, Wing, Bakong, ឬកម្មវិធីធនាគារណាមួយ",
      back: "ត្រឡប់ក្រោយ",
      customerName: "ឈ្មោះពេញ",
      phone: "លេខទូរស័ព្ទ",
      address: "អាសយដ្ឋានទទួលទំនិញ",
      personalInfo: "ព័ត៌មានផ្ទាល់ខ្លួន",
      required: "ត្រូវការ",
      downloadInvoice: "ទាញយកវិក្កយបត្រ (PDF)",
      invoice: "វិក្កយបត្រ",
      orderDetails: "ព័ត៌មានបញ្ជាទិញ",
      customerDetails: "ព័ត៌មានអតិថិជន",
      paymentDetails: "ព័ត៌មានការបង់ប្រាក់",
      item: "មុខម្ហូប",
      qty: "ចំនួន",
      price: "តម្លៃ",
      subtotal: "សរុបរង",
      amount: "ចំនួនទឹកប្រាក់",
      thankYou: "សូមអរគុណសម្រាប់ការបញ្ជាទិញរបស់អ្នក!",
      formalThankYou: "យើងខ្ញុំសូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅចំពោះការទុកចិត្តរបស់អ្នកក្នុងការជ្រើសរើសផលិតផលរបស់យើង។ ការបញ្ជាទិញរបស់អ្នកត្រូវបានបញ្ជាក់ និងនឹងត្រូវបានដំណើរការដោយយកចិត្តទុកដាក់បំផុត។ យើងខ្ញុំសូមរង់ចាំបម្រើសេវាកម្មអ្នកម្តងទៀត។",
      email: "hello@treyngeatneakmae.com",
      location: "ភ្នំពេញ, កម្ពុជា",
    },
  };

  const t = texts[lang];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Generate PDF and send to Telegram
  const generateAndSendInvoice = async (_itemsToSend: CartItem[]) => {
    if (!invoiceRef.current) return null;

    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const pdfBlob = pdf.output('blob');
      await sendInvoiceFile(orderId, pdfBlob);
      
      return `Invoice #${orderId} sent to Telegram`;
    } catch (error) {
      console.error('Error generating invoice:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      alert(lang === "en" ? "Please fill in all required fields" : "សូមបំពេញព័ត៌មានដែលត្រូវការទាំងអស់");
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate total BEFORE clearing anything
      const calculatedTotal = calculateTotal(items);
      setGrandTotal(calculatedTotal);
      
      // Store items in state before clearing
      const itemsCopy = [...items];
      setOrderItems(itemsCopy);
      
      // Prepare order data for Telegram
      const orderData = {
        orderId: orderId,
        customerName: formData.customerName,
        phone: formData.phone,
        address: formData.address,
        items: itemsCopy.map((item) => ({
          name: item.product.name[lang],
          quantity: item.quantity,
          price: item.product.price,
        })),
        total: calculatedTotal, // Use the calculated total
        paymentMethod: formData.paymentMethod as "cash" | "bank",
        notes: formData.notes || undefined,
      };

      // Send notification to Telegram
      await sendOrderNotification(orderData);
      
      // Clear cart
      onClearCart();
      setIsSuccess(true);

      // Generate and send invoice PDF to Telegram after a short delay
      setTimeout(async () => {
        await generateAndSendInvoice(itemsCopy);
      }, 1000);

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
    setOrderItems([]);
    setGrandTotal(0);
    onClose();
  };

  const downloadInvoice = async () => {
    if (!invoiceRef.current) return;
    
    setIsDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${orderId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(lang === "en" ? "Failed to download invoice. Please try again." : "មិនអាចទាញយកវិក្កយបត្របានទេ។ សូមព្យាយាមម្តងទៀត។");
    } finally {
      setIsDownloading(false);
    }
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
                // Checkout Form
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
                    <div className="space-y-6">
                      <div>
                        <h3 className={cn(
                          "mb-4 text-sm font-semibold text-slate-700",
                          lang === "km" && "khmer-font"
                        )}>
                          {t.orderSummary} ({items.reduce((sum, item) => sum + item.quantity, 0)} {t.items})
                        </h3>

                        <div className="max-h-40 space-y-3 overflow-y-auto pr-2">
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

                        <div className="mt-4 rounded-xl bg-emerald-50/50 p-4">
                          <div className="flex justify-between text-base font-bold">
                            <span className="text-slate-800">{t.total}</span>
                            <span className="text-emerald-600">
                              ${calculateTotal(items).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className={cn(
                          "mb-4 text-sm font-semibold text-slate-700",
                          lang === "km" && "khmer-font"
                        )}>
                          {t.personalInfo}
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-600">
                              {t.customerName} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative mt-1">
                              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                              <input
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleInputChange}
                                className="w-full rounded-xl border border-emerald-200/60 bg-emerald-50/30 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                placeholder={lang === "en" ? "your name" : "ឈ្មោះរបស់អ្នក"}
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-600">
                              {t.phone} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative mt-1">
                              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full rounded-xl border border-emerald-200/60 bg-emerald-50/30 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                placeholder={lang === "en" ? "your phone number" : "លេខទូរសព្ទរបស់អ្នក"}
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-600">
                              {t.address} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative mt-1">
                              <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full rounded-xl border border-emerald-200/60 bg-emerald-50/30 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                placeholder={lang === "en" ? "your address" : "អាសយដ្ឋានរបស់អ្នក"}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
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
                              
                              <div className="flex flex-col items-center">
                                <div className="rounded-xl border-2 border-emerald-200/60 bg-white p-4">
                                  <img
                                    src={abaQrCode}
                                    alt="ABA QR Code"
                                    className="h-48 w-48 object-contain"
                                  />
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={handleCopyAllDetails}
                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-200/60 bg-white px-4 py-2 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
                              >
                                {copiedAll ? (
                                  <>
                                    <Check className="h-4 w-4" />
                                    {lang === "en" ? "Copied!" : "ចម្លងរួច!"}
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
                // Success State
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col items-center">
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
                      "mt-4 text-2xl font-bold text-slate-900",
                      lang === "km" && "khmer-font"
                    )}>
                      {t.orderPlaced}
                    </h2>
                    
                    <div className="mt-3 max-w-md text-center">
                      <p className={cn(
                        "text-sm text-slate-600 leading-relaxed",
                        lang === "km" && "khmer-font"
                      )}>
                        {t.formalThankYou}
                      </p>
                    </div>

                    <button
                      onClick={downloadInvoice}
                      disabled={isDownloading}
                      className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-200/50 transition-colors hover:bg-emerald-400 disabled:opacity-50"
                    >
                      {isDownloading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      {t.downloadInvoice}
                    </button>

{/* Invoice Preview - Premium Design */}
<div 
  ref={invoiceRef} 
  className="fixed left-[-9999px] top-0 bg-white" 
  style={{ width: '210mm', position: 'absolute', left: '-9999px', top: 0, zIndex: -1 }}
>
  <div className="p-8" style={{ fontFamily: 'Arial, sans-serif' }}>
    {/* Top Decorative Bar */}
    <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 rounded-full mb-6" />

    {/* Header */}
    <div className="flex items-center justify-between border-b-2 border-emerald-100 pb-6">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-xl overflow-hidden shadow-lg shadow-emerald-100/50 border-2 border-emerald-50/80">
          <img src={logo} alt="Logo" className="h-full w-full object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-emerald-600 tracking-tight">{t.invoice}</h1>
          <p className="text-sm text-slate-400 font-medium">#{orderId}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-slate-800">Treyngeat Neak Mae</p>
        <p className="text-xs text-slate-400 mt-0.5">{orderDate}</p>
        <div className="mt-1 flex items-center justify-end gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-medium text-emerald-600">Verified</span>
        </div>
      </div>
    </div>

    {/* Customer & Payment Details */}
    <div className="mt-6 grid grid-cols-2 gap-4">
      <div className="rounded-xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/50 to-white p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-slate-700">{t.customerDetails}</h3>
        </div>
        <div className="space-y-1.5 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-xs font-medium w-14">Name</span>
            <span className="text-slate-800 font-medium">: {formData.customerName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-xs font-medium w-14">Phone</span>
            <span className="text-slate-800">: {formData.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-xs font-medium w-14">Address</span>
            <span className="text-slate-800">: {formData.address}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/50 to-white p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-slate-700">{t.paymentDetails}</h3>
        </div>
        <div className="space-y-1.5 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-xs font-medium w-14">Method</span>
            <span className="text-slate-800">: {formData.paymentMethod === "bank" ? "ABA Bank Transfer" : "Cash on Delivery"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-xs font-medium w-14">Status</span>
            <span className="text-emerald-600 font-medium">: ● Pending</span>
          </div>
          {formData.paymentMethod === "bank" && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-xs font-medium w-14">Account</span>
              <span className="text-slate-800 font-mono">: {bankAccount.accountNumber}</span>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Order Items */}
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
          <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-sm font-bold text-slate-700">{t.orderDetails}</h3>
        <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
          {orderItems.length} {t.items}
        </span>
      </div>

      {orderItems.length > 0 ? (
        <div className="rounded-xl border border-emerald-200/60 overflow-hidden shadow-sm">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-emerald-50 to-teal-50/50 border-b-2 border-emerald-200/60">
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">{t.item}</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">{t.qty}</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">{t.price}</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">{t.subtotal}</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, index) => (
                <tr 
                  key={item.product.id} 
                  className={cn(
                    "border-b border-slate-100 transition-colors",
                    index % 2 === 0 ? "bg-white" : "bg-emerald-50/20"
                  )}
                >
                  <td className="px-4 py-3 text-slate-800 font-medium">{item.product.name[lang]}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center bg-emerald-100 text-emerald-700 font-bold text-xs w-6 h-6 rounded-full">
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600">${item.product.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-800">${(item.product.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border-t-2 border-emerald-200">
                <td colSpan={3} className="px-4 py-4 text-right font-bold text-slate-800 text-base">
                  {t.total}
                </td>
                <td className="px-4 py-4 text-right font-extrabold text-emerald-600 text-lg">
                  ${grandTotal.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-sm text-slate-500">No items in order</p>
        </div>
      )}
    </div>

    {/* Notes */}
    {formData.notes && (
      <div className="mt-4 p-4 rounded-xl border border-amber-200/60 bg-amber-50/30">
        <div className="flex items-start gap-2">
          <svg className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <div>
            <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider">Notes</h3>
            <p className="text-sm text-slate-600 mt-0.5">{formData.notes}</p>
          </div>
        </div>
      </div>
    )}

    {/* Footer */}
    <div className="mt-8 pt-6 border-t-2 border-emerald-100">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="h-0.5 w-8 bg-emerald-200" />
          <span className="text-sm font-bold text-emerald-600">{t.thankYou}</span>
          <span className="h-0.5 w-8 bg-emerald-200" />
        </div>
        <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
          {t.formalThankYou}
        </p>
        <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-slate-400">
          <span>📧 {texts[lang].email}</span>
          <span className="h-3 w-px bg-slate-300" />
          <span>📱 {texts[lang].phone}</span>
          <span className="h-3 w-px bg-slate-300" />
          <span>📍 {texts[lang].location}</span>
        </div>
        <p className="mt-3 text-[10px] text-slate-400">
          Treyngeat Neak Mae © {new Date().getFullYear()}
        </p>
      </div>
    </div>

    {/* Bottom Decorative Bar */}
    <div className="mt-4 h-1 w-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 rounded-full" />
  </div>
</div>

                    <button
                      onClick={handleContinueShopping}
                      className="mt-6 rounded-xl bg-emerald-500 px-8 py-3 text-sm font-bold text-white shadow-md shadow-emerald-200/50 transition-colors hover:bg-emerald-400"
                    >
                      {t.continueShopping}
                    </button>
                  </div>
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