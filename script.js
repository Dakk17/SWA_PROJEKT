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

function addTask(taskContent) {

    var taskContainer = document.createElement('div');
    taskContainer.className = 'taskItem';

    if (!document.querySelector('.tasksHeader')) {
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

    var checkmark = document.createElement('span');
    checkmark.className = 'checkmark';

    checkboxLabel.appendChild(checkbox);
    checkboxLabel.appendChild(checkmark);

    var taskText = document.createElement('div');
    taskText.className = 'taskContent';
    taskText.textContent = taskContent;

    inputWrap.appendChild(checkboxLabel);
    inputWrap.appendChild(taskText);
    taskContainer.appendChild(inputWrap);

    document.getElementById('tasksContainer').appendChild(taskContainer);
}


