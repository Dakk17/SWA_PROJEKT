// Přepínání viditelnosti bočního panelu
function myFunction() {
  var x = document.getElementById("SideBarContent");
  x.style.display = (x.style.display === "block") ? "none" : "block";
}

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
  var isCompletedPage = window.location.pathname.includes('html/dokoncene.html');
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
  checkbox2.id = 'loadImportantTasksCheckbox'; // Přidání identifikátoru

  // Přidání tlačítka do stránky až po vytvoření tasksContainer
  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('tasksContainer').appendChild(checkbox2);

    // Přidání event listeneru pro tlačítko načtení důležitých úkolů
    document.getElementById('loadImportantTasksCheckbox').addEventListener('change', function() {
        if (this.checked) {
            loadImportantTasks();
        }
    });
  });

  var checkmark2 = document.createElement('span');
  checkmark2.className = 'checkmark2';

  checkboxLabel.appendChild(checkbox);
  checkboxLabel.appendChild(checkmark);
  checkboxLabel2.appendChild(checkbox2);
  checkboxLabel2.appendChild(checkmark2);

  // Přidání event listeneru pro checkbox pro dokončení úkolu
  checkbox.addEventListener('change', function() {
      var isChecked = this.checked;
      var taskContent = this.parentNode.nextElementSibling.textContent; // Získání textu úkolu

      if (isChecked) {
          markTaskAsCompleted(taskContent);
      }
  });

  // Přidání event listeneru pro checkbox pro označení úkolu jako důležitý
  checkbox2.addEventListener('change', function() {
      var isChecked = this.checked;
      var taskText = taskContainer.querySelector('.taskContent').textContent;

      if (isChecked) {
          markTaskAsImportant(taskText);
      }
  });

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
      saveTaskToLocalStorage(taskContent, isCompleted, isImportant);
  }
}


function markTaskAsCompleted(taskContent) {
  // Aktualizace úkolu jako dokončeného a přesměrování na stránku dokoncene.html
  var tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
  tasks.forEach(task => {
      if (task.taskContent === taskContent) {
          task.isCompleted = true;
      }
  })
  location.reload();
  localStorage.setItem('tasks', JSON.stringify(tasks));
  // window.location.href = "html/dokoncene.html";
}

function markTaskAsImportant(taskContent) {
  // Aktualizace úkolu jako důležitého
  var tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
  tasks.forEach(task => {
      if (task.taskContent === taskContent) {
          task.isImportant = true;
      }
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  var currentPage = window.location.pathname;
  var tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];

  tasks.forEach(task => {
      var shouldAddTask = true;
      if (currentPage.includes('html/dokoncene.html') && !task.isCompleted) {
          shouldAddTask = false;
      }
      if (currentPage.includes('dulezite.html') && !task.isImportant) {
          shouldAddTask = false;
      }
      if (currentPage.includes('nedokoncene.html') && task.isCompleted) {
          shouldAddTask = false;
      }
      if (shouldAddTask) {
          addTask(task.taskContent, task.isCompleted, task.isImportant, true);
      }
  });
}

// function loadTasksFromJSON() {
//   var currentPage = window.location.pathname;

//   var xhr = new XMLHttpRequest();
//   xhr.open('GET', 'php/database.php', true);
//   xhr.onreadystatechange = function() {
//       if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
//           var tasks = JSON.parse(xhr.responseText);
//           tasks.forEach(task => {
//               addTask(task.taskContent, task.isCompleted, task.isImportant, true);
//           });
//       }
//   };
//   xhr.send();
// }

function saveTaskToLocalStorage(taskContent, isCompleted, isImportant) {
  var tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
  tasks.push({ taskContent, isCompleted, isImportant });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Načtení úkolů při načtení stránky
window.onload = loadTasksFromLocalStorage;

document.getElementById('loadTasksFromJSONCheckbox').addEventListener('change', function() {
  if (this.checked) {
      loadTasksFromJSON();
  }
});

function loadImportantTasks() {
  var currentPage = window.location.pathname;

  if (currentPage.includes('dokoncene.html') || currentPage.includes('nedokoncene.html') || currentPage.includes('seznam.html') || currentPage.includes('ukoly.html')) {
      document.getElementById('tasksContainer').style.display = 'none';
      return;
  }

  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'php/important_tasks.php', true);
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

// Přidání event listeneru pro tlačítko načtení důležitých úkolů
document.getElementById('loadImportantTasksCheckbox').addEventListener('change', function() {
  if (this.checked) {
      loadImportantTasks();
  }
});

// Přidání event listeneru pro tlačítko "Přidat"
document.getElementById('taskForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Zabraňuje výchozímu chování formuláře
  
  var input = document.getElementById('ukolInput').value;
  if (input.trim() !== "") {
      addTask(input);
      document.getElementById('ukolInput').value = "";

      // Odeslat nový úkol na server
      saveTaskToServer(input);      
  }
});

// Funkce pro odeslání nového úkolu na server
// function saveTaskToServer(taskContent) {
//   var xhr = new XMLHttpRequest();
//   xhr.open('POST', 'php/database.php', true);
//   xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//   xhr.onreadystatechange = function() {
//       if (xhr.readyState === XMLHttpRequest.DONE) {
//           if (xhr.status === 200) {
//               console.log('Úkol byl úspěšně uložen na server.');
//           } else {
//               console.error('Chyba při ukládání úkolu na server.');
//           }
//       }
//   };
//   var formData = new FormData();
//   formData.append('taskContent', taskContent);
//   xhr.send(formData);
// }

// Načtení úkolů při načtení stránky
window.onload = function() {
  var currentPage = window.location.pathname;
  if (currentPage.includes('html/team.html')) {
      loadTasksFromServer();
  }
};

// Funkce pro načtení úkolů ze serveru
// function loadTasksFromServer() {
//   var xhr = new XMLHttpRequest();
//   xhr.open('GET', 'php/database.php?page=html/team.html', true);
//   xhr.onreadystatechange = function() {
//       if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
//           var tasks = JSON.parse(xhr.responseText);
//           tasks.forEach(task => {
//               addTask(task.taskContent, task.isCompleted, task.isImportant, true);
//           });
//       }
//   };
//   xhr.send();
// }

$(document).ready(function() {
    $("#contactForm").on("submit", function(event) {
        event.preventDefault(); // Zamezí standardnímu odeslání formuláře

        $.ajax({
            url: '/php/database.php',
            type: 'post',
            data: $(this).serialize(),
            success: function(response) {
                $(".result").html(response);
            },
            error: function(xhr, status, error) {
                $(".result").html("Došlo k chybě: " + error);
            }
        });
    });
});

