<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900">User Registrations</h3>
    </div>

    <div v-if="loading" class="p-8 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-500">Loading registrations...</p>
    </div>

    <div v-else-if="registrations.length === 0" class="p-8 text-center text-gray-500">
      No registrations found.
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th v-if="showActivityColumn" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Activity
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Registered
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="registration in registrations"
            :key="registration.id"
            class="table-row"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">
                {{ registration.user_name }}
              </div>
            </td>
            <td v-if="showActivityColumn" class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">
                {{ registration.activities?.name || 'Unknown Activity' }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ registration.email || 'N/A' }}</div>
              <div class="text-sm text-gray-500">{{ registration.phone || 'N/A' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDateTime(registration.registered_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex space-x-2">
                <button
                  @click="handleEdit(registration)"
                  class="text-blue-600 hover:text-blue-900 transition-colors"
                >
                  Edit
                </button>
                <button
                  @click="handleDelete(registration)"
                  class="text-red-600 hover:text-red-900 transition-colors"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { formatDateTime } from '../utils/helpers.js';

export default {
  name: 'RegistrationTable',
  props: {
    registrations: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    showActivityColumn: {
      type: Boolean,
      default: true
    }
  },
  emits: ['edit', 'delete'],
  setup(props, { emit }) {
    const handleEdit = (registration) => {
      emit('edit', registration);
    };

    const handleDelete = (registration) => {
      if (confirm(`Are you sure you want to delete registration for "${registration.user_name}"?`)) {
        emit('delete', registration.id);
      }
    };

    return {
      handleEdit,
      handleDelete,
      formatDateTime
    };
  }
};
</script>
