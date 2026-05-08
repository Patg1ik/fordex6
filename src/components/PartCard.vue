<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getCategoryById, formatPrice, formatMileage } from '../data/parts.js'
import { cart } from '../store/cart.js'

const props = defineProps({ part: { type: Object, required: true } })
const router = useRouter()

const cat = computed(() => getCategoryById(props.part.category))

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3), 16)
  const g = parseInt(hex.slice(3,5), 16)
  const b = parseInt(hex.slice(5,7), 16)
  return `${r},${g},${b}`
}

const imgStyle = computed(() => {
  const rgb = hexToRgb(cat.value.color)
  return { background: `linear-gradient(135deg, rgba(${rgb},.18) 0%, rgba(${rgb},.05) 100%)` }
})

const conditionBadge = computed(() => {
  const map = { 'Отличное': 'badge-green', 'Хорошее': 'badge-yellow', 'Удовлетворительное': 'badge-orange' }
  return map[props.part.condition] || 'badge-blue'
})
</script>

<template>
  <article class="pcard" @click="router.push(`/part/${part.id}`)">
    <!-- Image area -->
    <div class="pcard-img" :style="imgStyle">
      <span class="pcard-emoji">{{ cat.emoji }}</span>
      <span v-if="!part.inStock" class="pcard-sold-badge">Нет в наличии</span>
    </div>

    <!-- Content -->
    <div class="pcard-body">
      <div class="pcard-meta">
        <span class="pcard-cat" :style="{ color: cat.color }">{{ cat.name }}</span>
        <span class="pcard-sku">{{ part.sku }}</span>
      </div>

      <h3 class="pcard-name">{{ part.name }}</h3>

      <div class="pcard-attrs">
        <span :class="['badge', conditionBadge]">{{ part.condition }}</span>
        <span v-if="part.year" class="pcard-attr">{{ part.year }} г.</span>
        <span v-if="part.mileage" class="pcard-attr">{{ formatMileage(part.mileage) }}</span>
      </div>
    </div>

    <!-- Footer -->
    <div class="pcard-foot">
      <div class="pcard-price-wrap">
        <span class="pcard-price">{{ formatPrice(part.price) }}</span>
        <span v-if="part.inStock" class="pcard-stock">● В наличии</span>
      </div>
      <button
        class="pcard-btn"
        :class="cart.isInCart(part.id) ? 'pcard-btn--active' : ''"
        @click.stop="cart.isInCart(part.id) ? null : cart.add(part)"
      >
        {{ cart.isInCart(part.id) ? '✓ В корзине' : 'В корзину' }}
      </button>
    </div>
  </article>
</template>

<style scoped>
.pcard {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r2);
  overflow: hidden;
  cursor: pointer;
  transition: transform .2s, border-color .2s, box-shadow .2s;
  display: flex;
  flex-direction: column;
}
.pcard:hover {
  transform: translateY(-3px);
  border-color: var(--border2);
  box-shadow: 0 12px 32px rgba(0,0,0,.5);
}

.pcard-img {
  height: 160px;
  display: flex; align-items: center; justify-content: center;
  position: relative;
  flex-shrink: 0;
}
.pcard-emoji { font-size: 52px; filter: drop-shadow(0 4px 12px rgba(0,0,0,.4)); }
.pcard-sold-badge {
  position: absolute; top: 10px; right: 10px;
  background: rgba(0,0,0,.75); color: var(--t2);
  font-size: 11px; font-weight: 600;
  padding: 3px 8px; border-radius: 6px;
  backdrop-filter: blur(4px);
}

.pcard-body { padding: 16px 16px 0; flex: 1; }
.pcard-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.pcard-cat  { font-size: 12px; font-weight: 700; letter-spacing: .02em; }
.pcard-sku  { font-size: 11px; color: var(--t3); }

.pcard-name {
  font-size: 14px; font-weight: 600; color: var(--t1);
  line-height: 1.4; margin-bottom: 10px;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

.pcard-attrs { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.pcard-attr { font-size: 12px; color: var(--t2); }

.pcard-foot {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  padding: 14px 16px;
  margin-top: 12px;
  border-top: 1px solid var(--border);
}

.pcard-price-wrap { display: flex; flex-direction: column; gap: 2px; }
.pcard-price { font-size: 17px; font-weight: 800; color: var(--t1); }
.pcard-stock { font-size: 11px; color: var(--green); font-weight: 600; }

.pcard-btn {
  padding: 7px 14px;
  background: var(--blue-f);
  border: 1px solid var(--blue-f2);
  border-radius: 8px;
  font-size: 12px; font-weight: 600; color: var(--blue);
  white-space: nowrap;
  transition: all .15s;
}
.pcard-btn:hover { background: var(--blue); color: #fff; }
.pcard-btn--active { background: var(--green-f); border-color: transparent; color: var(--green); }
.pcard-btn--active:hover { background: var(--green-f); color: var(--green); cursor: default; }
</style>
