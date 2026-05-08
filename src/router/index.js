import { createRouter, createWebHashHistory } from 'vue-router'
import CatalogPage from '../pages/CatalogPage.vue'
import ContactPage from '../pages/ContactPage.vue'
import HomePage from '../pages/HomePage.vue'
import PartDetailPage from '../pages/PartDetailPage.vue'

export default createRouter({
	history: createWebHashHistory(),
	scrollBehavior(to, from, saved) {
		if (saved) return saved
		return { top: 0, behavior: 'smooth' }
	},
	routes: [
		{ path: '/', name: 'home', component: HomePage },
		{ path: '/catalog', name: 'catalog', component: CatalogPage },
		{ path: '/part/:id', name: 'part', component: PartDetailPage },
		{ path: '/contacts', name: 'contacts', component: ContactPage },
		{ path: '/:pathMatch(.*)*', redirect: '/' }
	]
})
