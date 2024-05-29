function myFunction() {
  var x = document.getElementById("SideBarContent");
  if (x.style.display === "block") {
      x.style.display = "none";
  } else {
      x.style.display = "block";
  }
}

document.getElementById('submitButton').addEventListener('click', function() {
  var input = document.getElementById('ukolInput').value;
  if (input.trim() !== "") {
      addTask(input);
      document.getElementById('ukolInput').value = "";
  }
});

function addTask(taskContent, isCompleted = false, isImportant = false, skipSave = false) {
  // Kontrola, zda se nacházíme na stránce Dokončené nebo Důležité
  var isCompletedPage = window.location.pathname.includes('dokoncene.html');
  var isImportantPage = window.location.pathname.includes('dulezite.html');

  // Pokud jsme na stránce Dokončené nebo Důležité, přeskočíme uložení do localStorage
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
      dulezitostDiv.textContent = "Důležitost"

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
  // Získání aktuální URL
  var currentPage = window.location.pathname;

  // Pokud jsme na stránce Dokončené nebo Důležité, nepřidáme žádné úkoly
  if (currentPage.includes('dokoncene.html') || currentPage.includes('dulezite.html')) {
      return;
  }

  var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push({ taskContent, isCompleted, isImportant });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
function loadTasks() {
    // Získání aktuální URL
    var currentPage = window.location.pathname;

    // Pokud jsme na stránce Dokončené nebo Důležité, nepřidáme žádné úkoly
    if (currentPage.includes('dokoncene.html') || currentPage.includes('dulezite.html')) {
        // Skryjeme container pro úkoly
        document.getElementById('tasksContainer').style.display = 'none';
        return;
    }

    // Pokud jsme na jiné stránce než Dokončené nebo Důležité, načteme úkoly
    var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTask(task.taskContent, task.isCompleted, task.isImportant, true);
    });
}

// Načtení úkolů při načtení stránky
window.addEventListener('load', function() {
  loadTasks();
});

function moveToCompleted(taskContent) {
  // Přidat úkol do kategorie "Dokončené"
  addTask(taskContent, true, false, false);
}

// Funkce pro přesunutí úkolu do kategorie "Důležité"
function moveToImportant(taskContent) {
  // Přidat úkol do kategorie "Důležité"
  addTask(taskContent, false, true, false);
}

// Event listener pro žluté tlačítko
document.getElementById('yellowButton').addEventListener('click', function() {
  // Získání textu úkolu
  var taskContent = document.getElementById('ukolInput').value;
  if (taskContent.trim() !== "") {
      // Přesunutí úkolu do kategorie "Dokončené"
      moveToCompleted(taskContent);
      // Vyprázdnění pole pro nový úkol
      document.getElementById('ukolInput').value = "";
  }
});

// Event listener pro červené tlačítko
document.getElementById('redButton').addEventListener('click', function() {
  // Získání textu úkolu
  var taskContent = document.getElementById('ukolInput').value;
  if (taskContent.trim() !== "") {
      // Přesunutí úkolu do kategorie "Důležité"
      moveToImportant(taskContent);
      // Vyprázdnění pole pro nový úkol
      document.getElementById('ukolInput').value = "";
  }
});
