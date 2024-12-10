'use strict';

/**
 * element toggle function
 */

const elemToggleFunc = function (elem) { elem.classList.toggle("active"); }



/**
 * navbar variables
 */

const navbar = document.querySelector("[data-nav]");
const navOpenBtn = document.querySelector("[data-nav-open-btn]");
const navCloseBtn = document.querySelector("[data-nav-close-btn]");
const overlay = document.querySelector("[data-overlay]");

const navElemArr = [navOpenBtn, navCloseBtn, overlay];

for (let i = 0; i < navElemArr.length; i++) {

  navElemArr[i].addEventListener("click", function () {
    elemToggleFunc(navbar);
    elemToggleFunc(overlay);
    elemToggleFunc(document.body);
  })

}



/**
 * go top
 */

const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", function () {

  if (window.scrollY >= 800) {
    goTopBtn.classList.add("active");
  } else {
    goTopBtn.classList.remove("active");
  }

});

document.getElementById("watch-live-btn").addEventListener("click", function () {
  const heroSection = document.querySelector(".hero");
  const heroVideo = document.getElementById("hero-video");
  const heroCarousel = document.getElementById("dreamCarousel");
  const heroContent = document.querySelector(".hero-content"); // Get the hero content
  const btnGroup = document.querySelector(".btn-group"); // Get the button group

  // Add the 'active' class to display the video and remove the background
  heroSection.classList.add("active");

  // Show the video and hide the carousel
  heroVideo.style.display = "block"; // Show the video
  heroCarousel.style.display = "none"; // Hide the carousel

  // Hide title and subtitle content
  heroContent.classList.add("hidden");

  // Hide buttons
  btnGroup.classList.add("hidden");

  // Play the video if it's paused
  if (heroVideo.paused) {
    heroVideo.play();
  }
});

document.getElementById("dream-making-btn").addEventListener("click", function () {
  const heroSection = document.querySelector(".hero");
  const heroCarousel = document.getElementById("dreamCarousel");
  const heroVideo = document.getElementById("hero-video");
  const heroContent = document.querySelector(".hero-content"); // Get the hero content
  const btnGroup = document.querySelector(".btn-group"); // Get the button group

  // Hide the video and show the carousel
  heroVideo.style.display = "none"; // Hide the video
  heroCarousel.style.display = "block"; // Show the carousel

  // Hide title and subtitle content
  heroContent.classList.add("hidden");

  // Hide buttons
  btnGroup.classList.add("hidden");

  // Add the 'active' class to the hero section (optional if you need to apply styles)
  heroSection.classList.add("active");
});



(function () {
  "use strict";

  const items = [
    "gears-img-1.png",
    "gears-img-2.png",
    "gears-img-3.png",
    //"gears-img-4.png",
    //"gears-img-5.png",
    //"gears-img-6.webp",
    //"gears-img-7.webp",
    //"gears-img-8.png",
    //"gears-img-9.webp",
  ];

  const doors = document.querySelectorAll(".door");
  const spinDuration = 2000; // Duration in milliseconds for the spin animation

  const tokenCountElement = document.querySelector("#token-count");
  const spinnerButton = document.querySelector("#spinner");
  let tokens = 10; // Initial token count

  document.querySelector("#spinner").addEventListener("click", spin);

  async function spin() {
    if (tokens <= 0) {
      // Show modal for no tokens
      showModal(false, null, false, true); // Pass 'true' for noTokens
      return;
    }

    // Disable the spin button
    spinnerButton.disabled = true;

    // Deduct one token and update the UI
    tokens -= 1;
    tokenCountElement.textContent = tokens;

    // Reinitialize the doors and spin
    init(false, 1, 2);

    const results = []; // Array to store the topmost images of each door

    // Run the spin for each door
    for (const door of doors) {
      const boxes = door.querySelector(".boxes");
      const duration = parseInt(boxes.style.transitionDuration) * 10; // Convert to milliseconds
      boxes.style.transform = "translateY(0)";
      await new Promise((resolve) => setTimeout(resolve, duration));

      // Get the topmost item after spin
      const firstBox = boxes.querySelector(".box img");
      if (firstBox) {
        const filename = firstBox.src.split("/").pop(); // Extract filename from src
        results.push(filename); // Store the filename
      }
    }

    // Check if all doors display the same image
    const isWinner = results.every((result) => result === results[0]);
    const winningItem = isWinner ? results[0] : null;

    // Show the modal after all spins stop
    setTimeout(() => {
      showModal(isWinner, winningItem);
    }, spinDuration);
  }

  function init(firstInit = true, groups = 1, duration = 1) {
    for (const door of doors) {
      if (firstInit) {
        door.dataset.spinned = "0";
      }

      const boxes = door.querySelector(".boxes");
      const boxesClone = boxes.cloneNode(false);

      const pool = ["❓"];
      if (!firstInit) {
        const arr = [];
        for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
          arr.push(...items);
        }
        pool.push(...shuffle(arr));

        boxesClone.addEventListener(
          "transitionstart",
          function () {
            door.dataset.spinned = "1";
            this.querySelectorAll(".box").forEach((box) => {
              box.style.filter = "blur(1px)";
            });
          },
          { once: true }
        );

        boxesClone.addEventListener(
          "transitionend",
          function () {
            this.querySelectorAll(".box").forEach((box, index) => {
              box.style.filter = "blur(0)";
              if (index > 0) this.removeChild(box);
            });
          },
          { once: true }
        );
      }

      for (let i = pool.length - 1; i >= 0; i--) {
        const box = document.createElement("div");
        box.classList.add("box");
        box.style.width = door.clientWidth + "px";
        box.style.height = door.clientHeight + "px";

        // Add images to the boxes
        const img = document.createElement("img");
        img.src = `assets/images/${pool[i]}`;
        img.alt = pool[i];
        img.style.width = "75%";
        img.style.height = "75%";
        img.style.objectFit = "contain";
        box.appendChild(img);

        boxesClone.appendChild(box);
      }

      boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
      boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)
        }px)`;
      door.replaceChild(boxesClone, boxes);
    }
  }

  function shuffle([...arr]) {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  }

  function showModal(isWinner, winningItem, alreadySpun = false, noTokens = false) {
    const modalMessage = document.getElementById("modalMessage");
    const modalImage = document.getElementById("modalImage");

    if (noTokens) {
      modalMessage.innerHTML = `<h3>No Tokens Left!</h3><p>Please add more tokens to spin.</p>`;
      modalImage.innerHTML = "";
    } else if (isWinner) {
      const itemName = winningItem.split("/").pop();
      modalMessage.innerHTML = `<h3>Congratulations! You Win!</h3>
        <p></p>`;
      modalImage.innerHTML = `<img src="assets/images/${winningItem}" alt="${itemName}" style="width: 50%; height: auto;">`;
    } else {
      modalMessage.innerHTML = `<h3>Sorry, You Lost!</h3><p>Better luck next time!</p>`;
      modalImage.innerHTML = "";
    }


    const resultModal = new bootstrap.Modal(document.getElementById("resultModal"));

    const modalElement = document.getElementById("resultModal");

    modalElement.addEventListener("show.bs.modal", () => {
      spinnerButton.disabled = true;
    });

    modalElement.addEventListener("hidden.bs.modal", () => {
      spinnerButton.disabled = false;
    });

    resultModal.show();
  }

  init();
})();


const input = document.querySelector("input");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");
let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
const deleteAllButton = document.querySelector(".delete-all");
const filters = document.querySelectorAll(".filter");
const todoCount = document.getElementById("todo-count"); // Counter element
let filter = '';

showTodos();

function getTodoHtml(todo, index) {
  if (filter && filter != todo.status) {
    return '';
  }
  let checked = todo.status == "completed" ? "checked" : "";
  return /* html */ `
    <li class="todo">
      <label for="${index}">
        <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
        <span class="${checked}">${todo.name}</span>
      </label>
      <button class="delete-btn" data-index="${index}" onclick="remove(this)"><i class="fa fa-times"></i></button>
    </li>
  `;
}

function showTodos() {
  if (todosJson.length == 0) {
    todosHtml.innerHTML = '';
    emptyImage.style.display = 'block';
  } else {
    todosHtml.innerHTML = todosJson.map(getTodoHtml).join('');
    emptyImage.style.display = 'none';
  }

  // Update the total task counter
  todoCount.textContent = todosJson.length;
}

function addTodo(todo) {
  input.value = "";

  // Truncate the todo text if it's too long
  const truncatedTodo = todo.length > 25
    ? todo.slice(0, 25) + "\n" + todo.slice(25)
    : todo;

  todosJson.unshift({ name: truncatedTodo, status: "pending" });
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

input.addEventListener("keyup", e => {
  let todo = input.value.trim();
  if (!todo || e.key != "Enter") {
    return;
  }
  addTodo(todo);
});

addButton.addEventListener("click", () => {
  let todo = input.value.trim();
  if (!todo) {
    return;
  }
  addTodo(todo);
});

function updateStatus(todo) {
  let todoName = todo.parentElement.lastElementChild;
  if (todo.checked) {
    todoName.classList.add("checked");
    todosJson[todo.id].status = "completed";
  } else {
    todoName.classList.remove("checked");
    todosJson[todo.id].status = "pending";
  }
  localStorage.setItem("todos", JSON.stringify(todosJson));
}

function remove(todo) {
  const index = todo.dataset.index;
  todosJson.splice(index, 1);
  showTodos();
  localStorage.setItem("todos", JSON.stringify(todosJson));
}

filters.forEach(function (el) {
  el.addEventListener("click", (e) => {
    if (el.classList.contains('active')) {
      el.classList.remove('active');
      filter = '';
    } else {
      filters.forEach(tag => tag.classList.remove('active'));
      el.classList.add('active');
      filter = e.target.dataset.filter;
    }
    showTodos();
  });
});

deleteAllButton.addEventListener("click", () => {
  todosJson = [];
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
});

function enableEditing(todoElement, index) {
  const span = todoElement.querySelector('span');
  const currentText = span.textContent;

  // Create an input field
  const input = document.createElement('input');
  input.type = 'text';
  input.value = currentText;
  input.className = 'todo-edit-input';
  span.replaceWith(input);
  input.focus();

  // Save changes on blur or Enter key
  const saveChanges = () => {
    const newText = input.value.trim();
    if (newText) {
      todosJson[index].name = newText;
      localStorage.setItem("todos", JSON.stringify(todosJson));
    }
    input.replaceWith(span);
    span.textContent = todosJson[index].name; // Update the text
    showTodos(); // Refresh the UI
  };

  input.addEventListener('blur', saveChanges);
  input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') saveChanges();
  });
}

// Modify getTodoHtml to include the double-click event
function getTodoHtml(todo, index) {
  if (filter && filter != todo.status) {
    return '';
  }
  let checked = todo.status == "completed" ? "checked" : "";
  return /* html */ `
    <li class="todo" ondblclick="enableEditing(this, ${index})">
      <label for="${index}">
        <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
        <span class="${checked}">${todo.name}</span>
      </label>
      <button class="delete-btn" data-index="${index}" onclick="remove(this)"><i class="fa fa-times"></i></button>
    </li>
  `;
}

const gamesData = [
  { name: "Adventure Quest", category: "RPG", releaseDate: "2002-10-15" },
  { name: "Speed Racer", category: "Racing", releaseDate: "2008-05-09" },
  { name: "Zombie Wars", category: "Action", releaseDate: "2020-10-15" },
  { name: "League of Legends", category: "MOBA", releaseDate: "2009-10-27" },
  { name: "Valorant", category: "FPS", releaseDate: "2020-06-02" },
  { name: "Hell Burns Red", category: "RPG", releaseDate: "2022-02-10" },
  { name: "Stray Light", category: "Puzzle", releaseDate: "2024-01-15" },
];

const tableBody = document.querySelector("#gamesTable tbody");

gamesData.forEach((game) => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${game.name}</td>
    <td>${game.category}</td>
    <td>${game.releaseDate}</td>
  `;
  tableBody.appendChild(row);
});

const questions = [
  {
    question: "Who won the 2024 League of Legends World Championships?",
    options: ["BLG", "Gen.G", "T1", "JDG"],
    correctAnswer: "T1",
  },
  {
    question: "Which of the choices is a First Person Shooter game?",
    options: ["Dota 2", "Genshin Impact", "NBA 2k24", "Valorant"],
    correctAnswer: "Valorant",
  },
  {
    question: "Which of these Anime shows are adapted from a game?",
    options: ["Cyberpunk Edgerunners", "Code Geass: Lelouch of the Rebellion", "Guilty Crown", "Sword Art Online"],
    correctAnswer: "Cyberpunk Edgerunners",
  },
  {
    question: "Which of these gacha games are developed my miHoyo?",
    options: ["Arknights", "Heaven Burns Red", "Honkai: Star Rail", "Id@lmaster Shiny Colors"],
    correctAnswer: "Honkai: Star Rail",
  },
];

let currentQuestionIndex = 0;
let score = 0;

const nextBtn = document.getElementById("next-btn");
const questionElem = document.getElementById("question");
const optionsList = document.getElementById("options-list");
const resultContainer = document.getElementById("result-container");
const quizContainer = document.getElementById("quiz");
const scoreElem = document.getElementById("score");

function loadQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionElem.textContent = currentQuestion.question;

  // Clear previous options
  optionsList.innerHTML = '';

  currentQuestion.options.forEach(option => {
    const li = document.createElement("li");
    li.textContent = option;
    li.onclick = () => checkAnswer(option);
    optionsList.appendChild(li);
  });
}

function checkAnswer(selectedOption) {
  const currentQuestion = questions[currentQuestionIndex];

  // If the selected option is correct
  if (selectedOption === currentQuestion.correctAnswer) {
    score++;
  }

  nextBtn.disabled = false; // Enable next button after answering
}

function goToNextQuestion() {
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    loadQuestion();
    nextBtn.disabled = true; // Disable next button until an answer is selected
  } else {
    showResult();
  }
}

function showResult() {
  quizContainer.style.display = "none";
  resultContainer.style.display = "block";
  scoreElem.textContent = score + " / " + questions.length;
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  resultContainer.style.display = "none";
  quizContainer.style.display = "block";
  loadQuestion();
  nextBtn.disabled = true;
}

// Initial setup
loadQuestion();
nextBtn.disabled = true; // Disable next button initially
nextBtn.onclick = goToNextQuestion;