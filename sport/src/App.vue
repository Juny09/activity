<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Connection Status -->
    <div v-if="connectionStatus === 'connecting'" class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4">
      <div class="flex items-center">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
        <p>Connecting to database...</p>
      </div>
    </div>

    <div v-else-if="connectionStatus === 'failed'" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm">Failed to connect to database. Please check your Supabase configuration.</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="connectionStatus === 'connected'" class="container mx-auto px-4 py-8">
      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Activity Management System</h1>
        <p class="text-gray-600">Manage activities and track user registrations</p>
      </header>

      <!-- Navigation -->
      <nav class="mb-8">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="switchTab('activities')"
              :class="currentTab === 'activities'
                ? 'border-blue-500 text-blue-600 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'"
            >
              Activities
            </button>
            <button
              @click="switchTab('registrations')"
              :class="currentTab === 'registrations'
                ? 'border-blue-500 text-blue-600 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'"
            >
              Registrations
              <span v-if="selectedActivity" class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {{ selectedActivity.name }}
              </span>
            </button>
          </nav>
        </div>
      </nav>

      <!-- Tab Content -->
      <main>
        <div v-if="currentTab === 'activities'" key="activities">
          <ActivityManager @activity-selected="handleActivitySelected" />
        </div>

        <div v-else-if="currentTab === 'registrations'" key="registrations">
          <RegistrationManager :selected-activity="selectedActivity" />
        </div>
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

    const switchTab = (tab) => {
      currentTab.value = tab;
    };

    const handleActivitySelected = (activity) => {
      selectedActivity.value = activity;
      currentTab.value = 'registrations';
    };

    const initializeApp = async () => {
      try {
        const connected = await testConnection();
        connectionStatus.value = connected ? 'connected' : 'failed';
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
      switchTab,
      handleActivitySelected
    };
  }
};
</script>
