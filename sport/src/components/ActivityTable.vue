<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900">Activities</h3>
    </div>

    <div v-if="loading" class="p-8 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-500">Loading activities...</p>
    </div>

    <div v-else-if="activities.length === 0" class="p-8 text-center text-gray-500">
      No activities found. Create your first activity!
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Activity
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type & Details
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="activity in activities"
            :key="activity.id"
            class="table-row cursor-pointer"
            @click="handleSelect(activity)"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div>
                <div class="text-sm font-medium text-gray-900">
                  {{ activity.name }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ truncateText(activity.description, 60) }}
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ activity.meeting_type || 'N/A' }}</div>
              <div class="text-sm text-gray-500">
                {{ activity.team_size || 'Any size' }} • {{ activity.time_required || 'Flexible' }}
              </div>
              <div class="text-sm text-gray-500">{{ activity.location || 'Any location' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDateTime(activity.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex space-x-2">
                <button
                  @click.stop="handleEdit(activity)"
                  class="text-blue-600 hover:text-blue-900 transition-colors"
                >
                  Edit
                </button>
                <button
                  @click.stop="handleDelete(activity)"
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
import { formatDateTime, truncateText } from '../utils/helpers.js';

export default {
  name: 'ActivityTable',
  props: {
    activities: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['edit', 'delete', 'select'],
  setup(props, { emit }) {
    const handleEdit = (activity) => {
      emit('edit', activity);
    };

    const handleDelete = (activity) => {
      if (confirm(`Are you sure you want to delete "${activity.name}"?`)) {
        emit('delete', activity.id);
      }
    };

    const handleSelect = (activity) => {
      emit('select', activity);
    };

    return {
      handleEdit,
      handleDelete,
      handleSelect,
      formatDateTime,
      truncateText
    };
  }
};
</script>
