<template>
  <div class="flex justify-center gap-1 hover:bg-gray-50 p-1 rounded">
    <div class="mt-1 ml-10">
      <Checkbox class="p-0.5 text-gray-500" disabled />
    </div>
    <TextInput
      class="w-full [&>input]:border-0"
      variant="outline"
      v-model="newTitle"
      placeholder="Add a new task"
      @keydown.enter.stop="addNewToDo"
    />
  </div>
</template>

<script setup>
import { TextInput, Checkbox } from 'frappe-ui'
import { todos } from '../data/todos'
import { session } from '../data/session' // ✅ Import session for allocated_to
import { ref } from 'vue'
// const emit = defineEmits(['todo-added'])

const newTitle = ref('')

function addNewToDo() {
  if (!newTitle.value?.trim()) return

  todos.insert
    .submit({
      // custom_title: newTitle.value,
      description: newTitle.value,
      status: 'Open',
      allocated_to: session.user, 
    })
    .then(() => {     
       todos.fetch()

      newTitle.value = ''
    })
}
</script>

