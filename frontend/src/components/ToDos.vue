<template>
  <div class="flex flex-col border border-l w-112 h-full">
    <div class="text-center text-gray-700 text-xl h-13 flex justify-center items-center border-b p-3 mb-3 shrink-0">
      ToDo List
    </div>

 <!-- ✅ Date Filter Section -->
<div class="px-6 pb-2 flex justify-center">
  <div class="flex items-center gap-2 w-1/2">
    <label for="date" class="text-gray-700 text-sm font-medium">Date</label>
    <input
      id="date"
      type="date"
      v-model="selectedDate"
      class="flex-1 border rounded px-2 py-1 text-sm text-gray-700"
    />
  </div>
</div>

    <!-- ✅ Paginated Filtered List -->
    <div v-if="paginatedTodos.length" class="flex items-center">
      <draggable
        :list="paginatedTodos"
        group="note"
        class="w-full mx-6"
        handle=".drag-handle"
        :animation="200"
        easing="cubic-bezier(0.34, 1.56, 0.64, 1)"
        item-key="name"
        data-name="todo"
        @change="(e) => update_todo_sequence(filteredTodos, e)"
      >
        <template #item="{ element }">
          <div class="group flex items-center py-2 last:mb-0 cursor-pointer">
            <ToDo :todo="element" />
          </div>
        </template>
      </draggable>
    </div>

    <!-- ✅ Pagination Controls -->
    <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 mt-2 text-sm text-gray-600">
      <button
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="px-2 py-1 border rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        @click="currentPage++"
        :disabled="currentPage === totalPages"
        class="px-2 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>

    <AddToDo class="mx-6 my-2" />
  </div>
</template>

<script setup>
import AddToDo from './AddToDo.vue'
import draggable from 'vuedraggable'
import ToDo from './ToDo.vue'
import { update_todo_sequence, todos } from '../data/todos'
import { onMounted, ref, computed, watch } from 'vue'

onMounted(() => todos.fetch())

const currentPage = ref(1)
const itemsPerPage = 10
const selectedDate = ref('') // in 'YYYY-MM-DD' format

// ✅ Reset to page 1 when date filter changes
watch(selectedDate, () => {
  currentPage.value = 1
})

// ✅ Filter based on todo.date (NOT creation)
const filteredTodos = computed(() => {
  if (!todos.data) return []
  if (!selectedDate.value) return todos.data
  return todos.data.filter((todo) => todo.date === selectedDate.value)
})

// ✅ Pagination: total pages
const totalPages = computed(() => {
  return Math.ceil(filteredTodos.value.length / itemsPerPage)
})

// ✅ Pagination: paginated result
const paginatedTodos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredTodos.value.slice(start, start + itemsPerPage)
})
</script>
