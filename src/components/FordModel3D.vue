<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const canvasRef = ref(null)
const loaded = ref(false)

let renderer, scene, camera, controls, car, animId

function buildEnvMap() {
	const pmrem = new THREE.PMREMGenerator(renderer)
	const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
	pmrem.dispose()
	return env
}

function applyPBR(obj, envMap) {
	obj.traverse(child => {
		if (!child.isMesh) return

		const convert = mat => {
			if (!mat) return mat
			const name = (mat.name || '').toLowerCase()
			const color = mat.color ? mat.color.clone() : new THREE.Color(0.5, 0.5, 0.5)
			const lum = color.r * 0.299 + color.g * 0.587 + color.b * 0.114

			if (name.includes('glass_02')) {
				return new THREE.MeshPhysicalMaterial({
					color: 0x1a2a3a,
					roughness: 0.0,
					metalness: 0.0,
					transparent: true,
					opacity: 0.25,
					envMap,
					envMapIntensity: 2.5,
					side: THREE.DoubleSide
				})
			}
			if (name.includes('glass')) {
				return new THREE.MeshPhysicalMaterial({
					color: 0x223344,
					roughness: 0.05,
					metalness: 0.0,
					transparent: true,
					opacity: 0.45,
					envMap,
					envMapIntensity: 2.0,
					side: THREE.DoubleSide
				})
			}
			if (name.includes('exterior')) {
				return new THREE.MeshStandardMaterial({
					color: 0x0d1f3c,
					roughness: 0.14,
					metalness: 0.92,
					envMap,
					envMapIntensity: 1.4
				})
			}

			const isVeryDark = lum < 0.06
			const isDark = lum < 0.15
			const isChrome = lum > 0.62
			const isRed = color.r > 0.4 && color.g < 0.15 && color.b < 0.15
			const isOrange = color.r > 0.5 && color.g > 0.15 && color.g < 0.45 && color.b < 0.05

			if (isRed)
				return new THREE.MeshStandardMaterial({
					color: 0xcc1100,
					roughness: 0.12,
					metalness: 0.05,
					emissive: new THREE.Color(0.18, 0, 0),
					envMap
				})
			if (isOrange)
				return new THREE.MeshStandardMaterial({
					color: 0xff6600,
					roughness: 0.08,
					metalness: 0.0,
					emissive: new THREE.Color(0.18, 0.06, 0),
					envMap
				})
			if (isVeryDark)
				return new THREE.MeshStandardMaterial({ color: 0x0d0d0d, roughness: 0.7, metalness: 0.05, envMap, envMapIntensity: 0.3 })
			if (isDark) return new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.45, metalness: 0.15, envMap, envMapIntensity: 0.5 })
			if (isChrome) return new THREE.MeshStandardMaterial({ color, roughness: 0.04, metalness: 0.98, envMap, envMapIntensity: 2.8 })

			return new THREE.MeshStandardMaterial({ color, roughness: 0.38, metalness: 0.55, envMap, envMapIntensity: 0.9 })
		}

		if (Array.isArray(child.material)) {
			child.material = child.material.map(convert)
		} else {
			child.material = convert(child.material)
		}
		child.castShadow = true
		child.receiveShadow = true
	})
}

function init() {
	const el = canvasRef.value
	const w = el.clientWidth || 800
	const h = el.clientHeight || 600

	scene = new THREE.Scene()

	camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 1000)
	camera.position.set(0, 0.8, 5.5)
	camera.lookAt(0, 0.8, 0)

	renderer = new THREE.WebGLRenderer({ canvas: el, alpha: true, antialias: true })
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	renderer.setSize(w, h, false)
	renderer.outputColorSpace = THREE.SRGBColorSpace
	renderer.toneMapping = THREE.ACESFilmicToneMapping
	renderer.toneMappingExposure = 1.15
	renderer.shadowMap.enabled = true
	renderer.shadowMap.type = THREE.PCFSoftShadowMap

	// OrbitControls
	controls = new OrbitControls(camera, el)
	controls.enablePan = false
	controls.enableDamping = true
	controls.dampingFactor = 0.06
	controls.autoRotate = false
	controls.minDistance = 3
	controls.maxDistance = 12
	controls.minPolarAngle = 0.15
	controls.maxPolarAngle = Math.PI / 2 + 0.15

	const envMap = buildEnvMap()
	scene.environment = envMap

	const key = new THREE.DirectionalLight(0x7099ff, 2.2)
	key.position.set(5, 9, 7)
	key.castShadow = true
	key.shadow.mapSize.set(2048, 2048)
	key.shadow.camera.left = key.shadow.camera.bottom = -8
	key.shadow.camera.right = key.shadow.camera.top = 8
	scene.add(key)

	const fill = new THREE.DirectionalLight(0xffffff, 0.9)
	fill.position.set(-7, 3, 5)
	scene.add(fill)

	const rim = new THREE.DirectionalLight(0x3355cc, 2.2)
	rim.position.set(0, 11, -13)
	scene.add(rim)

	const bounce = new THREE.DirectionalLight(0x112244, 0.6)
	bounce.position.set(0, -4, 0)
	scene.add(bounce)

	const modelPath = import.meta.env.BASE_URL + '3d-models/'
	const mtlLoader = new MTLLoader()
	mtlLoader.setPath(modelPath)
	mtlLoader.load('Ford_Explorer.mtl', materials => {
		materials.preload()
		const objLoader = new OBJLoader()
		objLoader.setMaterials(materials)
		objLoader.setPath(modelPath)
		objLoader.load('Ford_Explorer.obj', obj => {
			const box = new THREE.Box3().setFromObject(obj)
			const center = box.getCenter(new THREE.Vector3())
			const size = box.getSize(new THREE.Vector3())
			const scale = 5.0 / Math.max(size.x, size.y, size.z)
			obj.scale.setScalar(scale)
			center.multiplyScalar(scale)
			obj.position.set(-center.x, -center.y, -center.z)
			obj.rotation.y = Math.PI * 1.35

			applyPBR(obj, envMap)

			car = obj
			scene.add(car)
			loaded.value = true
		})
	})

	animate()
}

function animate() {
	animId = requestAnimationFrame(animate)
	controls?.update()
	renderer?.render(scene, camera)
}

function onResize() {
	const el = canvasRef.value
	if (!el || !renderer || !camera) return
	const w = el.clientWidth
	const h = el.clientHeight
	camera.aspect = w / h
	camera.updateProjectionMatrix()
	renderer.setSize(w, h, false)
}

onMounted(() => {
	init()
	window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
	cancelAnimationFrame(animId)
	controls?.dispose()
	renderer?.dispose()
	window.removeEventListener('resize', onResize)
})
</script>

<template>
	<div class="ford-wrap">
		<canvas ref="canvasRef" class="ford-canvas" />
		<Transition name="fade">
			<div v-if="!loaded" class="ford-loading">
				<div class="ford-spinner" />
			</div>
		</Transition>
		<div v-if="loaded" class="ford-hint">
			<svg
				width="13"
				height="13"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M15 15l6 6m-6-6v4.8m0-4.8h4.8" />
				<path d="M9 19.8V15m0 0H4.2M9 15l-6 6" />
				<path d="M15 4.2V9m0 0h4.8M15 9l6-6" />
				<path d="M9 4.2V9m0 0H4.2M9 9L3 3" />
			</svg>
			Тяните для поворота
		</div>
	</div>
</template>

<style scoped>
.ford-wrap {
	position: relative;
	width: 100%;
	height: 100%;
}
.ford-canvas {
	display: block;
	width: 100%;
	height: 100%;
	cursor: grab;
}
.ford-canvas:active {
	cursor: grabbing;
}

.ford-loading {
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	pointer-events: none;
}
.ford-spinner {
	width: 32px;
	height: 32px;
	border: 2px solid rgba(37, 99, 255, 0.15);
	border-top-color: rgba(37, 99, 255, 0.6);
	border-radius: 50%;
	animation: spin 0.85s linear infinite;
}
@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

.ford-hint {
	position: absolute;
	bottom: 16px;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	align-items: center;
	gap: 6px;
	font-size: 12px;
	color: rgba(255, 255, 255, 0.3);
	pointer-events: none;
	white-space: nowrap;
	animation: hint-fade 3s ease 1.5s forwards;
	opacity: 1;
}
@keyframes hint-fade {
	to {
		opacity: 0;
	}
}

.fade-leave-active {
	transition: opacity 0.6s ease;
}
.fade-leave-to {
	opacity: 0;
}
</style>
