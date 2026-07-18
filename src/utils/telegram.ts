const TELEGRAM_BOT_TOKEN = "8595782308:AAFQW-v32c8NtPDJev3nj03eM_AYNfAlb50";
const TELEGRAM_CHAT_ID = "-1003772657604";

// Exchange rate: 1 USD = 4,000 Riel
const EXCHANGE_RATE = 4000;

// Convert Riel to USD
const convertRielToUSD = (rielAmount: number): number => {
  return rielAmount / EXCHANGE_RATE;
};

// Format price in both currencies
const formatPriceBoth = (rielAmount: number): string => {
  const usdAmount = convertRielToUSD(rielAmount);
  return `៛${rielAmount.toLocaleString()} ($${usdAmount.toFixed(2)})`;
};

export interface OrderData {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  paymentMethod: "cash" | "bank";
  notes?: string;
  invoiceUrl?: string;
}

// Send order notification to Telegram with invoice link
export const sendOrderNotification = async (orderData: OrderData) => {
  try {
    const message = formatOrderMessage(orderData);
    
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send Telegram notification");
    }

    return await response.json();
  } catch (error) {
    console.error("Telegram notification error:", error);
    return null;
  }
};

// Format order message for Telegram with both Riel and USD
const formatOrderMessage = (order: OrderData): string => {
  const itemsList = order.items
    .map(
      (item, index) =>
        `${index + 1}. ${item.name} x ${item.quantity} = ${formatPriceBoth(item.price * item.quantity)}`
    )
    .join("\n");

  const paymentMethod = order.paymentMethod === "cash" ? "Cash on Delivery" : "Bank Transfer (ABA)";

  let message = `
🛍️ NEW ORDER!
----------------------------------------
📋 Order Details
Order ID: ${order.orderId}
Payment: ${paymentMethod}
----------------------------------------
👤 Customer Information
Name: ${order.customerName}
Phone: ${order.phone}
Address: ${order.address}
----------------------------------------
📦 Order Items
${itemsList}
----------------------------------------
💰 Total Amount
${formatPriceBoth(order.total)}
${order.notes ? `\n📝 Notes:\n${order.notes}` : ""}
`;

  // Add invoice download link if available
  if (order.invoiceUrl) {
    message += `\n📄 Download Invoice:\n${order.invoiceUrl}`;
  }

  message += `\n----------------------------------------\n⏰ ${new Date().toLocaleString()}`;

  return message;
};

// Send invoice file to Telegram
export const sendInvoiceFile = async (orderId: string, pdfBlob: Blob) => {
  try {
    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('document', pdfBlob, `invoice-${orderId}.pdf`);
    formData.append('caption', `📄 Invoice for Order #${orderId}`);

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to send invoice file to Telegram");
    }

    return await response.json();
  } catch (error) {
    console.error("Telegram invoice file error:", error);
    return null;
  }
};

// Send simple message to Telegram
export const sendTelegramMessage = async (message: string) => {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Telegram message error:", error);
    return false;
  }
};

// Test bot connection
export const testTelegramBot = async () => {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`);
    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error("Telegram bot test failed:", error);
    return false;
  }
};