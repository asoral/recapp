import { createListResource, createResource, dayjs } from 'frappe-ui'
import { session } from './session'
import { useStore } from '../store'


export let notes = createListResource({
  doctype: 'Note',
  fields: ['name', 'title', 'creation', 'content'],
  filters: [['owner', '=', session.user]],
  orderBy: 'creation asc',
  transform: (note) => {
    note.date = dayjs(note.creation).format('YYYY-MM-DD')  // ✅ FIXED
    return note
  }
  
})
export async function update_note_sequence(_notes, e) {
  if (e.removed?.element) {
    let note = e.removed.element
    await notes.delete.submit(note.name)
    return
  }

  if (e.added?.element) {
    const store = useStore()

    let note = e.added.element
    let note_index = _notes.findIndex((n) => n.name === note.name)

    let _note = await notes.insert.submit({
      title: note.title,
      content: note.content || '', 
    })

    note.name = _note.name
    note.date = store.date
    
  }
 
   window.location.reload()
   
  }




