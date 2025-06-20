import { createListResource, createResource } from 'frappe-ui'
import { session } from './session'

export let todos = createListResource({
  doctype: 'ToDo',
  fields: [
    'name',
    'description',
    'status',
    'date',
    'owner',
    'allocated_to',
    'priority',
  
  ],
filters: [
  ['allocated_to', '=', session.user],
  ['status', 'not in', ['Cancelled', 'Closed']],
],
  cache: 'ERPNext ToDos',
  orderBy: 'priority asc',
})

export async function update_todo_sequence(_todos, e) {
  if (e.removed?.element) {
    await todos.delete.submit(e.removed.element.name)
    return
  } else if (e.added?.element) {
    let todo = e.added.element
    let _todo = await todos.insert.submit({
      description: todo.description,
      status: 'Open',
    })
    todo.name = _todo.name
  }
  todos.reload()
}