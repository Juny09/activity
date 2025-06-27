<template>
  <div class="form-container">
    <div class="form-header">
      <div class="form-icon">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
      </div>
      <div>
        <h3 class="form-title">{{ isEdit ? 'Edit Activity' : 'Create New Activity' }}</h3>
        <p class="form-subtitle">{{ isEdit ? 'Update activity details' : 'Add a new team activity to your collection' }}</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="form-content">
      <!-- Activity Name -->
      <div class="form-group">
        <label class="form-label required">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
          </svg>
          Activity Name
        </label>
        <input
          v-model="form.name"
          type="text"
          class="form-input"
          :class="{ 'error': errors.name }"
          placeholder="Enter a descriptive activity name"
        />
        <div v-if="errors.name" class="form-error">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          {{ errors.name }}
        </div>
      </div>

      <!-- Description -->
      <div class="form-group">
        <label class="form-label required">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
          </svg>
          Description
        </label>
        <textarea
          v-model="form.description"
          class="form-input"
          :class="{ 'error': errors.description }"
          rows="4"
          placeholder="Describe what this activity involves and its purpose"
        ></textarea>
        <div v-if="errors.description" class="form-error">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          {{ errors.description }}
        </div>
      </div>

      <!-- Form Grid -->
      <div class="form-grid">
        <!-- Meeting Type -->
        <div class="form-group">
          <label class="form-label required">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            Meeting Type
          </label>
          <div class="select-wrapper">
            <select
              v-model="form.meetingType"
              class="form-input"
              :class="{ 'error': errors.meetingType }"
            >
              <option value="">Select meeting type</option>
              <option v-for="type in meetingTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>
          <div v-if="errors.meetingType" class="form-error">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            {{ errors.meetingType }}
          </div>
        </div>

        <!-- Team Size -->
        <div class="form-group">
          <label class="form-label">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
            </svg>
            Team Size
          </label>
          <div class="select-wrapper">
            <select v-model="form.teamSize" class="form-input">
              <option value="">Select team size</option>
              <option v-for="size in teamSizes" :key="size" :value="size">
                {{ size }}
              </option>
            </select>
          </div>
        </div>

        <!-- Location -->
        <div class="form-group">
          <label class="form-label">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Location
          </label>
          <div class="select-wrapper">
            <select v-model="form.location" class="form-input">
              <option value="">Select location</option>
              <option v-for="location in locations" :key="location" :value="location">
                {{ location }}
              </option>
            </select>
          </div>
        </div>

        <!-- Time Required -->
        <div class="form-group">
          <label class="form-label">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Time Required
          </label>
          <div class="select-wrapper">
            <select v-model="form.timeRequired" class="form-input">
              <option value="">Select time</option>
              <option v-for="time in timeOptions" :key="time" :value="time">
                {{ time }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Facilitation Tips -->
      <div class="form-group">
        <label class="form-label">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
          Facilitation Tips
        </label>
        <div class="tips-input-group">
          <input
            v-model="tipInput"
            type="text"
            class="form-input tip-input"
            placeholder="Add a helpful facilitation tip"
            @keyup.enter="addTip"
          />
          <button
            type="button"
            @click="addTip"
            class="btn-secondary add-tip-btn"
            :disabled="!tipInput.trim()"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add
          </button>
        </div>

        <div v-if="form.facilitationTips.length > 0" class="tips-list">
          <transition-group name="tip" tag="div" class="tips-container">
            <div
              v-for="(tip, index) in form.facilitationTips"
              :key="`tip-${index}`"
              class="tip-item"
            >
              <div class="tip-content">
                <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                </svg>
                <span>{{ tip }}</span>
              </div>
              <button
                type="button"
                @click="removeTip(index)"
                class="remove-tip-btn"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </transition-group>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <button
          type="button"
          @click="handleCancel"
          class="btn-secondary cancel-btn"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Cancel
        </button>
        <button
          type="submit"
          class="btn-primary submit-btn"
          :disabled="isSubmitting"
        >
          <svg v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          {{ isEdit ? 'Update Activity' : 'Create Activity' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'ActivityForm',
  props: {
    activity: {
      type: Object,
      default: null
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const form = ref({
      name: '',
      description: '',
      meetingType: '',
      teamSize: '',
      location: '',
      timeRequired: '',
      facilitationTips: []
    });

    const tipInput = ref('');
    const errors = ref({});
    const isSubmitting = ref(false);

    const meetingTypes = [
      'Team Building',
      'Brainstorming',
      'Retrospective',
      'Kickoff Meeting',
      'Problem Solving',
      'Strategy Session',
      'Creative Workshop',
      'All Hands Meeting'
    ];

    const teamSizes = ['2-5 people', '6-10 people', '11-20 people', '20+ people'];
    const locations = ['In-person', 'Virtual', 'Hybrid'];
    const timeOptions = ['5-10 minutes', '15-20 minutes', '30 minutes', '45-60 minutes'];

    // Watch for activity prop changes
    watch(() => props.activity, (newActivity) => {
      if (newActivity) {
        form.value = {
          name: newActivity.name || '',
          description: newActivity.description || '',
          meetingType: newActivity.meeting_type || '',
          teamSize: newActivity.team_size || '',
          location: newActivity.location || '',
          timeRequired: newActivity.time_required || '',
          facilitationTips: newActivity.facilitation_tips || []
        };
      }
    }, { immediate: true });

    const addTip = () => {
      if (tipInput.value.trim()) {
        form.value.facilitationTips.push(tipInput.value.trim());
        tipInput.value = '';
      }
    };

    const removeTip = (index) => {
      form.value.facilitationTips.splice(index, 1);
    };

    const validateForm = () => {
      errors.value = {};

      if (!form.value.name.trim()) {
        errors.value.name = 'Activity name is required';
      }

      if (!form.value.description.trim()) {
        errors.value.description = 'Description is required';
      }

      if (!form.value.meetingType) {
        errors.value.meetingType = 'Meeting type is required';
      }

      return Object.keys(errors.value).length === 0;
    };

    const handleSubmit = async () => {
      if (validateForm()) {
        isSubmitting.value = true;
        try {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
          emit('submit', { ...form.value });
        } finally {
          isSubmitting.value = false;
        }
      }
    };

    const handleCancel = () => {
      emit('cancel');
    };

    return {
      form,
      tipInput,
      errors,
      isSubmitting,
      meetingTypes,
      teamSizes,
      locations,
      timeOptions,
      addTip,
      removeTip,
      handleSubmit,
      handleCancel
    };
  }
};
</script>

<style scoped>
.form-container {
  background: white;
  border-radius: var(--radius-2xl);
  max-width: 800px;
  margin: 0 auto;
  box-shadow: var(--shadow-2xl);
  overflow: hidden;
}

.form-header {
  background: var(--gradient-primary);
  color: white;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.form-icon {
  background: rgba(255, 255, 255, 0.2);
  padding: 1rem;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.form-subtitle {
  opacity: 0.9;
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.form-content {
  padding: 2rem;
}

.form-group {
  margin-bottom: 2rem;
}

.form-label {
  display: flex;
  align-items: center;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--secondary-700);
  margin-bottom: var(--space-2);
}

.form-label.required::after {
  content: '*';
  color: var(--error-500);
  margin-left: 0.25rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.select-wrapper {
  position: relative;
}

.select-wrapper::after {
  content: '';
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid var(--secondary-400);
  pointer-events: none;
}

.tips-input-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.tip-input {
  flex: 1;
}

.add-tip-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tips-list {
  margin-top: 1rem;
}

.tips-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tip-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--warning-50);
  border: 1px solid var(--warning-200);
  border-radius: var(--radius-lg);
  padding: 1rem;
  transition: all 0.2s ease;
}

.tip-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--secondary-700);
}

.remove-tip-btn {
  background: var(--error-50);
  color: var(--error-600);
  border: none;
  padding: 0.5rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-tip-btn:hover {
  background: var(--error-100);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 2px solid var(--secondary-100);
  margin-top: 2rem;
}

.cancel-btn {
  min-width: 120px;
}

.submit-btn {
  min-width: 150px;
}

/* Transitions */
.tip-enter-active, .tip-leave-active {
  transition: all 0.3s ease;
}

.tip-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.tip-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

@media (max-width: 768px) {
  .form-container {
    border-radius: var(--radius-xl);
    margin: 0;
  }

  .form-header {
    padding: 1.5rem;
    flex-direction: column;
    text-align: center;
  }

  .form-content {
    padding: 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .tips-input-group {
    flex-direction: column;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .cancel-btn,
  .submit-btn {
    width: 100%;
  }
}
</style>
