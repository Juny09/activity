<template>
  <div class="min-h-screen">
    <!-- Hero Background -->
    <div class="hero-background"></div>

    <!-- Connection Status Banner -->
    <div v-if="connectionStatus === 'connecting'" class="connection-banner connecting">
      <div class="flex items-center justify-center">
        <div class="loading-spinner mr-3">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <div>
          <p class="font-semibold">Connecting to database...</p>
          <p class="text-sm opacity-75">Please wait while we establish connection</p>
        </div>
      </div>
    </div>

    <div v-else-if="connectionStatus === 'failed'" class="connection-banner failed">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <div>
            <p class="font-semibold">Failed to connect to database</p>
            <p class="text-sm opacity-75">Please check your Supabase configuration and try again</p>
          </div>
        </div>
        <button @click="retryConnection" class="btn-secondary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Retry
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="connectionStatus === 'connected'" class="container mx-auto px-4 py-8 relative z-10">
      <!-- Enhanced Header -->
      <header class="text-center mb-12 animate-in">
        <div class="hero-content">
          <h1 class="hero-title gradient-text">Sports Activity Management</h1>
          <p class="hero-subtitle">
            Organize, track, and manage your team's sports events and player registrations
          </p>
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number">🏆 {{ totalActivities }}</div>
              <div class="stat-label">Sports Events</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-number">👟 {{ totalRegistrations }}</div>
              <div class="stat-label">Players Registered</div>
            </div>
          </div>
        </div>
      </header>

      <!-- Featured Sports -->
      <section class="featured-sports mb-12 animate-in">
        <h2 class="text-2xl font-bold text-black text-center mb-4">Popular Sports</h2>
        <div class="flex flex-wrap justify-center gap-4">
          <div class="sport-card">⚽ Football</div>
          <div class="sport-card">🏀 Basketball</div>
          <div class="sport-card">🏸 Badminton</div>
          <div class="sport-card">🏓 Table Tennis</div>
          <div class="sport-card">🏐 Volleyball</div>
        </div>
      </section>

      <!-- Tab Content -->
      <main class="tab-content">
        <transition name="fade" mode="out-in">
          <div v-if="currentTab === 'activities'" key="activities" class="animate-in">
            <ActivityManager @activity-selected="handleActivitySelected" />
          </div>

          <div v-else-if="currentTab === 'registrations'" key="registrations" class="animate-in">
            <RegistrationManager :selected-activity="selectedActivity" />
          </div>
        </transition>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { testConnection } from './config/supabase.js';
import ActivityManager from './components/ActivityManager.vue';
import RegistrationManager from './components/RegistrationManager.vue';

export default {
  name: 'App',
  components: {
    ActivityManager,
    RegistrationManager
  },
  setup() {
    const currentTab = ref('activities');
    const selectedActivity = ref(null);
    const connectionStatus = ref('connecting');
    const totalActivities = ref(0);
    const totalRegistrations = ref(0);

    const switchTab = (tab) => {
      currentTab.value = tab;
    };

    const handleActivitySelected = (activity) => {
      selectedActivity.value = activity;
      currentTab.value = 'registrations';
    };

    const retryConnection = async () => {
      connectionStatus.value = 'connecting';
      await initializeApp();
    };

    const initializeApp = async () => {
      try {
        const connected = await testConnection();
        connectionStatus.value = connected ? 'connected' : 'failed';

        if (connected) {
          totalActivities.value = 12;
          totalRegistrations.value = 48;
        }
      } catch (error) {
        connectionStatus.value = 'failed';
        console.error('App initialization failed:', error);
      }
    };

    onMounted(() => {
      initializeApp();
    });

    return {
      currentTab,
      selectedActivity,
      connectionStatus,
      totalActivities,
      totalRegistrations,
      switchTab,
      handleActivitySelected,
      retryConnection
    };
  }
};
</script>

<style scoped>
/* ============================================
   APP.VUE - SCOPED STYLES (不影响其他页面)
============================================ */

/* 局部变量 - 只在这个组件内生效 */
.min-h-screen {
  min-height: 100vh;
  /* 移除全局背景设置，让其他页面自由设置背景 */
}

/* Hero Background - 只在这个页面显示 */
.hero-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg,
    #0f172a 0%,
    #1f2937 30%,
    #0c4a6e 70%,
    #7c2d12 100%);
  opacity: 0.95;
  z-index: -1;
}

.hero-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(circle at 20% 80%, #0284c7 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, #ea580c 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, #0369a1 0%, transparent 50%);
  opacity: 0.3;
  animation: backgroundPulse 8s ease-in-out infinite;
}

@keyframes backgroundPulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.05); }
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Connection Status Banners */
.connection-banner {
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid;
  animation: slideInFromTop 0.5s ease-out;
}

.connection-banner.connecting {
  background: linear-gradient(135deg, #0c4a6e 0%, #075985 100%);
  border-color: #0284c7;
  color: #e0f2fe;
}

.connection-banner.failed {
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
  border-color: #f87171;
  color: white;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes slideInFromTop {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Hero Section */
.hero-content {
  text-align: center;
  padding: 3rem 0;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #38bdf8, #fb923c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
  text-shadow: 0 0 20px rgba(14, 165, 233, 0.3);
}

.gradient-text {
  background: linear-gradient(135deg, #38bdf8, #fb923c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #050505;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #fb923c;
  margin-bottom: 0.25rem;
  text-shadow: 0 0 10px currentColor;
}

.stat-label {
  font-size: 0.875rem;
  color: black;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #475569;
}

/* Featured Sports */
.featured-sports {
  text-align: center;
  padding: 2rem 0;
}

.sport-card {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  color: black;
  font-weight: 600;
  backdrop-filter: blur(10px);
  transition: all 0.25s ease-out;
  cursor: pointer;
}

.sport-card:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: #38bdf8;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  backdrop-filter: blur(25px);
}

/* Tab Content */
.tab-content {
  position: relative;
}

.animate-in {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Fade transition for tab content */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Utility classes - 只在这个组件内生效 */
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.flex-wrap {
  flex-wrap: wrap;
}

.gap-4 {
  gap: 1rem;
}

.text-center {
  text-align: center;
}

.text-2xl {
  font-size: 1.5rem;
}

.font-bold {
  font-weight: 700;
}

.font-semibold {
  font-weight: 600;
}

.text-black {
  color: black;
}

.text-sm {
  font-size: 0.875rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-12 {
  margin-bottom: 3rem;
}

.mr-3 {
  margin-right: 0.75rem;
}

.mr-2 {
  margin-right: 0.5rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.w-5 {
  width: 1.25rem;
}

.w-6 {
  width: 1.5rem;
}

.w-4 {
  width: 1rem;
}

.h-5 {
  height: 1.25rem;
}

.h-6 {
  height: 1.5rem;
}

.h-4 {
  height: 1rem;
}

.relative {
  position: relative;
}

.z-10 {
  z-index: 10;
}

.opacity-25 {
  opacity: 0.25;
}

.opacity-75 {
  opacity: 0.75;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

/* Button styling */
.btn-secondary {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease-out;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: #38bdf8;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 0 0.75rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-stats {
    flex-direction: column;
    gap: 1rem;
  }

  .stat-divider {
    width: 40px;
    height: 1px;
    transform: rotate(90deg);
  }
}
</style>

<!--
  ============================================
  全局 CSS 文件 (创建 src/assets/global.css)
  ============================================

  将下面的CSS放到单独的全局CSS文件中，这样不会影响其他页面：
-->

<style>
/* 全局最小样式 - 只设置必要的基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 移除body的全局背景设置，让每个页面自由设置 */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.6;
  /* 不设置background，让每个页面/组件自己控制 */
}

/* 只保留必要的CSS变量给其他组件使用 */
:root {
  /* Primary Colors */
  --primary-50: #f0f9ff;
  --primary-100: #e0f2fe;
  --primary-200: #bae6fd;
  --primary-300: #7dd3fc;
  --primary-400: #38bdf8;
  --primary-500: #0ea5e9;
  --primary-600: #0284c7;
  --primary-700: #0369a1;
  --primary-800: #075985;
  --primary-900: #0c4a6e;

  /* Accent Colors */
  --accent-50: #fff7ed;
  --accent-100: #ffedd5;
  --accent-200: #fed7aa;
  --accent-300: #fdba74;
  --accent-400: #fb923c;
  --accent-500: #f97316;
  --accent-600: #ea580c;
  --accent-700: #c2410c;

  /* Status Colors */
  --success-400: #4ade80;
  --success-500: #22c55e;
  --success-600: #16a34a;
  --warning-400: #facc15;
  --warning-500: #eab308;
  --error-400: #f87171;
  --error-500: #ef4444;
  --error-600: #dc2626;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

  /* Transitions */
  --transition-fast: 0.15s ease-out;
  --transition-normal: 0.25s ease-out;
}
</style>
