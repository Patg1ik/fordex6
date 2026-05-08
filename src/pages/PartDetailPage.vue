<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PartCard from '../components/PartCard.vue'
import { getPartById, getCategoryById, parts, formatPrice, formatMileage } from '../data/parts.js'
import { cart } from '../store/cart.js'

const route  = useRoute()
const router = useRouter()

const part = computed(() => getPartById(route.params.id))
const cat  = computed(() => part.value ? getCategoryById(part.value.category) : null)

const conditionClass = computed(() => {
  const map = { 'Отличное': 'badge-green', 'Хорошее': 'badge-yellow', 'Удовлетворительное': 'badge-orange' }
  return map[part.value?.condition] || 'badge-blue'
})

const related = computed(() => {
  if (!part.value) return []
  return parts.filter(p => p.category === part.value.category && p.id !== part.value.id).slice(0, 3)
})

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3), 16)
  const g = parseInt(hex.slice(3,5), 16)
  const b = parseInt(hex.slice(5,7), 16)
  return `${r},${g},${b}`
}
const imgStyle = computed(() => {
  if (!cat.value) return {}
  const rgb = hexToRgb(cat.value.color)
  return { background: `linear-gradient(135deg, rgba(${rgb},.16) 0%, rgba(${rgb},.04) 100%)` }
})
</script>

<template>
  <div class="part-page">
    <!-- 404 -->
    <div v-if="!part" class="not-found">
      <div class="container">
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <p class="empty-state-title">Запчасть не найдена</p>
          <p class="empty-state-sub">Возможно, она была продана или удалена из каталога</p>
          <router-link to="/catalog" class="btn btn-primary" style="margin-top:20px">Вернуться в каталог</router-link>
        </div>
      </div>
    </div>

    <div v-else>
      <!-- Page header bg -->
      <div class="pd-header" :style="imgStyle">
        <div class="container">
          <div class="breadcrumb">
            <router-link to="/">Главная</router-link>
            <span class="breadcrumb-sep">/</span>
            <router-link to="/catalog">Каталог</router-link>
            <span class="breadcrumb-sep">/</span>
            <router-link :to="`/catalog?cat=${part.category}`">{{ cat.name }}</router-link>
            <span class="breadcrumb-sep">/</span>
            <span>{{ part.sku }}</span>
          </div>
        </div>
      </div>

      <div class="container pd-body">
        <div class="pd-grid">
          <!-- Left: image -->
          <div class="pd-img-col">
            <div class="pd-img" :style="imgStyle">
              <span class="pd-img-emoji">{{ cat.emoji }}</span>
            </div>
            <div class="pd-img-label">
              <span class="badge badge-blue">Артикул: {{ part.sku }}</span>
              <span v-if="part.inStock" class="badge badge-green">В наличии</span>
              <span v-else class="badge badge-red">Нет в наличии</span>
            </div>
          </div>

          <!-- Right: details -->
          <div class="pd-info">
            <div class="pd-cat-badge" :style="{ color: cat.color, background: cat.faint }">
              {{ cat.emoji }} {{ cat.name }}
            </div>

            <h1 class="pd-name">{{ part.name }}</h1>

            <div class="pd-attrs-row">
              <span :class="['badge', conditionClass]">{{ part.condition }}</span>
              <span v-if="part.year"    class="pd-attr">{{ part.year }} г.в.</span>
              <span v-if="part.mileage" class="pd-attr">{{ formatMileage(part.mileage) }}</span>
            </div>

            <div class="pd-price-block">
              <span class="pd-price">{{ formatPrice(part.price) }}</span>
              <span v-if="part.inStock" class="pd-stock-ok">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                Есть в наличии
              </span>
            </div>

            <div class="pd-actions">
              <button
                v-if="part.inStock"
                class="btn btn-primary pd-add-btn"
                :class="cart.isInCart(part.id) ? 'btn-added' : ''"
                @click="cart.isInCart(part.id) ? null : cart.add(part)"
              >
                <svg v-if="!cart.isInCart(part.id)" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {{ cart.isInCart(part.id) ? 'В корзине' : 'В корзину' }}
              </button>

              <router-link to="/contacts" class="btn btn-outline pd-contact-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.22.22h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                </svg>
                Позвонить
              </router-link>
            </div>

            <!-- Description -->
            <div class="pd-desc">
              <h3 class="pd-desc-title">Описание</h3>
              <p class="pd-desc-text">{{ part.description }}</p>
            </div>

            <!-- Specs table -->
            <div v-if="part.specs && Object.keys(part.specs).length" class="pd-specs">
              <h3 class="pd-desc-title">Характеристики</h3>
              <table class="specs-table">
                <tbody>
                  <tr v-for="(val, key) in part.specs" :key="key">
                    <td class="spec-key">{{ key }}</td>
                    <td class="spec-val">{{ val }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Related parts -->
        <div v-if="related.length" class="pd-related">
          <hr class="divider" style="margin-bottom:40px" />
          <div class="shr" style="margin-bottom:24px">
            <h2 class="section-title" style="font-size:22px">Похожие запчасти</h2>
            <router-link :to="`/catalog?cat=${part.category}`" class="btn btn-ghost btn-sm">Смотреть все →</router-link>
          </div>
          <div class="parts-grid">
            <PartCard v-for="p in related" :key="p.id" :part="p" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pd-header { padding: 32px 0 0; border-bottom: 1px solid var(--border); }

.pd-body { padding-top: 36px; padding-bottom: 60px; }

.pd-grid {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 48px;
  margin-bottom: 48px;
}

/* Image column */
.pd-img-col { display: flex; flex-direction: column; gap: 12px; }
.pd-img {
  height: 320px; border-radius: var(--r2);
  border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
}
.pd-img-emoji { font-size: 96px; filter: drop-shadow(0 8px 24px rgba(0,0,0,.5)); }
.pd-img-label { display: flex; gap: 8px; flex-wrap: wrap; }

/* Info column */
.pd-cat-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 12px; border-radius: 999px;
  font-size: 13px; font-weight: 700; letter-spacing: .02em;
  margin-bottom: 12px;
}
.pd-name {
  font-size: 26px; font-weight: 800; color: var(--t1);
  letter-spacing: -.4px; line-height: 1.25;
  margin-bottom: 14px;
}
.pd-attrs-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
.pd-attr { font-size: 13px; color: var(--t2); padding: 3px 10px; background: var(--surface2); border-radius: 999px; }

.pd-price-block { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
.pd-price    { font-size: 36px; font-weight: 900; color: var(--t1); letter-spacing: -1px; }
.pd-stock-ok { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: var(--green); }

.pd-actions { display: flex; gap: 10px; margin-bottom: 32px; flex-wrap: wrap; }
.pd-add-btn     { flex: 1; min-width: 160px; justify-content: center; }
.pd-contact-btn { flex-shrink: 0; }

.btn-added { background: var(--green-f) !important; color: var(--green) !important; cursor: default; }

/* Description */
.pd-desc { margin-bottom: 28px; }
.pd-desc-title { font-size: 14px; font-weight: 700; color: var(--t3); letter-spacing: .06em; text-transform: uppercase; margin-bottom: 10px; }
.pd-desc-text  { font-size: 15px; color: var(--t2); line-height: 1.7; }

/* Specs */
.pd-specs { margin-bottom: 28px; }
.specs-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.specs-table tr { border-bottom: 1px solid var(--border); }
.specs-table tr:last-child { border-bottom: none; }
.spec-key { padding: 10px 0; color: var(--t2); width: 40%; }
.spec-val { padding: 10px 0; color: var(--t1); font-weight: 500; }

/* Related */
.shr       { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.parts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
.not-found  { padding: 60px 0; }

@media (max-width: 900px) {
  .pd-grid { grid-template-columns: 1fr; gap: 28px; }
  .pd-img  { height: 240px; }
  .pd-img-emoji { font-size: 72px; }
  .pd-name  { font-size: 22px; }
  .pd-price { font-size: 28px; }
}
</style>
