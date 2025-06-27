<template>
  <div class="activity-manager">
    <!-- Header Section -->
    <div class="section-header">
      <div class="header-content">
        <div>
          <h2 class="section-title">Activity Management</h2>
          <p class="section-subtitle">Create and manage your team activities</p>
        </div>
        <button @click="openCreateForm" class="btn-primary create-btn">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Create Activity
        </button>
      </div>
    </div>

    <!-- Search Section -->
    <div class="search-section">
      <div class="search-container">
        <svg class="search-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <input
          :value="searchQuery"
          @input="handleSearch($event.target.value)"
          type="text"
          placeholder="Search activities by name or description..."
          class="search-input form-input"
        />
      </div>
      <div v-if="searchQuery" class="search-results-info">
        <span class="results-count">{{ activities.length }} result{{ activities.length !== 1 ? 's' : '' }} found</span>
        <button @click="clearSearch" class="clear-search">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-banner">
      <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
      </svg>
      {{ error }}
    </div>

    <!-- Activities Grid -->
    <div class="activities-grid">
      <ActivityTable
        :activities="activities"
        :loading="loading"
        @edit="openEditForm"
        @delete="handleDelete"
        @select="handleActivitySelect"
      />
    </div>

    <!-- Enhanced Modal -->
    <teleport to="body">
      <div v-if="showForm" class="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="modal-backdrop absolute inset-0" @click="closeForm"></div>
        <div class="modal-content relative w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <ActivityForm
            :activity="editingActivity"
            :is-edit="isEdit"
            @submit="handleFormSubmit"
            @cancel="closeForm"
          />
        </div>
      </div>
    </teleport>
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

    const clearSearch = () => {
      searchQuery.value = '';
      loadActivities();
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
      handleSearch,
      clearSearch
    };
  }
};
</script>

<style scoped>
.activity-manager {
  margin-bottom: 2rem;
}

.section-header {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-2xl);
  padding: 2rem;
  box-shadow: var(--shadow-lg);
  border: 1px solid rgba(255, 255, 255, 0.3);
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--secondary-900);
  margin: 0;
}

.section-subtitle {
  color: var(--secondary-600);
  margin-top: 0.5rem;
  font-size: 1rem;
}

.create-btn {
  position: relative;
  overflow: hidden;
}

.create-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.create-btn:hover::before {
  left: 100%;
}

.search-section {
  margin-bottom: 2rem;
}

.search-results-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding: 1rem;
  background: var(--primary-50);
  border-radius: var(--radius-lg);
  border: 1px solid var(--primary-200);
}

.results-count {
  color: var(--primary-700);
  font-weight: 500;
}

.clear-search {
  background: none;
  border: none;
  color: var(--primary-600);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.clear-search:hover {
  background: var(--primary-100);
}

.error-banner {
  display: flex;
  align-items: center;
  background: var(--error-50);
  color: var(--error-700);
  padding: 1rem 1.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--error-200);
  margin-bottom: 2rem;
}

.activities-grid {
  animation: fadeIn 0.6s ease forwards;
}

.modal-backdrop {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(8px);
}

.modal-content {
  transform: scale(0.95);
  animation: modalIn 0.3s ease forwards;
}

@keyframes modalIn {
  to {
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .search-container {
    max-width: 100%;
  }
}
</style>
