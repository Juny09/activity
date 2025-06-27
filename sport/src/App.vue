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
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
          <h1 class="hero-title gradient-text">
            Activity Management System
          </h1>
          <p class="hero-subtitle">
            Streamline your team activities and track participant registrations with ease
          </p>
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number">{{ totalActivities }}</div>
              <div class="stat-label">Total Activities</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-number">{{ totalRegistrations }}</div>
              <div class="stat-label">Registrations</div>
            </div>
          </div>
        </div>
      </header>

      <!-- Enhanced Navigation -->
      <nav class="navigation-container mb-12">
        <div class="nav-wrapper">
          <button
            @click="switchTab('activities')"
            :class="['nav-tab', { active: currentTab === 'activities' }]"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            Activities
          </button>
          <button
            @click="switchTab('registrations')"
            :class="['nav-tab', { active: currentTab === 'registrations' }]"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
            </svg>
            Registrations
            <span v-if="selectedActivity" class="activity-badge">
              {{ selectedActivity.name }}
            </span>
          </button>
        </div>
      </nav>

      <!-- Tab Content with Transitions -->
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
import { ref, onMounted } from 'vue'
import { testConnection } from './config/supabase.js'
import ActivityManager from './components/ActivityManager.vue'
import RegistrationManager from './components/RegistrationManager.vue'

export default {
  name: 'App',
  components: {
    ActivityManager,
    RegistrationManager
  },
  setup() {
    const currentTab = ref('activities')
    const selectedActivity = ref(null)
    const connectionStatus = ref('connecting')
    const totalActivities = ref(0)
    const totalRegistrations = ref(0)

    const switchTab = (tab) => {
      currentTab.value = tab
    }

    const handleActivitySelected = (activity) => {
      selectedActivity.value = activity
      currentTab.value = 'registrations'
    }

    const retryConnection = async () => {
      connectionStatus.value = 'connecting'
      await initializeApp()
    }

    const initializeApp = async () => {
      try {
        const connected = await testConnection()
        connectionStatus.value = connected ? 'connected' : 'failed'

        if (connected) {
          // Load stats (you can implement this with actual API calls)
          totalActivities.value = 12 // Replace with actual count
          totalRegistrations.value = 48 // Replace with actual count
        }
      } catch (error) {
        connectionStatus.value = 'failed'
        console.error('App initialization failed:', error)
      }
    }

    onMounted(() => {
      initializeApp()
    })

    return {
      currentTab,
      selectedActivity,
      connectionStatus,
      totalActivities,
      totalRegistrations,
      switchTab,
      handleActivitySelected,
      retryConnection
    }
  }
}
</script>

<style scoped>
.hero-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--gradient-hero);
  z-index: -1;
}

.hero-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 0;
}

.hero-title {
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 1rem;
  line-height: 1.1;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 3rem;
  line-height: 1.6;
}

.hero-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 2rem;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.5rem;
}

.stat-divider {
  width: 1px;
  height: 3rem;
  background: rgba(255, 255, 255, 0.2);
}

.navigation-container {
  display: flex;
  justify-content: center;
}

.nav-wrapper {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 2rem;
  padding: 0.5rem;
  display: flex;
  gap: 0.5rem;
  box-shadow: var(--shadow-xl);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.nav-tab {
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  border-radius: 1.5rem;
  font-weight: 600;
  color: var(--secondary-600);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.nav-tab:hover {
  background: rgba(59, 130, 246, 0.1);
  color: var(--primary-600);
}

.nav-tab.active {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-lg);
}

.activity-badge {
  background: rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  margin-left: 0.5rem;
  font-weight: 500;
}

.tab-content {
  position: relative;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-stats {
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
  }

  .stat-divider {
    width: 3rem;
    height: 1px;
  }

  .nav-wrapper {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }

  .nav-tab {
    justify-content: center;
  }
}
</style>
