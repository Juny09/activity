<template>
  <div class="bg-white p-6 rounded-lg shadow-lg">
    <h3 class="text-lg font-semibold mb-4">
      {{ isEdit ? 'Edit Activity' : 'Create New Activity' }}
    </h3>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Activity Name -->
      <div>
        <label class="form-label">Activity Name *</label>
        <input
          v-model="form.name"
          type="text"
          class="form-input"
          :class="{ 'border-red-500': errors.name }"
          placeholder="Enter activity name"
        />
        <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
      </div>

      <!-- Description -->
      <div>
        <label class="form-label">Description *</label>
        <textarea
          v-model="form.description"
          class="form-input"
          :class="{ 'border-red-500': errors.description }"
          rows="3"
          placeholder="Describe the activity"
        ></textarea>
        <p v-if="errors.description" class="text-red-500 text-sm mt-1">{{ errors.description }}</p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- Sport Type -->
        <div>
          <label class="form-label">Sport Type *</label>
          <select
            v-model="form.sportType"
            class="form-input"
            :class="{ 'border-red-500': errors.sportType }"
          >
            <option value="">Select sport type</option>
            <option v-for="type in sportTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
          <p v-if="errors.sportType" class="text-red-500 text-sm mt-1">{{ errors.sportType }}</p>
        </div>

        <!-- Team Size -->
        <div>
          <label class="form-label">Team Size</label>
          <select v-model="form.teamSize" class="form-input">
            <option value="">Select team size</option>
            <option v-for="size in teamSizes" :key="size" :value="size">
              {{ size }}
            </option>
          </select>
        </div>

        <!-- Location -->
        <div>
          <label class="form-label">Location</label>
          <select v-model="form.location" class="form-input">
            <option value="">Select location</option>
            <option v-for="location in locations" :key="location" :value="location">
              {{ location }}
            </option>
          </select>
        </div>

        <!-- Time Required -->
        <div>
          <label class="form-label">Time Required</label>
          <select v-model="form.timeRequired" class="form-input">
            <option value="">Select time</option>
            <option v-for="time in timeOptions" :key="time" :value="time">
              {{ time }}
            </option>
          </select>
        </div>
      </div>

      <!-- Facilitation Tips -->
      <div>
        <label class="form-label">Facilitation Tips</label>
        <div class="flex gap-2 mb-2">
          <input
            v-model="tipInput"
            type="text"
            class="form-input flex-1"
            placeholder="Add a facilitation tip"
            @keyup.enter="addTip"
          />
          <button
            type="button"
            @click="addTip"
            class="btn-secondary"
          >
            Add
          </button>
        </div>
        <div v-if="form.facilitationTips.length > 0" class="space-y-2">
          <div
            v-for="(tip, index) in form.facilitationTips"
            :key="index"
            class="flex items-center justify-between bg-gray-50 p-2 rounded"
          >
            <span class="text-sm">{{ tip }}</span>
            <button
              type="button"
              @click="removeTip(index)"
              class="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end gap-2 pt-4 border-t">
        <button
          type="button"
          @click="handleCancel"
          class="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="btn-primary"
        >
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
      sportType: '',
      teamSize: '',
      location: '',
      timeRequired: '',
      facilitationTips: []
    });

    const tipInput = ref('');
    const errors = ref({});

    const sportTypes = [
      'Badminton',
      'Pickle Ball',
      'Tennis',
      'Volleyball',
      'Golf',
      'GYM',
      'Yamcha',
      'ApaLJ'
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
          sportType: newActivity.sport_type || '',
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

      if (!form.value.sportType) {
        errors.value.sportType = 'Sport type is required';
      }

      return Object.keys(errors.value).length === 0;
    };

    const handleSubmit = () => {
      if (validateForm()) {
        emit('submit', { ...form.value });
      }
    };

    const handleCancel = () => {
      emit('cancel');
    };

    return {
      form,
      tipInput,
      errors,
      sportTypes,
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
