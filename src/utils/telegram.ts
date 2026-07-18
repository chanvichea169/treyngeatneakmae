const TELEGRAM_BOT_TOKEN = "8595782308:AAFQW-v32c8NtPDJev3nj03eM_AYNfAlb50";
const TELEGRAM_CHAT_ID = "-1003772657604";

export interface OrderData {
  orderId: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  paymentMethod: "cash" | "bank";
  notes?: string;
}

// Send order notification to Telegram
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

// Format order message for Telegram - All White/Plain Text
const formatOrderMessage = (order: OrderData): string => {
  const itemsList = order.items
    .map(
      (item, index) =>
        `${index + 1}. ${item.name} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`
    )
    .join("\n");

  const paymentMethod = order.paymentMethod === "cash" ? "Cash on Delivery" : "Bank Transfer";

  return `
NEW ORDER!
----------------------------------------
Order Details
Order ID: ${order.orderId}
Payment: ${paymentMethod}
----------------------------------------
Order Items
${itemsList}
----------------------------------------
Total Amount
$${order.total.toFixed(2)}
${order.notes ? `\nNotes:\n${order.notes}` : ""}
----------------------------------------
${new Date().toLocaleString()}
  `;
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