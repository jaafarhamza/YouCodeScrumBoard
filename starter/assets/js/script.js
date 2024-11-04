
function addButton() {
  let form = document.getElementById('modal-task');
  form.style.display = 'block';
  let deletee = document.getElementById('task-delete-btn');
  deletee.style.display = 'none';
  let update = document.getElementById('task-update-btn');
  update.style.display = 'none';
  document.getElementById('task-save-btn').style.display = 'inline-block';
  clearModalFields();
}

function cancelButton() {
  let form = document.getElementById('modal-task');
  form.style.display = 'none';
}

                                           //  modal 

function clearModalFields() {
  document.getElementById('task-title').value = '';
  document.querySelector('input[name="task-type"]:checked').checked = false;
  document.getElementById('task-priority').value = '';
  document.getElementById('task-status').value = '';
  document.getElementById('task-date').value = '';
  document.getElementById('task-description').value = '';
}

                                           // close modal

function closeModal() {
  document.getElementById('modal-task').style.display = 'none'; // Hide modal
}

                                            //save 

function saveTask() {

  let title = document.getElementById('task-title').value;
  let typeElement = document.querySelector('input[name="task-type"]:checked');
  let priority = document.getElementById('task-priority').value;
  let status = document.getElementById('task-status').value;
  let date = document.getElementById('task-date').value;
  let description = document.getElementById('task-description').value;

  if (!title || !typeElement || !priority || !status || !date || !description) {
    Swal.fire({
      icon: "error",
      text: "please entry your  task details",
    });
      return;
  }

  let TASK = typeElement.value;
  let task = { title, TASK, priority, status, date, description };

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));

  displayTask(task);
  closeModal();
  document.getElementById('form-task').reset();

                                                         //success message  "sweet alert"
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Your task has been saved",
    showConfirmButton: false,
    timer: 1500
  });
}


                                                  // task element

function displayTask(task) {                                

  let taskcreate = document.createElement('a');
  taskcreate.classList = "list-group-item list-group-item-action d-flex";
  taskcreate.href = "#";
  taskcreate.onclick = () => openTaskModal(task);

  taskcreate.innerHTML = `
      <div class="flex-fill">
          <div class="fs-14px lh-12 mb-2px fw-bold text-dark">${task.title}</div>
          <div class="mb-1 fs-12px text-gray-600">${task.description}</div>
          <div class="mb-1">
              <span class="badge bg-gray-300 text-gray-900">${task.TASK}</span>
              <span class="badge bg-indigo">${task.priority}</span>
          </div>
          <div class="fs-12px">${task.date}</div>
      </div>
  `;

  // Append the task to the appropriate section
  let taskcontent = task.status === "To Do" ? 'toDo' :
                  task.status === "In Progress" ? 'in-Progress' :
                  task.status === "Done" ? 'Done' : null;

  if (taskcontent) {
      document.getElementById(taskcontent).appendChild(taskcreate);
  } else {
    
  }
}

                                                       // update

function openTaskModal(task) {
  document.getElementById('task-title').value = task.title;
  document.querySelector(`input[name="task-type"][value="${task.TASK}"]`).checked = true;
  document.getElementById('task-priority').value = task.priority;
  document.getElementById('task-status').value = task.status;
  document.getElementById('task-date').value = task.date;
  document.getElementById('task-description').value = task.description;

  document.getElementById('task-save-btn').style.display = 'none';
  document.getElementById('task-update-btn').style.display = 'inline-block';
  document.getElementById('task-delete-btn').style.display = 'inline-block';

  document.getElementById('task-update-btn').onclick = () => updateTask(task);
  document.getElementById('task-delete-btn').onclick = () => deleteTask(task);

  document.getElementById('modal-task').style.display = 'block';
}


function updateTask(originalTask) {

  Swal.fire({
    title: "Do you want to save the update?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Save",
    denyButtonText: `Don't save`
  }).then((result) => {
    if (result.isConfirmed) {
      let title = document.getElementById('task-title').value;
      let TASK = document.querySelector('input[name="task-type"]:checked').value;
      let priority = document.getElementById('task-priority').value;
      let status = document.getElementById('task-status').value;
      let date = document.getElementById('task-date').value;
      let description = document.getElementById('task-description').value;

      let tasks = JSON.parse(localStorage.getItem('tasks'));
      let taskIndex = tasks.findIndex(t => t.title === originalTask.title && t.date === originalTask.date);
      tasks[taskIndex] = { title, TASK, priority, status, date, description };
      localStorage.setItem('tasks', JSON.stringify(tasks));

     
      closeModal();
      document.getElementById('form-task').reset();
      location.reload(); 


      
      Swal.fire("Saved!", "", "success");

    } else if (result.isDenied) {
      Swal.fire("Changes are not saved", "", "info");
      
    }
    
  });
}

                                                       // Delete 

function deleteTask(task) {
  
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      
      let tasks = JSON.parse(localStorage.getItem('tasks'));
      tasks = tasks.filter(t => t.title !== task.title || t.date !== task.date);
      localStorage.setItem('tasks', JSON.stringify(tasks));

      closeModal();
      document.getElementById('form-task').reset();
      location.reload(); 

      Swal.fire({
        title: "Deleted!",
        text: "Your task has been deleted.",
        icon: "success",
      });
    }
  });
  
}

window.onload = function() {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => displayTask(task));
};


document.getElementById('task-save-btn').onclick = saveTask;

// count

function count() {

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  let toDoCount = tasks.filter(task => task.status === "To Do").length;
  let inProgressCount = tasks.filter(task => task.status === "In Progress").length;
  let doneCount = tasks.filter(task => task.status === "Done").length;

  document.getElementById('to-do-tasks-count').textContent = toDoCount;
  document.getElementById('in-progress-tasks-count').textContent = inProgressCount;
  document.getElementById('done-tasks-count').textContent = doneCount;
}

window.onload = function() {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => displayTask(task));
  count();
};


