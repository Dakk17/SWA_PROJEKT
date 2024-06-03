// Přepínání viditelnosti bočního panelu
function myFunction() {
  var x = document.getElementById("SideBarContent");
  x.style.display = (x.style.display === "block") ? "none" : "block";
}

// Přidání event listeneru pro tlačítko "Přidat"
document.getElementById('submitButton').addEventListener('click', function() {
  var input = document.getElementById('ukolInput').value;
  if (input.trim() !== "") {
      addTask(input);
      document.getElementById('ukolInput').value = "";
  }
});

// Funkce pro přidání úkolu
function addTask(taskContent, isCompleted = false, isImportant = false, skipSave = false) {
  var isCompletedPage = window.location.pathname.includes('dokoncene.html');
  var isImportantPage = window.location.pathname.includes('dulezite.html');

  if (isCompletedPage || isImportantPage) {
      skipSave = true;
  }

  var taskContainer = document.createElement('div');
  taskContainer.className = 'taskItem';

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

// Funkce pro uložení úkolu do localStorage
function saveTask(taskContent, isCompleted, isImportant) {
  var currentPage = window.location.pathname;
  if (currentPage.includes('dokoncene.html') || currentPage.includes('dulezite.html')) {
      return;
  }

  var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push({ taskContent, isCompleted, isImportant });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Funkce pro načtení úkolů z localStorage
function loadTasks() {
  var currentPage = window.location.pathname;

  if (currentPage.includes('dokoncene.html') || currentPage.includes('dulezite.html')) {
      document.getElementById('tasksContainer').style.display = 'none';
      return;
  }

  var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => {
      addTask(task.taskContent, task.isCompleted, task.isImportant, true);
  });
}

// Načtení úkolů při načtení stránky
window.addEventListener('load', function() {
  loadTasks();
});

// Funkce pro přesunutí úkolu do kategorie "Dokončené"
function moveToCompleted(taskContent) {
  addTask(taskContent, true, false, false);
}

// Funkce pro přesunutí úkolu do kategorie "Důležité"
function moveToImportant(taskContent) {
  addTask(taskContent, false, true, false);
}

// Event listener pro žluté tlačítko
document.getElementById('yellowButton').addEventListener('click', function() {
  var taskContent = document.getElementById('ukolInput').value;
  if (taskContent.trim() !== "") {
      moveToCompleted(taskContent);
      document.getElementById('ukolInput').value = "";
  }
});

// Event listener pro červené tlačítko
document.getElementById('redButton').addEventListener('click', function() {
  var taskContent = document.getElementById('ukolInput').value;
  if (taskContent.trim() !== "") {
      moveToImportant(taskContent);
      document.getElementById('ukolInput').value = "";
  }
});
