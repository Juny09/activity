<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">Activity Management</h2>
      <button
        @click="openCreateForm"
        class="btn-primary"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Create Activity
      </button>
    </div>

    <!-- Search -->
    <div class="max-w-md">
      <div class="relative">
        <input
          :value="searchQuery"
          @input="handleSearch($event.target.value)"
          type="text"
          placeholder="Search activities..."
          class="form-input pl-10"
        />
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <!-- Activity Table -->
    <ActivityTable
      :activities="activities"
      :loading="loading"
      @edit="openEditForm"
      @delete="handleDelete"
      @select="handleActivitySelect"
    />

    <!-- Modal Form -->
    <div v-if="showForm" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="modal-overlay fixed inset-0" @click="closeForm"></div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <ActivityForm
            :activity="editingActivity"
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
import { ref, onMounted } from 'vue';
import { useActivities } from '../composables/useActivities.js';
import ActivityTable from './ActivityTable.vue';
import ActivityForm from './ActivityForm.vue';
import { debounce } from '../utils/helpers.js';

export default {
  name: 'ActivityManager',
  components: {
    ActivityTable,
    ActivityForm
  },
  emits: ['activity-selected'],
  setup(props, { emit }) {
    const { activities, loading, error, loadActivities, createActivity, updateActivity, deleteActivity, searchActivities } = useActivities();

    const showForm = ref(false);
    const editingActivity = ref(null);
    const searchQuery = ref('');
    const isEdit = ref(false);

    const debouncedSearch = debounce(async (query) => {
      if (query.trim()) {
        await searchActivities(query);
      } else {
        await loadActivities();
      }
    }, 300);

    const handleSearch = (query) => {
      searchQuery.value = query;
      debouncedSearch(query);
    };

    const openCreateForm = () => {
      editingActivity.value = null;
      isEdit.value = false;
      showForm.value = true;
    };

    const openEditForm = (activity) => {
      editingActivity.value = activity;
      isEdit.value = true;
      showForm.value = true;
    };

    const closeForm = () => {
      showForm.value = false;
      editingActivity.value = null;
      isEdit.value = false;
    };

    const handleFormSubmit = async (formData) => {
      try {
        if (isEdit.value && editingActivity.value) {
          await updateActivity(editingActivity.value.id, formData);
        } else {
          await createActivity(formData);
        }
        closeForm();
      } catch (err) {
        console.error('Failed to save activity:', err);
      }
    };

    const handleDelete = async (id) => {
      try {
        await deleteActivity(id);
      } catch (err) {
        console.error('Failed to delete activity:', err);
      }
    };

    const handleActivitySelect = (activity) => {
      emit('activity-selected', activity);
    };

    onMounted(() => {
      loadActivities();
    });

    return {
      activities,
      loading,
      error,
      showForm,
      editingActivity,
      searchQuery,
      isEdit,
      openCreateForm,
      openEditForm,
      closeForm,
      handleFormSubmit,
      handleDelete,
      handleActivitySelect,
      handleSearch
    };
  }
};
</script>
