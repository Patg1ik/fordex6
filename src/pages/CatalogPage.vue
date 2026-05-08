<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PartCard from '../components/PartCard.vue'
import { parts, categories } from '../data/parts.js'

const route  = useRoute()
const router = useRouter()

const search   = ref('')
const sortBy   = ref('default')
const activeCat = ref(route.query.cat || 'all')

watch(() => route.query.cat, val => { activeCat.value = val || 'all' })

function setCategory(id) {
  activeCat.value = id
  router.replace({ query: id !== 'all' ? { cat: id } : {} })
}

const filtered = computed(() => {
  let list = parts

  if (activeCat.value !== 'all') {
    list = list.filter(p => p.category === activeCat.value)
  }

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    )
  }

  switch (sortBy.value) {
    case 'price-asc':  list = [...list].sort((a,b) => a.price - b.price); break
    case 'price-desc': list = [...list].sort((a,b) => b.price - a.price); break
    case 'name':       list = [...list].sort((a,b) => a.name.localeCompare(b.name, 'ru')); break
    case 'stock':      list = [...list].sort((a,b) => (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0)); break
  }

  return list
})
</script>

<template>
  <div class="catalog-page">
    <!-- Page header -->
    <div class="catalog-header">
      <div class="container">
        <div class="breadcrumb">
          <router-link to="/">Главная</router-link>
          <span class="breadcrumb-sep">/</span>
          <span>Каталог</span>
        </div>
        <h1 class="catalog-title">Каталог запчастей</h1>
        <p class="catalog-sub">Ford Explorer 6 (2019–2025) · {{ parts.length }} позиций</p>
      </div>
    </div>

    <div class="container catalog-body">
      <!-- Toolbar -->
      <div class="toolbar">
        <!-- Search -->
        <div class="search-wrap">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            v-model="search"
            class="search-input"
            type="text"
            placeholder="Поиск по названию или артикулу…"
          />
          <button v-if="search" class="search-clear" @click="search = ''">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Sort -->
        <select v-model="sortBy" class="sort-select">
          <option value="default">По умолчанию</option>
          <option value="price-asc">Сначала дешевле</option>
          <option value="price-desc">Сначала дороже</option>
          <option value="name">По алфавиту</option>
          <option value="stock">Сначала в наличии</option>
        </select>
      </div>

      <!-- Category tabs -->
      <div class="cat-tabs-wrap">
        <div class="cat-tabs">
          <button
            v-for="cat in categories" :key="cat.id"
            class="cat-tab"
            :class="{ 'cat-tab--active': activeCat === cat.id }"
            :style="activeCat === cat.id ? { '--tab-color': cat.color, '--tab-faint': cat.faint } : {}"
            @click="setCategory(cat.id)"
          >
            <span v-if="cat.id !== 'all'">{{ cat.emoji }}</span>
            {{ cat.name }}
          </button>
        </div>
      </div>

      <!-- Results count -->
      <div class="results-bar">
        <span class="results-count">
          Найдено: <strong>{{ filtered.length }}</strong> позиций
        </span>
      </div>

      <!-- Grid -->
      <div v-if="filtered.length" class="parts-grid">
        <PartCard v-for="p in filtered" :key="p.id" :part="p" />
      </div>

      <!-- Empty state -->
      <div v-else class="empty-state">
        <div class="empty-state-icon">🔎</div>
        <p class="empty-state-title">Ничего не найдено</p>
        <p class="empty-state-sub">Попробуйте изменить запрос или выбрать другую категорию</p>
        <button class="btn btn-outline btn-sm" style="margin-top:16px" @click="search = ''; setCategory('all')">
          Сбросить фильтры
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.catalog-header {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 40px 0 32px;
}
.catalog-title { font-size: 32px; font-weight: 900; color: var(--t1); letter-spacing: -.5px; margin-bottom: 6px; }
.catalog-sub   { font-size: 15px; color: var(--t2); }

.catalog-body { padding-top: 32px; padding-bottom: 60px; }

/* Toolbar */
.toolbar { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }

.search-wrap {
  flex: 1; min-width: 220px;
  position: relative; display: flex; align-items: center;
}
.search-icon  { position: absolute; left: 14px; color: var(--t3); pointer-events: none; }
.search-input {
  width: 100%; padding: 11px 40px;
  background: var(--surface); border: 1px solid var(--border2);
  border-radius: var(--r); color: var(--t1); font-size: 14px;
  transition: border-color .15s;
}
.search-input:focus  { outline: none; border-color: var(--blue); }
.search-input::placeholder { color: var(--t3); }
.search-clear {
  position: absolute; right: 12px;
  width: 24px; height: 24px; background: var(--surface2);
  border: none; border-radius: 50%; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: var(--t2); transition: all .15s;
}
.search-clear:hover { color: var(--t1); background: var(--border2); }

.sort-select {
  padding: 11px 16px;
  background: var(--surface); border: 1px solid var(--border2);
  border-radius: var(--r); color: var(--t1); font-size: 14px;
  cursor: pointer; appearance: auto;
}
.sort-select:focus { outline: none; border-color: var(--blue); }

/* Category tabs */
.cat-tabs-wrap {
  overflow-x: auto; scrollbar-width: none; margin-bottom: 24px;
  border-bottom: 1px solid var(--border);
}
.cat-tabs-wrap::-webkit-scrollbar { display: none; }
.cat-tabs { display: flex; gap: 2px; padding-bottom: 0; white-space: nowrap; }

.cat-tab {
  padding: 10px 18px;
  background: transparent; border: none;
  font-size: 14px; font-weight: 500; color: var(--t2);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  border-radius: var(--r) var(--r) 0 0;
  transition: all .15s; display: flex; align-items: center; gap: 6px;
}
.cat-tab:hover { color: var(--t1); background: var(--surface2); }
.cat-tab--active {
  color: var(--tab-color, var(--blue)) !important;
  border-bottom-color: var(--tab-color, var(--blue)) !important;
  background: var(--tab-faint, var(--blue-f)) !important;
}

/* Results */
.results-bar   { display: flex; align-items: center; margin-bottom: 20px; }
.results-count { font-size: 14px; color: var(--t2); }
.results-count strong { color: var(--t1); }

/* Grid */
.parts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }

@media (max-width: 600px) {
  .catalog-title { font-size: 24px; }
  .sort-select   { width: 100%; }
}
</style>
