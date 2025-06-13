import { createListResource, createResource, dayjs } from 'frappe-ui'
import { session } from './session'
import { useStore } from '../store'


export let notes = createListResource({
  doctype: 'Note',
  fields: ['name', 'title', 'content', 'public'],
  filters: [['owner', '=', session.user]],
  cache: 'Notes',
  orderBy: 'modified desc',
})

export async function update_note_sequence(_notes, e) {
  if (e.removed?.element) {
    let note = e.removed.element
    await notes.delete.submit(note.name)
    return
  }

  if (e.added?.element) {
    let note = e.added.element
    let note_index = _notes.findIndex((n) => n.name === note.name)

    let _note = await notes.insert.submit({
      title: note.title,
      content: note.content || '', 
      public: 1,
    })

    note.name = _note.name
    note.date = store.date
  }
   window.location.reload()
  }
