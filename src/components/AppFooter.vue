<script setup>
import { categories } from '../data/parts.js'
const cats = categories.filter(c => c.id !== 'all')
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <!-- About -->
        <div class="footer-col">
          <div class="f-logo">
            <div class="f-logo-icon">FE</div>
            <div>
              <div class="f-logo-name">FordEx<span style="color:var(--orange)">6</span></div>
              <div class="f-logo-sub">Запчасти с разборки</div>
            </div>
          </div>
          <p class="footer-about">
            Профессиональная разборка Ford Explorer 6 поколения (2019–2025). Только оригинальные запчасти, проверенные перед продажей. Доставка по всей России.
          </p>
          <div class="footer-socials">
            <a href="https://wa.me/79000000000" class="social-link" title="WhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
            <a href="https://t.me/fordex6parts" class="social-link" title="Telegram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              Telegram
            </a>
          </div>
        </div>

        <!-- Catalog -->
        <div class="footer-col">
          <h3 class="footer-heading">Каталог</h3>
          <ul class="footer-links">
            <li v-for="cat in cats" :key="cat.id">
              <router-link :to="`/catalog?cat=${cat.id}`" class="footer-link">
                {{ cat.emoji }} {{ cat.name }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Info -->
        <div class="footer-col">
          <h3 class="footer-heading">Информация</h3>
          <ul class="footer-links">
            <li><router-link to="/"        class="footer-link">Главная</router-link></li>
            <li><router-link to="/catalog" class="footer-link">Все запчасти</router-link></li>
            <li><router-link to="/contacts" class="footer-link">Контакты</router-link></li>
          </ul>

          <h3 class="footer-heading" style="margin-top:24px">Контакты</h3>
          <div class="footer-contacts">
            <a href="tel:+79000000000" class="footer-contact-link">+7 (900) 000-00-00</a>
            <span class="footer-hours">Пн–Сб: 9:00 – 19:00</span>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <hr class="divider" />
        <div class="footer-bottom-inner">
          <span class="footer-copy">© {{ new Date().getFullYear() }} FordEx6. Запчасти с разборки Ford Explorer 6.</span>
          <span class="footer-note">Ford Explorer 6 · 2019–2025</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--surface);
  border-top: 1px solid var(--border);
  margin-top: auto;
}
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 48px;
  padding: 56px 0 40px;
}

/* Logo */
.f-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
.f-logo-icon {
  width: 36px; height: 36px; background: var(--blue); border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 900; color: #fff;
}
.f-logo-name { font-size: 16px; font-weight: 800; color: var(--t1); }
.f-logo-sub  { font-size: 10px; color: var(--t3); text-transform: uppercase; letter-spacing: .04em; }
.footer-about { font-size: 14px; line-height: 1.7; color: var(--t2); margin-bottom: 20px; }

/* Socials */
.footer-socials { display: flex; gap: 10px; flex-wrap: wrap; }
.social-link {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 14px;
  background: var(--surface2); border: 1px solid var(--border2);
  border-radius: 8px;
  font-size: 13px; font-weight: 500; color: var(--t2);
  transition: all .15s;
}
.social-link:hover { color: var(--t1); border-color: var(--border2); background: var(--surface3); }

/* Headings */
.footer-heading { font-size: 12px; font-weight: 700; color: var(--t3); letter-spacing: .08em; text-transform: uppercase; margin-bottom: 16px; }

/* Links */
.footer-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.footer-link { font-size: 14px; color: var(--t2); transition: color .15s; }
.footer-link:hover { color: var(--t1); }

/* Contacts */
.footer-contacts { display: flex; flex-direction: column; gap: 6px; }
.footer-contact-link { font-size: 15px; font-weight: 600; color: var(--t1); transition: color .15s; }
.footer-contact-link:hover { color: var(--blue); }
.footer-hours { font-size: 13px; color: var(--t2); }

/* Bottom */
.footer-bottom { padding-bottom: 28px; }
.footer-bottom-inner { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding-top: 20px; flex-wrap: wrap; }
.footer-copy  { font-size: 13px; color: var(--t3); }
.footer-note  { font-size: 12px; color: var(--t3); }

@media (max-width: 900px) {
  .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
}
@media (max-width: 600px) {
  .footer-grid { grid-template-columns: 1fr; gap: 28px; padding: 40px 0 28px; }
  .footer-bottom-inner { flex-direction: column; align-items: flex-start; }
}
</style>
