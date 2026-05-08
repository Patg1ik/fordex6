import { reactive, watch } from 'vue'

const STORAGE_KEY = 'fe6-cart'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const cart = reactive({
  items: load(),

  add(part) {
    const existing = this.items.find(i => i.id === part.id)
    if (existing) {
      existing.qty += 1
    } else {
      this.items.push({ id: part.id, name: part.name, price: part.price, category: part.category, qty: 1 })
    }
  },

  remove(id) {
    const idx = this.items.findIndex(i => i.id === id)
    if (idx !== -1) this.items.splice(idx, 1)
  },

  updateQty(id, qty) {
    const item = this.items.find(i => i.id === id)
    if (!item) return
    if (qty < 1) this.remove(id)
    else item.qty = qty
  },

  clear() {
    this.items.splice(0)
  },

  isInCart(id) {
    return this.items.some(i => i.id === id)
  },

  get count() {
    return this.items.reduce((acc, i) => acc + i.qty, 0)
  },

  get total() {
    return this.items.reduce((acc, i) => acc + i.price * i.qty, 0)
  },
})

watch(
  () => JSON.stringify(cart.items),
  val => { localStorage.setItem(STORAGE_KEY, val) },
)
