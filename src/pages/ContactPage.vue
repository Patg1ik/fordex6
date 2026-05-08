<script setup>
import { ref, computed, nextTick } from 'vue'
import { cart } from '../store/cart.js'
import { formatPrice } from '../data/parts.js'
import { sendOrder } from '../services/telegram.js'

const form         = ref({ name: '', phone: '', message: '' })
const submitted    = ref(false)
const loading      = ref(false)
const error        = ref('')
const phoneTouched = ref(false)
const nameTouched  = ref(false)

// ── Phone mask ───────────────────────────────────────────
function toDigits(raw) {
  let d = raw.replace(/\D/g, '')
  if (d.startsWith('8'))                        d = '7' + d.slice(1)
  else if (d.length > 0 && !d.startsWith('7')) d = '7' + d
  return d.slice(0, 11)
}

function buildMask(digits) {
  let r = ''
  for (let i = 0; i < digits.length; i++) {
    if      (i === 0) r = '+' + digits[i]
    else if (i === 1) r += ' (' + digits[i]
    else if (i === 4) r += ') ' + digits[i]
    else if (i === 7) r += '-'  + digits[i]
    else if (i === 9) r += '-'  + digits[i]
    else              r += digits[i]
  }
  return r
}

function onPhoneInput(e) {
  const digits    = toDigits(e.target.value)
  const formatted = buildMask(digits)
  form.value.phone = formatted
  nextTick(() => {
    e.target.value = formatted
    e.target.setSelectionRange(formatted.length, formatted.length)
  })
}

// Backspace сквозь маску — удаляет цифру перед форматным символом
function onPhoneKeydown(e) {
  if (e.key !== 'Backspace') return
  const input = e.target
  const pos   = input.selectionStart
  if (pos !== input.selectionEnd || pos === 0) return

  const prev = input.value[pos - 1]
  if (/\d/.test(prev)) return  // обычное удаление — не перехватываем

  e.preventDefault()
  let i = pos - 1
  while (i > 0 && !/\d/.test(input.value[i - 1])) i--
  if (i === 0) return

  const newRaw    = input.value.slice(0, i - 1) + input.value.slice(pos)
  const digits    = toDigits(newRaw)
  const formatted = buildMask(digits)
  form.value.phone = formatted
  nextTick(() => {
    input.value = formatted
    input.setSelectionRange(formatted.length, formatted.length)
  })
}

// ── Validation ───────────────────────────────────────────
const phoneDigits = computed(() => form.value.phone.replace(/\D/g, ''))
const phoneValid  = computed(() => phoneDigits.value.length === 11)
const phoneError  = computed(() => {
  if (!phoneTouched.value || !form.value.phone) return ''
  if (!phoneValid.value) return 'Введите номер полностью: +7 (XXX) XXX-XX-XX'
  return ''
})

const nameError = computed(() => {
  if (!nameTouched.value || !form.value.name) return ''
  if (form.value.name.trim().length < 2) return 'Введите настоящее имя'
  return ''
})

const canSubmit = computed(() =>
  form.value.name.trim().length >= 2 && phoneValid.value
)

// ── Misc ─────────────────────────────────────────────────
function pluralItems(n) {
  const m10 = n % 10, m100 = n % 100
  if (m10 === 1 && m100 !== 11) return 'позиция'
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return 'позиции'
  return 'позиций'
}

const hasCart = computed(() => cart.items.length > 0)

async function handleSubmit() {
  nameTouched.value  = true
  phoneTouched.value = true
  if (!canSubmit.value) return
  loading.value = true
  error.value   = ''
  try {
    await sendOrder({
      name:      form.value.name,
      phone:     form.value.phone,
      message:   form.value.message,
      cartItems: cart.items,
      total:     cart.total,
    })
    submitted.value = true
    cart.clear()
  } catch (e) {
    error.value = e.message || 'Не удалось отправить заявку. Попробуйте позже.'
  } finally {
    loading.value = false
  }
}

function resetForm() {
  submitted.value    = false
  error.value        = ''
  phoneTouched.value = false
  nameTouched.value  = false
  form.value         = { name: '', phone: '', message: '' }
}
</script>

<template>
  <div class="contacts-page">
    <!-- Header -->
    <div class="contact-header">
      <div class="container">
        <div class="breadcrumb">
          <router-link to="/">Главная</router-link>
          <span class="breadcrumb-sep">/</span>
          <span>Контакты</span>
        </div>
        <h1 class="contact-title">Свяжитесь с нами</h1>
        <p class="contact-sub">
          Напишите в мессенджер с VIN-номером или оставьте заявку — ответим и подберём запчасть.
        </p>
      </div>
    </div>

    <div class="container contact-body">
      <!-- Contact cards -->
      <div class="contact-cards">
        <a href="tel:+79000000000" class="contact-card">
          <div class="cc-icon cc-icon--blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.22.22h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
            </svg>
          </div>
          <div class="cc-content">
            <span class="cc-label">Телефон</span>
            <span class="cc-value">+7 (900) 000-00-00</span>
            <span class="cc-hint">Пн–Сб 9:00 – 19:00</span>
          </div>
          <svg class="cc-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>

        <a href="https://wa.me/79000000000" target="_blank" rel="noopener" class="contact-card">
          <div class="cc-icon cc-icon--green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <div class="cc-content">
            <span class="cc-label">WhatsApp</span>
            <span class="cc-value">+7 (900) 000-00-00</span>
            <span class="cc-hint">Напишите с VIN-номером</span>
          </div>
          <svg class="cc-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>

        <a href="https://t.me/fordex6parts" target="_blank" rel="noopener" class="contact-card">
          <div class="cc-icon cc-icon--sky">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
          </div>
          <div class="cc-content">
            <span class="cc-label">Telegram</span>
            <span class="cc-value">@fordex6parts</span>
            <span class="cc-hint">Быстрый ответ в чате</span>
          </div>
          <svg class="cc-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>
      </div>

      <div class="contact-grid">
        <!-- Form -->
        <div class="contact-form-wrap">
          <h2 class="cw-title">{{ hasCart ? 'Оформить заказ' : 'Заявка на запчасть' }}</h2>
          <p class="cw-sub">{{ hasCart ? 'Проверьте состав заказа и оставьте контакты — свяжемся для подтверждения' : 'Заполните форму — перезвоним и уточним детали' }}</p>

          <!-- Success -->
          <div v-if="submitted" class="form-success">
            <div class="form-success-icon">✓</div>
            <h3 class="form-success-title">Заявка отправлена!</h3>
            <p class="form-success-sub">Мы перезвоним вам в ближайшее рабочее время.</p>
            <button class="btn btn-outline btn-sm" style="margin-top:16px" @click="resetForm">
              Новая заявка
            </button>
          </div>

          <form v-else class="contact-form" @submit.prevent="handleSubmit">

            <!-- Cart summary -->
            <div v-if="hasCart" class="cart-summary">
              <div class="cs-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                Корзина ({{ cart.count }} {{ pluralItems(cart.count) }})
              </div>
              <div class="cs-items">
                <div v-for="item in cart.items" :key="item.id" class="cs-item">
                  <span class="cs-name">{{ item.name }}</span>
                  <span class="cs-price">{{ formatPrice(item.price) }} × {{ item.qty }}</span>
                </div>
              </div>
              <div class="cs-total">
                <span>Итого</span>
                <span class="cs-total-val">{{ formatPrice(cart.total) }}</span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Ваше имя *</label>
              <input
                v-model="form.name"
                class="form-input"
                :class="{ 'input--error': nameError, 'input--ok': nameTouched && !nameError && form.name.trim().length >= 2 }"
                type="text"
                placeholder="Иван Петров"
                autocomplete="name"
                @blur="nameTouched = true"
              />
              <span v-if="nameError" class="field-error">{{ nameError }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">Номер телефона *</label>
              <div class="phone-wrap">
                <input
                  :value="form.phone"
                  class="form-input"
                  :class="{ 'input--error': phoneError, 'input--ok': phoneTouched && !phoneError && phoneValid }"
                  type="tel"
                  placeholder="+7 (999) 999-99-99"
                  autocomplete="tel"
                  inputmode="numeric"
                  @input="onPhoneInput"
                  @keydown="onPhoneKeydown"
                  @blur="phoneTouched = true"
                />
                <svg v-if="phoneTouched && phoneValid" class="phone-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <span v-if="phoneError" class="field-error">{{ phoneError }}</span>
            </div>
            <div class="form-group">
              <label class="form-label">{{ hasCart ? 'Комментарий к заказу' : 'Что нужно? VIN или описание' }}</label>
              <textarea v-model="form.message" class="form-textarea" rows="3" :placeholder="hasCart ? 'Адрес доставки, удобное время звонка…' : 'Например: двигатель 3.0 EcoBoost, VIN: 1FM5K8HT…'" />
            </div>

            <!-- Error -->
            <div v-if="error" class="form-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {{ error }}
            </div>

            <button type="submit" class="btn btn-primary btn-full" :disabled="loading || (!canSubmit && (nameTouched || phoneTouched))">
              <svg v-if="loading" class="spin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
              </svg>
              {{ loading ? 'Отправляем…' : (hasCart ? 'Оформить заказ' : 'Отправить заявку') }}
            </button>
            <p class="form-note">Нажимая кнопку, вы соглашаетесь на обработку персональных данных</p>
          </form>
        </div>

        <!-- Info -->
        <div class="contact-info-col">
          <div class="info-block">
            <h3 class="info-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              Режим работы
            </h3>
            <table class="hours-table">
              <tr><td class="hours-day">Понедельник – Пятница</td><td class="hours-time">9:00 – 19:00</td></tr>
              <tr><td class="hours-day">Суббота</td><td class="hours-time">10:00 – 17:00</td></tr>
              <tr><td class="hours-day">Воскресенье</td><td class="hours-time hours-off">Выходной</td></tr>
            </table>
          </div>

          <div class="info-block">
            <h3 class="info-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Важно знать
            </h3>
            <ul class="info-list">
              <li>Для точного подбора пришлите VIN-номер автомобиля</li>
              <li>Самовывоз возможен по договорённости</li>
              <li>Отправка транспортными компаниями ПЭК, СДЭК, Деловые линии</li>
              <li>Оплата: перевод на карту, наличными при самовывозе</li>
              <li>Фото и видео запчасти предоставляем по запросу</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-header {
  background: var(--surface); border-bottom: 1px solid var(--border);
  padding: 40px 0 32px;
}
.contact-title { font-size: 32px; font-weight: 900; color: var(--t1); letter-spacing: -.5px; margin-bottom: 8px; }
.contact-sub   { font-size: 15px; color: var(--t2); max-width: 500px; line-height: 1.6; }

.contact-body { padding-top: 36px; padding-bottom: 60px; }

/* Contact cards */
.contact-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; margin-bottom: 40px; }
.contact-card {
  display: flex; align-items: center; gap: 16px;
  padding: 20px 20px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r2); transition: all .18s; cursor: pointer;
}
.contact-card:hover { border-color: var(--border2); background: var(--surface2); transform: translateY(-2px); }

.cc-icon {
  width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.cc-icon--blue  { background: var(--blue-f);  color: var(--blue);  }
.cc-icon--green { background: rgba(37,211,102,.1); color: #25d366; }
.cc-icon--sky   { background: rgba(0,136,204,.1);  color: #0088cc; }

.cc-content { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.cc-label   { font-size: 11px; font-weight: 700; color: var(--t3); text-transform: uppercase; letter-spacing: .06em; }
.cc-value   { font-size: 16px; font-weight: 700; color: var(--t1); }
.cc-hint    { font-size: 12px; color: var(--t2); }
.cc-arrow   { color: var(--t3); flex-shrink: 0; transition: transform .15s; }
.contact-card:hover .cc-arrow { transform: translateX(3px); }

/* Grid */
.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }

/* Form */
.contact-form-wrap {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r2); padding: 32px;
}
.cw-title { font-size: 20px; font-weight: 800; color: var(--t1); margin-bottom: 6px; }
.cw-sub   { font-size: 14px; color: var(--t2); margin-bottom: 24px; }

.contact-form { display: flex; flex-direction: column; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 13px; font-weight: 600; color: var(--t2); }
.form-input, .form-textarea {
  padding: 11px 14px;
  background: var(--surface2); border: 1px solid var(--border2);
  border-radius: var(--r); color: var(--t1); font-size: 14px;
  transition: border-color .15s;
}
.form-input::placeholder, .form-textarea::placeholder { color: var(--t3); }
.form-input:focus, .form-textarea:focus { outline: none; border-color: var(--blue); }
.form-textarea { resize: vertical; min-height: 80px; }
.form-note { font-size: 12px; color: var(--t3); text-align: center; }

/* Validation states */
.input--error { border-color: var(--red)   !important; }
.input--ok    { border-color: var(--green) !important; }

.field-error {
  font-size: 12px; color: var(--red); margin-top: -4px;
  display: flex; align-items: center; gap: 4px;
}
.field-error::before { content: '×'; font-size: 15px; font-weight: 700; line-height: 1; }

/* Phone wrapper with check icon */
.phone-wrap { position: relative; }
.phone-wrap .form-input { padding-right: 38px; }
.phone-check {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  color: var(--green); pointer-events: none;
}

/* Cart summary */
.cart-summary {
  background: var(--surface2);
  border: 1px solid var(--border2);
  border-radius: var(--r);
  overflow: hidden;
}
.cs-title {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 14px;
  font-size: 13px; font-weight: 700; color: var(--t1);
  border-bottom: 1px solid var(--border);
}
.cs-items { padding: 8px 0; }
.cs-item {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
  padding: 7px 14px;
  font-size: 13px;
}
.cs-name  { color: var(--t2); line-height: 1.4; flex: 1; min-width: 0; }
.cs-price { color: var(--t1); font-weight: 600; white-space: nowrap; flex-shrink: 0; }
.cs-total {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 14px;
  border-top: 1px solid var(--border);
  font-size: 13px; color: var(--t2);
}
.cs-total-val { font-size: 16px; font-weight: 800; color: var(--t1); }

/* Error */
.form-error {
  display: flex; align-items: flex-start; gap: 8px;
  padding: 12px 14px;
  background: var(--red-f); border: 1px solid rgba(239,68,68,.2);
  border-radius: var(--r);
  font-size: 13px; color: var(--red); line-height: 1.5;
}
.form-error svg { flex-shrink: 0; margin-top: 1px; }

/* Loading spinner */
.spin-icon { animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Submit button disabled */
.btn:disabled { opacity: .6; cursor: not-allowed; }
.btn:disabled:hover { transform: none; box-shadow: none; }

/* Success */
.form-success {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; padding: 32px 0; gap: 8px;
}
.form-success-icon {
  width: 56px; height: 56px; background: var(--green-f); color: var(--green);
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 22px; font-weight: 700; margin-bottom: 8px;
}
.form-success-title { font-size: 18px; font-weight: 700; color: var(--t1); }
.form-success-sub   { font-size: 14px; color: var(--t2); }

/* Info col */
.contact-info-col { display: flex; flex-direction: column; gap: 24px; }
.info-block {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r2); padding: 24px;
}
.info-title {
  display: flex; align-items: center; gap: 8px;
  font-size: 14px; font-weight: 700; color: var(--t1);
  margin-bottom: 16px;
}

.hours-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.hours-table tr { border-bottom: 1px solid var(--border); }
.hours-table tr:last-child { border-bottom: none; }
.hours-day  { padding: 8px 0; color: var(--t2); }
.hours-time { padding: 8px 0; color: var(--t1); font-weight: 600; text-align: right; }
.hours-off  { color: var(--t3) !important; font-weight: 400 !important; }

.info-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.info-list li {
  font-size: 14px; color: var(--t2); line-height: 1.5;
  padding-left: 18px; position: relative;
}
.info-list li::before {
  content: '·'; position: absolute; left: 0;
  color: var(--blue); font-weight: 700; font-size: 18px; line-height: 1.2;
}

@media (max-width: 900px) {
  .contact-grid { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .contact-title { font-size: 24px; }
  .contact-form-wrap { padding: 24px 20px; }
}
</style>
