<template>
  <div class="bg-white p-6 rounded-lg shadow-lg">
    <h3 class="text-lg font-semibold mb-4">
      {{ isEdit ? 'Edit Registration' : 'New Registration' }}
    </h3>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Activity Selection -->
      <div>
        <label class="form-label">Activity *</label>
        <select
          v-model="form.activityId"
          class="form-input"
          :class="{ 'border-red-500': errors.activityId }"
          :disabled="selectedActivityId && !isEdit"
        >
          <option value="">Select an activity</option>
          <option
            v-for="option in activityOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
        <p v-if="errors.activityId" class="text-red-500 text-sm mt-1">{{ errors.activityId }}</p>
      </div>

      <!-- User Name -->
      <div>
        <label class="form-label">User Name *</label>
        <input
          v-model="form.userName"
          type="text"
          class="form-input"
          :class="{ 'border-red-500': errors.userName }"
          placeholder="Enter user name"
        />
        <p v-if="errors.userName" class="text-red-500 text-sm mt-1">{{ errors.userName }}</p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- Email -->
        <div>
          <label class="form-label">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="form-input"
            :class="{ 'border-red-500': errors.email }"
            placeholder="user@example.com"
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <!-- Phone -->
        <div>
          <label class="form-label">Phone</label>
          <input
            v-model="form.phone"
            type="tel"
            class="form-input"
            :class="{ 'border-red-500': errors.phone }"
            placeholder="+1234567890"
          />
          <p v-if="errors.phone" class="text-red-500 text-sm mt-1">{{ errors.phone }}</p>
        </div>
      </div>

      <!-- Registration Date/Time -->
      <div>
        <label class="form-label">Registration Date & Time</label>
        <input
          v-model="form.registeredAt"
          type="datetime-local"
          class="form-input"
        />
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
          {{ isEdit ? 'Update Registration' : 'Register User' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { validateEmail, validatePhone } from '../utils/helpers.js';

export default {
  name: 'RegistrationForm',
  props: {
    registration: {
      type: Object,
      default: null
    },
    activityOptions: {
      type: Array,
      default: () => []
    },
    selectedActivityId: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const form = ref({
      activityId: '',
      userName: '',
      email: '',
      phone: '',
      registeredAt: ''
    });

    const errors = ref({});

    // Watch for registration prop changes
    watch(() => props.registration, (newRegistration) => {
      if (newRegistration) {
        form.value = {
          activityId: newRegistration.activity_id || '',
          userName: newRegistration.user_name || '',
          email: newRegistration.email || '',
          phone: newRegistration.phone || '',
          registeredAt: newRegistration.registered_at ?
            new Date(newRegistration.registered_at).toISOString().slice(0, 16) : ''
        };
      }
    }, { immediate: true });

    // Watch for selectedActivityId changes
    watch(() => props.selectedActivityId, (newActivityId) => {
      if (newActivityId && !props.isEdit) {
        form.value.activityId = newActivityId;
      }
    }, { immediate: true });

    const validateForm = () => {
      errors.value = {};

      if (!form.value.activityId) {
        errors.value.activityId = 'Please select an activity';
      }

      if (!form.value.userName.trim()) {
        errors.value.userName = 'User name is required';
      }

      if (form.value.email && !validateEmail(form.value.email)) {
        errors.value.email = 'Please enter a valid email address';
      }

      if (form.value.phone && !validatePhone(form.value.phone)) {
        errors.value.phone = 'Please enter a valid phone number';
      }

      return Object.keys(errors.value).length === 0;
    };

    const handleSubmit = () => {
      if (validateForm()) {
        const submissionData = { ...form.value };
        if (submissionData.registeredAt) {
          submissionData.registeredAt = new Date(submissionData.registeredAt).toISOString();
        } else {
          submissionData.registeredAt = new Date().toISOString();
        }
        emit('submit', submissionData);
      }
    };

    const handleCancel = () => {
      emit('cancel');
    };

    // Set default date/time to now if not editing
    if (!props.isEdit) {
      form.value.registeredAt = new Date().toISOString().slice(0, 16);
    }

    return {
      form,
      errors,
      validateForm,
      handleSubmit,
      handleCancel
    };
  }
};
</script>
