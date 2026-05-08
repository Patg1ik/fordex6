const TOKEN = import.meta.env.VITE_TG_TOKEN
const CHAT  = import.meta.env.VITE_TG_CHAT_ID

export async function sendOrder({ name, phone, message, cartItems, total }) {
  if (!TOKEN || !CHAT) throw new Error('Telegram не настроен: заполните VITE_TG_TOKEN и VITE_TG_CHAT_ID в файле .env')

  let text = `🛒 <b>Новая заявка — FordEx6</b>\n\n`
  text += `👤 <b>Имя:</b> ${name}\n`
  text += `📱 <b>Телефон:</b> ${phone}\n`
  if (message.trim()) text += `💬 <b>Сообщение:</b> ${message.trim()}\n`

  if (cartItems.length > 0) {
    text += `\n<b>Товары в корзине:</b>\n`
    for (const item of cartItems) {
      const line = `• ${item.name} — ${fmt(item.price)} × ${item.qty} = ${fmt(item.price * item.qty)}`
      text += line + '\n'
    }
    text += `\n💰 <b>Итого: ${fmt(total)}</b>`
  }

  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT, text, parse_mode: 'HTML' }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.description || `HTTP ${res.status}`)
  }
}

function fmt(price) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price)
}
