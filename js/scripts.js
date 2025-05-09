// INSTRUCCIONES
// Crea la interfaz básica
// Pinta la tarea en el HTML a mano para saber cual será la estructura que tendrás que replicar en JS
// Haz que esa tarea se pueda completar / descompletar y eliminar.
// Cuando todo eso funcione, pinta la tarea desde JS, quítala del HTML y comprueba que todo funciona igual
// La mecánica de esta aplicación es trabajar con el array de "tasks" y cada vez que haya un cambio (añadir tarea, modificar tarea, eliminar tarea), repintar todo el array en HTML.
// Cuando lo hagáis correctamente, os daréis cuenta de que las tareas se duplican, eso es porque al repintar se añaden las tareas a las que ya estaban. Para evitar que pase esto hay que vaciar el contenedor donde pintáis. Esto se hace con contenedor.textContent = "", de esta forma eliminais todo lo que hay dentro antes de volver a pintar las tareas.
// Acordaos de que existen los atributos data- son muy útiles en este tipo de ejercicios

const formElement = document.getElementById('form');
const inputElement = document.getElementById('input-to-do');
const tasksElement = document.querySelector('.todo-list');

//elementos de cada task
const todoListElement = document.getElementById('to-do-list');
// const checkboxElement = document.getElementById('checkbox');
const deleteButtonElement = document.getElementById('delete-button');
// const taskLabelElement= document.getElementById('task-label');
// const taskElement=document.getElementById('task');
// const taskContainerElement=document.getElementById('task-container');

const modeChangeElement = document.getElementById('mode-button');
const clearCompletedButton = document.getElementById('clear-completed');
const itemsLeftElement = document.getElementById('items-left');
const filtersElement = document.getElementById('filters');

let allTasks = [];
darkMode = false;

//FUNCIONES

const clearCompleted = () => {
  allTasks = allTasks.filter(task => !task.completed);
  insertTasks(allTasks);
};

const updateItemsLeft = () => {
  const remainingTasks = allTasks.filter(task => !task.completed);
  let count = remainingTasks.length;
  itemsLeftElement.textContent = `${count} items left`;
};

const changeTheme = () => {
  darkMode = !darkMode;

  if (darkMode) {
    document.body.classList.add('dark');
    modeChangeElement.src = 'assets/icon-sun.svg';
  } else {
    document.body.classList.remove('dark');
    modeChangeElement.src = 'assets/icon-moon.svg ';
  }
};


const insertTasks = task => {
  todoListElement.textContent = ''; //la lista empieza vacia que sino mete todas las tareas otra vez al hacer un task
  inputElement.value = ''; //limpio el input al añadir una tarea

  //creo las cosas del task por partes
  task.forEach(task => {
    //yo ya meti en el array una tarea, ahora la recorro

    //el contenedor
    const taskContainerElement = document.createElement('div'); //creo el div
    taskContainerElement.classList.add('task-container'); //le doy estilo
    taskContainerElement.dataset.id = task.id; // tuve que buscar ? como asignar dataset a un elemento creado? su id searaá el date.now

    //el checlbox
    const checkboxElement = document.createElement('input');
    checkboxElement.type = 'checkbox'; //que sea tipo checkbox
    checkboxElement.classList.add('checkbox');
    checkboxElement.checked = task.completed; //si la tarea esta completada, el checkbox estara marcado
    checkboxElement.dataset.id = task.id; //asigno el data a la tarea
    checkboxElement.id = task.id; //necesito tmb este id para el label

    //como quiero que el evento exista hasta que cree ese elemento, lo añado aqui?
    checkboxElement.addEventListener('click', () => completeTask(task.id));

    taskContainerElement.append(checkboxElement);

    //el label con texto
    const taskLabelElement = document.createElement('label');
    taskLabelElement.classList.add('task-label');
    taskLabelElement.htmlFor = task.id; //asigno el id de la tarea
    taskLabelElement.textContent = task.name;
    taskContainerElement.append(taskLabelElement);

    //el boton de borrar
    const deleteButtonElement = document.createElement('img');
    deleteButtonElement.classList.add('delete-button');
    deleteButtonElement.src = 'assets/icon-cross.svg';
    //no necesita id porque ya podre ubicarlo al estar dentro del to do list.

    deleteButtonElement.addEventListener('click', () => deleteTask(task.id));

    taskContainerElement.append(deleteButtonElement);

    //meto todo al contenedot
    todoListElement.append(taskContainerElement);

    //ittems left
    updateItemsLeft();
  });

  console.log(allTasks);
  return allTasks;
};

const filterTasks = () => {
  const filter = filtersElement.querySelector('.filter-active').dataset.filter; //traigo el data del html y lo meto en una variable que evaluaré
  let tasksToRender = allTasks;

  if (filter === 'completed') {
    tasksToRender = allTasks.filter(task => task.completed);
  } else if (filter === 'active') {
    tasksToRender = allTasks.filter(task => !task.completed);
  }

  insertTasks(tasksToRender); //recibe solo las que quiere filtrar
};

const deleteTask = id => {
  allTasks = allTasks.filter(task => task.id !== id);
  filterTasks(); //vuelvo a filtrar las tareas para que se vean los cambios
  //filtra las tareas y devuelte todas las que NO sea donde hice click. Vuelve a ìntar el array actualizado
};

const completeTask = id => {
  allTasks.map(task => {
    if (task.id === id) {
      task.completed = !task.completed; //cambio el estado de la tarea
    }
    return task;
  });
  filterTasks(); //vuelvo a filtrar las tareas para que se vean los cambios

  console.log(allTasks);
};

const createTask = event => {
  event.preventDefault();

  if (inputElement.value === '') {
    //si el input esta vacio no hace nada
    return; //importa la ubicacion de las cosas para que antes de crear el objeto, no considere el espacio vacio
  }

  allTasks.push({
    id: Date.now(), //le doy un id a la tarea
    name: inputElement.value, //se lo asigna el input
    completed: false //por defecto la tarea no esta completada
  });
  // insertTasks(allTasks);
  filterTasks();
};

const changeFilter = event => {
  //es importante empezar considerando los filtros; esto filtrara las task que luego se insertaran
  const filter = event.target.dataset.filter; //traigo el data del html y lo meto en una variable que evaluaré
  if (!filter) return; //si no hay filter, omite (siempre tendra por que por defaul esta all en el html)

  filtersElement
    .querySelector('.filter-active')
    .classList.remove('filter-active');

  event.target.classList.add('filter-active');

  filterTasks();
};

filterTasks();

formElement.addEventListener('submit', createTask);
modeChangeElement.addEventListener('click', changeTheme);
clearCompletedButton.addEventListener('click', clearCompleted);
// filtersElement.addEventListener('click', filterTasks);
filtersElement.addEventListener('click', changeFilter);

// // filtersElement.addEventListener('click', event => {
// // }); DELEGACION DE EVENTOS
