<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import PartCard from '../components/PartCard.vue'
import FordModel3D from '../components/FordModel3D.vue'
import { parts, categories } from '../data/parts.js'
import heroImg from '../assets/hero.png'

const router = useRouter()
const cats = computed(() => categories.filter(c => c.id !== 'all'))

function countParts(catId) {
  return parts.filter(p => p.category === catId).length
}

const featured = computed(() =>
  [1, 6, 16, 20, 23, 27, 32, 3].map(id => parts.find(p => p.id === id)).filter(Boolean).slice(0, 6)
)
</script>

<template>
  <div>
  <!-- ── Hero ──────────────────────────────────────────── -->
  <section class="hero">
    <div class="hero-bg" :style="{ backgroundImage: `url(${heroImg})` }" />
    <div class="hero-overlay" />
    <div class="hero-glow" />
    <div class="container hero-inner">
      <div class="hero-content">
        <span class="hero-tag">Ford Explorer 6 · 2019 – 2025</span>
        <h1 class="hero-title">
          Запчасти с разборки<br>
          <span class="hero-accent">Ford Explorer 6</span>
        </h1>
        <p class="hero-sub">
          Оригинальные детали в отличном состоянии — двигатели, АКПП, кузов, электрика.
          Диагностика каждой позиции перед продажей. Доставка по всей России.
        </p>
        <div class="hero-actions">
          <router-link to="/catalog" class="btn btn-primary btn-lg">
            Перейти в каталог
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </router-link>
          <router-link to="/contacts" class="btn btn-outline btn-lg">Связаться с нами</router-link>
        </div>
        <div class="hero-stats">
          <div class="stat"><span class="stat-val">{{ parts.length }}+</span><span class="stat-lbl">Запчастей</span></div>
          <div class="stat-sep" />
          <div class="stat"><span class="stat-val">2019–2025</span><span class="stat-lbl">6-е поколение</span></div>
          <div class="stat-sep" />
          <div class="stat"><span class="stat-val">100%</span><span class="stat-lbl">Оригинал OEM</span></div>
          <div class="stat-sep" />
          <div class="stat"><span class="stat-val">1–5 дн.</span><span class="stat-lbl">Доставка РФ</span></div>
        </div>
      </div>
      <div class="hero-3d">
        <FordModel3D />
      </div>
    </div>
  </section>

  <!-- ── Категории ─────────────────────────────────────── -->
  <section class="section">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">Каталог</span>
        <h2 class="section-title">Запчасти по категориям</h2>
        <p class="section-sub">7 разделов — от двигателя до тормозной системы</p>
      </div>
      <div class="cats-grid">
        <div
          v-for="cat in cats" :key="cat.id"
          class="cat-card"
          :style="{ '--cc': cat.color, '--cf': cat.faint }"
          @click="router.push(`/catalog?cat=${cat.id}`)"
        >
          <span class="cat-emoji">{{ cat.emoji }}</span>
          <div class="cat-info">
            <h3 class="cat-name">{{ cat.name }}</h3>
            <span class="cat-count">{{ countParts(cat.id) }} позиций</span>
          </div>
          <svg class="cat-arr" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </div>
      </div>
    </div>
  </section>

  <!-- ── Популярные запчасти ───────────────────────────── -->
  <section class="section" style="padding-top:0">
    <div class="container">
      <div class="shr">
        <div>
          <span class="section-tag">Популярные</span>
          <h2 class="section-title">Часто покупают</h2>
        </div>
        <router-link to="/catalog" class="btn btn-outline btn-sm">Весь каталог →</router-link>
      </div>
      <div class="parts-grid">
        <PartCard v-for="p in featured" :key="p.id" :part="p" />
      </div>
    </div>
  </section>

  <!-- ── Почему мы ──────────────────────────────────────── -->
  <section class="section why-section">
    <div class="container">
      <div class="section-header" style="text-align:center">
        <span class="section-tag">Преимущества</span>
        <h2 class="section-title">Почему выбирают нас</h2>
      </div>
      <div class="why-grid">
        <div class="why-card">
          <div class="why-icon">🔍</div>
          <h3 class="why-title">Проверка перед продажей</h3>
          <p class="why-text">Каждая запчасть проходит диагностику до отправки клиенту. Никаких сюрпризов при получении.</p>
        </div>
        <div class="why-card">
          <div class="why-icon">📦</div>
          <h3 class="why-title">Быстрая доставка</h3>
          <p class="why-text">Отправляем в день оплаты через ПЭК, СДЭК, Деловые линии. Срок доставки по России 1–5 дней.</p>
        </div>
        <div class="why-card">
          <div class="why-icon">🛡️</div>
          <h3 class="why-title">Только оригинал OEM</h3>
          <p class="why-text">Работаем исключительно с оригинальными запчастями Ford. Никаких аналогов и реплик.</p>
        </div>
        <div class="why-card">
          <div class="why-icon">🔩</div>
          <h3 class="why-title">Узкая специализация</h3>
          <p class="why-text">Занимаемся только Explorer 6-го поколения. Знаем каждый узел этого автомобиля досконально.</p>
        </div>
        <div class="why-card">
          <div class="why-icon">📋</div>
          <h3 class="why-title">Подбор по VIN</h3>
          <p class="why-text">Пришлите VIN-номер — поможем убедиться, что деталь подойдёт именно к вашему автомобилю.</p>
        </div>
        <div class="why-card">
          <div class="why-icon">💬</div>
          <h3 class="why-title">WhatsApp и Telegram</h3>
          <p class="why-text">Отвечаем в мессенджерах в рабочие часы. Удобно — не нужно звонить, просто напишите.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ── CTA баннер ─────────────────────────────────────── -->
  <section class="cta-section">
    <div class="container">
      <div class="cta-card">
        <div>
          <h2 class="cta-title">Нужна конкретная запчасть?</h2>
          <p class="cta-sub">Напишите нам в WhatsApp или Telegram с VIN — подберём деталь в течение часа.</p>
        </div>
        <div class="cta-actions">
          <router-link to="/contacts" class="btn btn-orange btn-lg">Написать нам</router-link>
          <router-link to="/catalog"  class="btn btn-outline btn-lg">Весь каталог</router-link>
        </div>
      </div>
    </div>
  </section>
  </div>
</template>

<style scoped>
/* Hero */
.hero {
  position: relative; overflow: hidden;
}
.hero-bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center 40%; opacity: .12;
}
.hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(160deg, transparent 0%, rgba(9,9,12,.7) 70%);
}
.hero-glow {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 65% 40%, rgba(37,99,255,.13) 0%, transparent 55%);
  pointer-events: none;
}

/* Two-column inner */
.hero-inner {
  position: relative; z-index: 1;
  display: flex;
  align-items: center;
  gap: 48px;
  min-height: 92vh;
  padding-top: 100px;
  padding-bottom: 72px;
}
.hero-content {
  flex: 0 0 38%;
  min-width: 0;
}
.hero-3d {
  flex: 1;
  min-width: 0;
  height: clamp(480px, 72vh, 700px);
}
.hero-tag {
  display: inline-flex;
  padding: 5px 14px;
  background: var(--blue-f); border: 1px solid var(--blue-f2);
  color: var(--blue); border-radius: 999px;
  font-size: 13px; font-weight: 600; letter-spacing: .04em;
  margin-bottom: 22px;
}
.hero-title {
  font-size: clamp(28px, 3.2vw, 52px);
  font-weight: 900; color: var(--t1);
  letter-spacing: -1px; line-height: 1.1;
  margin-bottom: 18px;
}
.hero-accent { color: var(--blue); }
.hero-sub {
  font-size: 15px; color: var(--t2); line-height: 1.7;
  margin-bottom: 32px;
}
.hero-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 48px; }
.hero-stats {
  display: flex; align-items: center;
  background: rgba(255,255,255,.04);
  border: 1px solid var(--border2);
  border-radius: var(--r2);
  overflow: hidden; width: fit-content; max-width: 100%;
}
.stat          { padding: 14px 26px; display: flex; flex-direction: column; gap: 2px; }
.stat-val      { font-size: 19px; font-weight: 800; color: var(--t1); letter-spacing: -.3px; }
.stat-lbl      { font-size: 11px; color: var(--t3); white-space: nowrap; letter-spacing: .02em; }
.stat-sep      { width: 1px; background: var(--border); align-self: stretch; }

/* Categories */
.cats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(238px, 1fr));
  gap: 10px;
}
.cat-card {
  display: flex; align-items: center; gap: 14px;
  padding: 16px 18px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r2); cursor: pointer;
  transition: all .18s;
}
.cat-card:hover { border-color: var(--cc); background: var(--cf); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.4); }
.cat-emoji { font-size: 26px; flex-shrink: 0; }
.cat-info  { flex: 1; min-width: 0; }
.cat-name  { font-size: 14px; font-weight: 700; color: var(--t1); margin-bottom: 2px; }
.cat-count { font-size: 12px; color: var(--t2); }
.cat-arr   { color: var(--t3); flex-shrink: 0; transition: all .15s; }
.cat-card:hover .cat-arr { color: var(--cc); transform: translateX(3px); }

/* Featured header row */
.shr { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 28px; flex-wrap: wrap; }

/* Parts grid */
.parts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }

/* Why */
.why-section { background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.why-grid    { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; margin-top: 36px; }
.why-card    { padding: 24px; background: var(--bg); border: 1px solid var(--border); border-radius: var(--r2); }
.why-icon    { font-size: 26px; margin-bottom: 12px; }
.why-title   { font-size: 15px; font-weight: 700; color: var(--t1); margin-bottom: 8px; }
.why-text    { font-size: 14px; color: var(--t2); line-height: 1.65; }

/* CTA */
.cta-section { padding: 60px 0; }
.cta-card {
  display: flex; align-items: center; justify-content: space-between; gap: 28px;
  padding: 44px;
  background: linear-gradient(135deg, rgba(37,99,255,.12) 0%, rgba(37,99,255,.04) 100%);
  border: 1px solid rgba(37,99,255,.22);
  border-radius: var(--r3); flex-wrap: wrap;
}
.cta-title   { font-size: 24px; font-weight: 800; color: var(--t1); margin-bottom: 8px; letter-spacing: -.3px; }
.cta-sub     { font-size: 15px; color: var(--t2); line-height: 1.6; }
.cta-actions { display: flex; gap: 10px; flex-wrap: wrap; flex-shrink: 0; }

@media (max-width: 960px) {
  .hero-content { flex: none; width: 100%; }
  .hero-inner   { flex-direction: column; min-height: unset; padding-top: 80px; padding-bottom: 0; gap: 0; }
  .hero-3d      { width: 100%; height: 360px; }
}
@media (max-width: 768px) {
  .hero-inner   { padding-top: 64px; }
  .hero-stats   { display: none; }
  .cats-grid    { grid-template-columns: 1fr 1fr; }
  .cta-card     { padding: 28px; flex-direction: column; }
  .cta-actions  { width: 100%; }
  .cta-actions .btn { flex: 1; justify-content: center; }
}
@media (max-width: 480px) {
  .cats-grid { grid-template-columns: 1fr; }
}
</style>
