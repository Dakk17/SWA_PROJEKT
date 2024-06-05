// Přidání event listeneru pro tlačítko "Přidat"
document.getElementById('taskForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Zabraňuje výchozímu chování formuláře
  
  var input = document.getElementById('ukolInput').value;
  if (input.trim() !== "") {
      addTask(input);
      document.getElementById('ukolInput').value = "";
  }
});

function addTask(taskContent, isCompleted = false, isImportant = false, skipSave = false) {
  var isCompletedPage = window.location.pathname.includes('dokoncene.html');
  var isImportantPage = window.location.pathname.includes('dulezite.html');

  if (isCompletedPage || isImportantPage) {
      skipSave = true;
  }

  var taskContainer = document.createElement('div');
  taskContainer.className = 'taskItem';
  
  if (!document.querySelector('.tasksHeader') && !(isCompletedPage || isImportantPage)) {
      var tasksHeader = document.createElement('div');
      tasksHeader.className = 'tasksHeader';
  
      var firstInputWrap = document.createElement('div');
      firstInputWrap.className = 'taskWrap';
  
      var firstTaskText = document.createElement('div');
      firstTaskText.className = 'taskContent';
      firstTaskText.textContent = 'Název';
  
      var span = document.createElement('span');
      span.className = 'inputSpan';
  
      var dulezitostDiv = document.createElement('div');
      dulezitostDiv.className = 'dulezitost';
      dulezitostDiv.textContent = "Důležitost";
  
      tasksContainer.appendChild(tasksHeader);
      tasksHeader.appendChild(span);
      tasksHeader.appendChild(firstInputWrap);
      tasksHeader.appendChild(dulezitostDiv);
      firstInputWrap.appendChild(firstTaskText);
  }

  var inputWrap = document.createElement('div');
  inputWrap.className = 'taskWrap';

  var checkboxLabel = document.createElement('label');
  checkboxLabel.className = 'checkbox-container taskCheckbox';

  var checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'custom-checkbox';
  checkbox.checked = isCompleted;

  var checkmark = document.createElement('span');
  checkmark.className = 'checkmark';

  var dulezitostDivMark = document.createElement('div');
  dulezitostDivMark.className = 'dulezitostMark';

  var checkboxLabel2 = document.createElement('label');
  checkboxLabel2.className = 'checkbox-container taskCheckbox';

  var checkbox2 = document.createElement('input');
  checkbox2.type = 'checkbox';
  checkbox2.className = 'custom-checkbox';
  checkbox2.checked = isImportant;

  var checkmark2 = document.createElement('span');
  checkmark2.className = 'checkmark2';

  checkboxLabel.appendChild(checkbox);
  checkboxLabel.appendChild(checkmark);
  checkboxLabel2.appendChild(checkbox2);
  checkboxLabel2.appendChild(checkmark2);

  var taskText = document.createElement('div');
  taskText.className = 'taskContent';
  taskText.textContent = taskContent;


  inputWrap.appendChild(checkboxLabel);
  inputWrap.appendChild(taskText);
  taskContainer.appendChild(inputWrap);
  inputWrap.appendChild(dulezitostDivMark);
  dulezitostDivMark.appendChild(checkboxLabel2);

  document.getElementById('tasksContainer').appendChild(taskContainer);

  if (!skipSave) {
      saveTask(taskContent, isCompleted, isImportant);
  }
}

function saveTask(taskContent, isCompleted, isImportant) {
  var currentPage = window.location.pathname;
  if (currentPage.includes('dokoncene.html') || currentPage.includes('dulezite.html')) {
      return;
  }

  // Uložení do localStorage
  saveTaskToLocalStorage(taskContent, isCompleted, isImportant);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'php/database.php', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          console.log('Task saved to JSON successfully');
      }
  };
  var data = 'taskContent=' + encodeURIComponent(taskContent) + 
             '&isCompleted=' + encodeURIComponent(isCompleted) + 
             '&isImportant=' + encodeURIComponent(isImportant);
  xhr.send(data);
}

function loadTasksFromJSON() {
  var currentPage = window.location.pathname;

  if (currentPage.includes('dokoncene.html') || currentPage.includes('dulezite.html')) {
      document.getElementById('tasksContainer').style.display = 'none';
      return;
  }

  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'php/database.php', true);
  xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          var tasks = JSON.parse(xhr.responseText);
          tasks.forEach(task => {
              addTask(task.taskContent, task.isCompleted, task.isImportant, true);
          });
      }
  };
  xhr.send();
}

window.addEventListener('load', function() {
  // loadTasksFromJSON();
});

// Funkce pro uložení stavu úkolu do localStorage
function saveTaskToLocalStorage(taskContent, isCompleted, isImportant) {
  var task = {
    taskContent: taskContent,
    isCompleted: isCompleted,
    isImportant: isImportant
  };
  var tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Funkce pro načtení úkolů z localStorage
function loadTasksFromLocalStorage() {
  var currentPage = window.location.pathname;

  if (currentPage.includes('dokoncene.html') || currentPage.includes('dulezite.html')) {
      document.getElementById('tasksContainer').style.display = 'none';
      return;
  }
  var tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
  tasks.forEach(task => {
    addTask(task.taskContent, task.isCompleted, task.isImportant, true);
  });
}

// Načtení úkolů z localStorage po načtení stránky
window.addEventListener('load', function() {
  loadTasksFromLocalStorage();
});
