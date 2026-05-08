<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { cart } from '../store/cart.js'
import { formatPrice } from '../data/parts.js'

const mobileOpen = ref(false)
const cartOpen   = ref(false)
const router = useRouter()

router.afterEach(() => { mobileOpen.value = false })

function goCheckout() {
  cartOpen.value = false
  router.push('/contacts')
}
</script>

<template>
  <header class="navbar">
    <div class="container navbar-inner">
      <router-link to="/" class="logo">
        <div class="logo-icon">FE</div>
        <div class="logo-text">
          <span class="logo-main">FordEx<span class="logo-six">6</span></span>
          <span class="logo-sub">Запчасти с разборки</span>
        </div>
      </router-link>

      <nav class="nav">
        <router-link to="/"        class="nav-link" active-class="nav-active" exact>Главная</router-link>
        <router-link to="/catalog" class="nav-link" active-class="nav-active">Каталог</router-link>
        <router-link to="/contacts" class="nav-link" active-class="nav-active">Контакты</router-link>
      </nav>

      <div class="navbar-right">
        <button class="cart-btn" @click="cartOpen = true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          <span v-if="cart.count > 0" class="cart-badge">{{ cart.count }}</span>
        </button>
        <button class="mobile-btn" @click="mobileOpen = !mobileOpen">
          <svg v-if="!mobileOpen" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
          <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>

    <nav class="mobile-nav" :class="{ 'mobile-nav--open': mobileOpen }">
      <router-link to="/"        class="mobile-link" @click="mobileOpen = false">Главная</router-link>
      <router-link to="/catalog" class="mobile-link" @click="mobileOpen = false">Каталог</router-link>
      <router-link to="/contacts" class="mobile-link" @click="mobileOpen = false">Контакты</router-link>
    </nav>
  </header>

  <Teleport to="body">
    <transition name="overlay">
      <div v-if="cartOpen" class="cart-overlay" @click="cartOpen = false" />
    </transition>
    <transition name="sidebar">
      <aside v-if="cartOpen" class="cart-sidebar">
        <div class="cart-head">
          <h2 class="cart-title">
            Корзина <span v-if="cart.count" class="cart-count">{{ cart.count }}</span>
          </h2>
          <button class="cart-close" @click="cartOpen = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div v-if="!cart.items.length" class="cart-empty-state">
          <span class="c-empty-icon">🛒</span>
          <p class="c-empty-title">Корзина пуста</p>
          <p class="c-empty-sub">Выберите запчасти из каталога</p>
          <router-link to="/catalog" class="btn btn-primary btn-sm" style="margin-top:16px" @click="cartOpen = false">
            Открыть каталог
          </router-link>
        </div>

        <div v-else class="cart-body">
          <div v-for="item in cart.items" :key="item.id" class="ci">
            <div class="ci-info">
              <p class="ci-name">{{ item.name }}</p>
              <p class="ci-price">{{ formatPrice(item.price * item.qty) }}</p>
            </div>
            <div class="ci-controls">
              <button class="ci-qty-btn" @click="cart.updateQty(item.id, item.qty - 1)">−</button>
              <span class="ci-qty">{{ item.qty }}</span>
              <button class="ci-qty-btn" @click="cart.updateQty(item.id, item.qty + 1)">+</button>
              <button class="ci-del" @click="cart.remove(item.id)">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div v-if="cart.items.length" class="cart-foot">
          <div class="cart-total-row">
            <span>Итого</span>
            <span class="cart-total-val">{{ formatPrice(cart.total) }}</span>
          </div>
          <button class="btn btn-orange btn-full" @click="goCheckout">Оформить заказ</button>
          <button class="btn btn-ghost btn-sm btn-full" style="margin-top:8px" @click="cart.clear()">
            Очистить корзину
          </button>
        </div>
      </aside>
    </transition>
  </Teleport>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(9,9,12,.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
}

.navbar-inner {
  display: flex;
  align-items: center;
  gap: 32px;
  height: 64px;
}

/* Logo */
.logo { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.logo-icon {
  width: 36px; height: 36px;
  background: var(--blue);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 900; color: #fff; letter-spacing: -.5px;
}
.logo-text { display: flex; flex-direction: column; line-height: 1; }
.logo-main { font-size: 16px; font-weight: 800; color: var(--t1); letter-spacing: -.3px; }
.logo-six  { color: var(--orange); }
.logo-sub  { font-size: 10px; color: var(--t3); margin-top: 2px; letter-spacing: .03em; text-transform: uppercase; }

/* Desktop nav */
.nav { display: flex; gap: 4px; margin-left: auto; }
.nav-link {
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--t2);
  transition: all .15s;
}
.nav-link:hover { color: var(--t1); background: var(--surface2); }
.nav-active { color: var(--t1) !important; background: var(--surface2); }

/* Right actions */
.navbar-right { display: flex; align-items: center; gap: 8px; }

.cart-btn {
  position: relative;
  width: 40px; height: 40px;
  background: var(--surface2);
  border: 1px solid var(--border2);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  color: var(--t2);
  transition: all .15s;
}
.cart-btn:hover { color: var(--t1); border-color: var(--border2); background: var(--surface3); }

.cart-badge {
  position: absolute;
  top: -6px; right: -6px;
  min-width: 18px; height: 18px;
  background: var(--orange);
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  padding: 0 4px;
}

.mobile-btn {
  display: none;
  width: 40px; height: 40px;
  background: transparent;
  border-radius: 10px;
  align-items: center; justify-content: center;
  color: var(--t2);
  transition: color .15s;
}
.mobile-btn:hover { color: var(--t1); }

/* Mobile nav */
.mobile-nav {
  display: none;
  flex-direction: column;
  border-top: 1px solid var(--border);
  max-height: 0;
  overflow: hidden;
  transition: max-height .25s ease;
}
.mobile-nav--open { max-height: 200px; }
.mobile-link {
  padding: 14px 24px;
  font-size: 15px;
  font-weight: 500;
  color: var(--t2);
  border-bottom: 1px solid var(--border);
  transition: color .15s;
}
.mobile-link:hover, .mobile-link.router-link-active { color: var(--t1); }

/* ---- Cart overlay ---- */
.cart-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(0,0,0,.65);
  backdrop-filter: blur(2px);
}
.overlay-enter-active, .overlay-leave-active { transition: opacity .2s; }
.overlay-enter-from, .overlay-leave-to { opacity: 0; }

/* ---- Cart sidebar ---- */
.cart-sidebar {
  position: fixed; top: 0; right: 0; bottom: 0; z-index: 201;
  width: 380px; max-width: 100vw;
  background: var(--surface);
  border-left: 1px solid var(--border2);
  display: flex; flex-direction: column;
  overflow: hidden;
}
.sidebar-enter-active, .sidebar-leave-active { transition: transform .25s ease; }
.sidebar-enter-from, .sidebar-leave-to { transform: translateX(100%); }

.cart-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.cart-title { font-size: 18px; font-weight: 700; color: var(--t1); display: flex; align-items: center; gap: 8px; }
.cart-count {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 22px; height: 22px;
  background: var(--orange-f); color: var(--orange);
  border-radius: 999px; font-size: 12px; font-weight: 700;
}
.cart-close {
  width: 36px; height: 36px;
  background: var(--surface2); border: 1px solid var(--border2);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: var(--t2); transition: all .15s;
}
.cart-close:hover { color: var(--t1); }

.cart-empty-state {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 8px; padding: 40px 24px; text-align: center;
}
.c-empty-icon { font-size: 40px; opacity: .5; }
.c-empty-title { font-size: 16px; font-weight: 600; color: var(--t1); }
.c-empty-sub   { font-size: 13px; color: var(--t2); }

.cart-body { flex: 1; overflow-y: auto; padding: 12px 0; }

.ci {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 12px; padding: 14px 24px;
  border-bottom: 1px solid var(--border);
}
.ci-info { flex: 1; min-width: 0; }
.ci-name  { font-size: 13px; font-weight: 500; color: var(--t1); line-height: 1.4; margin-bottom: 4px; }
.ci-price { font-size: 13px; font-weight: 700; color: var(--blue); }

.ci-controls { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.ci-qty-btn {
  width: 26px; height: 26px;
  background: var(--surface3); border: 1px solid var(--border2);
  border-radius: 6px;
  font-size: 16px; font-weight: 600; color: var(--t1);
  display: flex; align-items: center; justify-content: center;
  transition: background .15s;
}
.ci-qty-btn:hover { background: var(--border2); }
.ci-qty { min-width: 20px; text-align: center; font-size: 14px; font-weight: 600; color: var(--t1); }
.ci-del {
  width: 28px; height: 28px; margin-left: 4px;
  background: transparent; border: none;
  color: var(--t3); display: flex; align-items: center; justify-content: center;
  border-radius: 6px; transition: all .15s;
}
.ci-del:hover { color: var(--red); background: var(--red-f); }

.cart-foot {
  padding: 20px 24px;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}
.cart-total-row {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 16px;
  font-size: 15px; color: var(--t2);
}
.cart-total-val { font-size: 22px; font-weight: 800; color: var(--t1); }

/* ---- Responsive ---- */
@media (max-width: 768px) {
  .nav       { display: none; }
  .mobile-btn { display: flex; }
  .mobile-nav { display: flex; }
  .navbar-inner { gap: 0; justify-content: space-between; }
  .logo-sub { display: none; }
  .cart-sidebar { width: 100vw; }
}
</style>
