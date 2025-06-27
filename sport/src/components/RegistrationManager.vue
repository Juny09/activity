<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Registration Management</h2>
        <div v-if="selectedActivity" class="text-sm text-gray-600 mt-1">
          Selected Activity: <span class="font-medium">{{ selectedActivity.name }}</span>
        </div>
      </div>
      <div class="flex gap-2">
        <button
          v-if="selectedActivity"
          @click="switchToAllView"
          :class="viewMode === 'all' ? 'btn-primary' : 'btn-secondary'"
        >
          All Registrations
        </button>
        <button
          v-if="selectedActivity"
          @click="switchToActivityView"
          :class="viewMode === 'activity' ? 'btn-primary' : 'btn-secondary'"
        >
          This Activity Only
        </button>
        <button
          @click="openCreateForm"
          class="btn-primary"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          New Registration
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <!-- Registration Table -->
    <RegistrationTable
      :registrations="filteredRegistrations"
      :loading="loading"
      :show-activity-column="viewMode === 'all'"
      @edit="openEditForm"
      @delete="handleDelete"
    />

    <!-- Modal Form -->
    <div v-if="showForm" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="modal-overlay fixed inset-0" @click="closeForm"></div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <RegistrationForm
            :registration="editingRegistration"
            :activity-options="activityOptions"
            :selected-activity-id="selectedActivityId"
            :is-edit="isEdit"
            @submit="handleFormSubmit"
            @cancel="closeForm"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRegistrations } from '../composables/useRegistrations.js';
import { useActivities } from '../composables/useActivities.js';
import RegistrationTable from './RegistrationTable.vue';
import RegistrationForm from './RegistrationForm.vue';

export default {
  name: 'RegistrationManager',
  components: {
    RegistrationTable,
    RegistrationForm
  },
  props: {
    selectedActivity: {
      type: Object,
      default: null
    }
  },
  setup(props) {
    const { registrations, loading, error, loadRegistrations, loadRegistrationsByActivity, createRegistration, updateRegistration, deleteRegistration } = useRegistrations();
    const { activityOptions, loadActivities } = useActivities();

    const showForm = ref(false);
    const editingRegistration = ref(null);
    const isEdit = ref(false);
    const viewMode = ref('all'); // 'all' or 'activity'

    const filteredRegistrations = computed(() => {
      if (viewMode.value === 'activity' && props.selectedActivity) {
        return registrations.value.filter(reg => reg.activity_id === props.selectedActivity.id);
      }
      return registrations.value;
    });

    const selectedActivityId = computed(() => {
      return props.selectedActivity?.id || '';
    });

    const openCreateForm = () => {
      editingRegistration.value = null;
      isEdit.value = false;
      showForm.value = true;
    };

    const openEditForm = (registration) => {
      editingRegistration.value = registration;
      isEdit.value = true;
      showForm.value = true;
    };

    const closeForm = () => {
      showForm.value = false;
      editingRegistration.value = null;
      isEdit.value = false;
    };

    const handleFormSubmit = async (formData) => {
      try {
        if (isEdit.value && editingRegistration.value) {
          await updateRegistration(editingRegistration.value.id, formData);
        } else {
          await createRegistration(formData);
        }
        closeForm();
        // Reload based on current view mode
        if (viewMode.value === 'activity' && props.selectedActivity) {
          const activityRegistrations = await loadRegistrationsByActivity(props.selectedActivity.id);
          registrations.value = activityRegistrations;
        } else {
          await loadRegistrations();
        }
      } catch (err) {
        console.error('Failed to save registration:', err);
      }
    };

    const handleDelete = async (id) => {
      try {
        await deleteRegistration(id);
        // Reload based on current view mode
        if (viewMode.value === 'activity' && props.selectedActivity) {
          const activityRegistrations = await loadRegistrationsByActivity(props.selectedActivity.id);
          registrations.value = activityRegistrations;
        } else {
          await loadRegistrations();
        }
      } catch (err) {
        console.error('Failed to delete registration:', err);
      }
    };

    const switchToActivityView = async () => {
      if (props.selectedActivity) {
        viewMode.value = 'activity';
        const activityRegistrations = await loadRegistrationsByActivity(props.selectedActivity.id);
        registrations.value = activityRegistrations;
      }
    };

    const switchToAllView = async () => {
      viewMode.value = 'all';
      await loadRegistrations();
    };

    onMounted(async () => {
      await loadActivities();
      if (props.selectedActivity) {
        await switchToActivityView();
      } else {
        await loadRegistrations();
      }
    });

    return {
      filteredRegistrations,
      loading,
      error,
      showForm,
      editingRegistration,
      isEdit,
      viewMode,
      selectedActivityId,
      activityOptions,
      openCreateForm,
      openEditForm,
      closeForm,
      handleFormSubmit,
      handleDelete,
      switchToActivityView,
      switchToAllView
    };
  }
};
</script>
