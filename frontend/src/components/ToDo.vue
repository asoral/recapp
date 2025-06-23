<template>
  <div class="flex flex-col gap-4 flex-1">
    <div class="flex flex-col gap-2 flex-1 hover:bg-gray-50 p-1 rounded">
      <div class="flex items-start justify-between gap-2">
        <div class="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
          <Button class="drag-handle p-0.5" variant="ghosted" title="Drag to move">
            <DragIcon />
          </Button>
        </div>
        <div class="flex flex-1 gap-3" @click="showUpdateToDoModal = true">
          <div class="mt-[3.5px]">
            <Checkbox
              @click.stop
              :checked="todo.status === 'Closed'"
              class="p-0.5 text-gray-500"
              @change="markAsCompleted"
            />
            
          </div>
          <div class="title-description">
            <div class="title-link flex items-center gap-2 min-h-7">
              <div
                class="text-lg leading-normal font-medium select-none"
                :class="{ 'line-through': todo.status === 'Closed' }"
              >
                {{  todo.description}}
              </div>
            </div>
          </div>
        </div>
        <div class="transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100">
          <Button class="!p-0.5 !text-gray-500" icon="copy" variant="ghost" @click="duplicate(todo)" title="Duplicate" />
          <Button class="!p-0.5 !text-gray-500" icon="x" variant="ghost" @click="deleteTodo(todo.name)" title="Delete" />
        </div>
      </div>
    </div>
  </div>
  <UpdateToDoModal v-model="showUpdateToDoModal" :todo="todo" />
</template>

<script setup>
import UpdateToDoModal from './UpdateToDoModal.vue'
import { FeatherIcon, Button, Checkbox } from 'frappe-ui'
import { todos } from '../data/todos'
import DragIcon from './icons/DragIcon.vue'
import { ref, inject } from 'vue'
import { session } from '../data/session' // ✅ Import session for allocated_to

const props = defineProps({
  todo: Object,
})

let dialog = inject('$dialog')
const showUpdateToDoModal = ref(false)

function markAsCompleted() {
  const isDone = props.todo.status === 'Closed'
  todos.setValue
    .submit({
      name: props.todo.name,
      status: isDone ? 'Open' : 'Closed',
    })
    .then(() => todos.reload())
}

function deleteTodo(name) {
  dialog({
    title: 'Delete todo',
    message: 'Are you sure you want to delete this todo?',
    actions: [
      {
        label: 'Delete',
        variant: 'solid',
        theme: 'red',
        onClick: ({ close }) => {
          return todos.delete.submit(name).then(() => {
            todos.reload()
            close()
          })
        },
      },
      { label: 'Cancel' },
    ],
  })
}

// function duplicate(todo) {
//   todos.insert
//     .submit({
//       custom_title: todo.custom_title,
//       description: todo.description,
//       status: 'Open',
//     })
//     .then(() => todos.fetch())
//     window.location.reload() 
// }

function duplicate(todo) {
  todos.insert
    .submit({
      description: todo.description,
     status:'Open',
     allocated_to: session.user, 

    })
    .then(() => {
      todos.reload()
      window.location.reload()
    })
}
</script>
