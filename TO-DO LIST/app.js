

    // Simple To-Do app with localStorage, add, edit (double click), toggle, delete and filters
    const STORAGE_KEY = 'todo_list_v1'
    let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    let filter = 'all'

    const $tasks = document.getElementById('tasks')
    const $input = document.getElementById('taskInput')
    const $addBtn = document.getElementById('addBtn')
    const $count = document.getElementById('count')
    const $clearCompleted = document.getElementById('clearCompleted')

    function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)) }

    function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,8) }

    function addTask(text){
      if(!text || !text.trim()) return
      tasks.unshift({id:uid(), text:text.trim(), done:false})
      save()
      render()
    }

    function toggleTask(id){
      tasks = tasks.map(t => t.id===id ? {...t, done: !t.done} : t)
      save(); render()
    }

    function deleteTask(id){
      tasks = tasks.filter(t => t.id!==id)
      save(); render()
    }

    function editTask(id, newText){
      tasks = tasks.map(t => t.id===id ? {...t, text: newText.trim()} : t)
      save(); render()
    }

    function clearCompleted(){ tasks = tasks.filter(t => !t.done); save(); render() }

    function setFilter(f){ filter = f; render(); highlightFilter() }

    function highlightFilter(){
      document.querySelectorAll('[data-filter]').forEach(b=>{
        b.style.boxShadow = b.dataset.filter===filter ? 'inset 0 -2px 0 0 var(--accent)' : 'none'
      })
    }

    function filteredTasks(){
      if(filter==='active') return tasks.filter(t=>!t.done)
      if(filter==='completed') return tasks.filter(t=>t.done)
      return tasks
    }

    function render(){
      $tasks.innerHTML = ''
      const list = filteredTasks()
      for(const t of list){
        const li = document.createElement('li')
        li.className = 'task' + (t.done ? ' completed' : '')
        li.dataset.id = t.id

        const cb = document.createElement('div')
        cb.className = 'checkbox'
        cb.tabIndex = 0
        cb.setAttribute('role','checkbox')
        cb.setAttribute('aria-checked', String(!!t.done))
        cb.addEventListener('click', ()=> toggleTask(t.id))
        cb.addEventListener('keydown', e=>{ if(e.key==='Enter' || e.key===' ') toggleTask(t.id) })
        cb.innerHTML = t.done ? '✓' : ''

        const label = document.createElement('div')
        label.className = 'label'
        label.textContent = t.text
        label.title = 'Double-click to edit'
        label.addEventListener('dblclick', ()=> startEdit(t.id, label))

        const actions = document.createElement('div')
        actions.className = 'actions'

        const del = document.createElement('button')
        del.className = 'btn'
        del.innerText = 'Delete'
        del.addEventListener('click', ()=> deleteTask(t.id))

        actions.appendChild(del)
        li.appendChild(cb)
        li.appendChild(label)
        li.appendChild(actions)
        $tasks.appendChild(li)
      }
      $count.textContent = tasks.length + (tasks.length===1 ? ' task' : ' tasks')
      highlightFilter()
    }

    function startEdit(id, labelEl){
      const orig = labelEl.textContent
      const input = document.createElement('input')
      input.value = orig
      input.style.width = '100%'
      input.addEventListener('keydown', e=>{
        if(e.key==='Enter'){ finish() }
        if(e.key==='Escape'){ cancel() }
      })
      input.addEventListener('blur', finish)

      function finish(){
        const v = input.value
        if(v.trim()) editTask(id, v)
        else editTask(id, orig) // don't save empty
      }
      function cancel(){ render() }

      labelEl.innerHTML = ''
      labelEl.appendChild(input)
      input.focus()
      input.setSelectionRange(orig.length, orig.length)
    }

    // Event listeners
    $addBtn.addEventListener('click', ()=>{ addTask($input.value); $input.value=''; $input.focus() })
    $input.addEventListener('keydown', e=>{ if(e.key==='Enter'){ addTask($input.value); $input.value=''; } })
    document.querySelectorAll('[data-filter]').forEach(b=> b.addEventListener('click', ()=> setFilter(b.dataset.filter)))
    $clearCompleted.addEventListener('click', clearCompleted)

    // initialize default filter buttons (attach data-filter to created nodes)
    // create filter buttons data attributes
    document.querySelectorAll('.filters button').forEach((b)=>{
      if(!b.dataset.filter) {
        if(b.textContent.trim().toLowerCase()==='all') b.dataset.filter='all'
        if(b.textContent.trim().toLowerCase()==='active') b.dataset.filter='active'
        if(b.textContent.trim().toLowerCase()==='completed') b.dataset.filter='completed'
      }
    })

    // initial render
    render()
