const menuScreen = document.getElementById("menu-screen");
const newHaikuScreen = document.getElementById("new-haiku-screen");
const listScreen = document.getElementById("list-screen");
const detailScreen = document.getElementById("detail-screen");

const newHaikuButton = document.getElementById("new-haiku-button");
const readHaikusButton = document.getElementById("read-haikus-button");

const backFromNewButton = document.getElementById("back-from-new-button");
const backFromListButton = document.getElementById("back-from-list-button");
const backFromDetailButton = document.getElementById("back-from-detail-button");

const saveHaikuButton = document.getElementById("save-haiku-button");
const deleteHaikuButton = document.getElementById("delete-haiku-button");

const titleInput = document.getElementById("haiku-title");
const lineOneInput = document.getElementById("line-one");
const lineTwoInput = document.getElementById("line-two");
const lineThreeInput = document.getElementById("line-three");

const formMessage = document.getElementById("form-message");
const haikuList = document.getElementById("haiku-list");

const detailTitle = document.getElementById("detail-title");
const detailDate = document.getElementById("detail-date");
const detailLineOne = document.getElementById("detail-line-one");
const detailLineTwo = document.getElementById("detail-line-two");
const detailLineThree = document.getElementById("detail-line-three");

let selectedHaikuId = null;

function showScreen(screenToShow) {
  const screens = [
    menuScreen,
    newHaikuScreen,
    listScreen,
    detailScreen
  ];

  screens.forEach(function (screen) {
    screen.classList.remove("active");
  });

  screenToShow.classList.add("active");
}

function getHaikus() {
  const savedHaikus = localStorage.getItem("haikus");

  if (savedHaikus === null) {
    return [];
  }

  return JSON.parse(savedHaikus);
}

function saveHaikus(haikus) {
  localStorage.setItem("haikus", JSON.stringify(haikus));
}

function clearForm() {
  titleInput.value = "";
  lineOneInput.value = "";
  lineTwoInput.value = "";
  lineThreeInput.value = "";

  formMessage.textContent = "";
  formMessage.className = "message";
}

function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function createNewHaiku() {
  const title = titleInput.value.trim();
  const lineOne = lineOneInput.value.trim();
  const lineTwo = lineTwoInput.value.trim();
  const lineThree = lineThreeInput.value.trim();

  if (title === "" || lineOne === "" || lineTwo === "" || lineThree === "") {
    formMessage.textContent = "Please fill in the title and all three lines.";
    formMessage.className = "message error";
    return;
  }

  const newHaiku = {
    id: Date.now().toString(),
    title: title,
    date: new Date().toISOString(),
    lineOne: lineOne,
    lineTwo: lineTwo,
    lineThree: lineThree
  };

  const haikus = getHaikus();

  haikus.unshift(newHaiku);

  saveHaikus(haikus);

  formMessage.textContent = "Haiku saved.";
  formMessage.className = "message success";

  clearForm();
  renderHaikuList();
  showScreen(listScreen);
}

function renderHaikuList() {
  const haikus = getHaikus();

  haikuList.innerHTML = "";

  if (haikus.length === 0) {
    const emptyText = document.createElement("p");
    emptyText.className = "empty-text";
    emptyText.textContent = "No haikus yet. Write the first tiny masterpiece.";
    haikuList.appendChild(emptyText);
    return;
  }

  haikus.forEach(function (haiku) {
    const item = document.createElement("div");
    item.className = "haiku-item";

    const title = document.createElement("p");
    title.className = "haiku-item-title";
    title.textContent = haiku.title;

    const date = document.createElement("p");
    date.className = "haiku-item-date";
    date.textContent = formatDate(haiku.date);

    item.appendChild(title);
    item.appendChild(date);

    item.addEventListener("click", function () {
      openHaikuDetail(haiku.id);
    });

    haikuList.appendChild(item);
  });
}

function openHaikuDetail(id) {
  const haikus = getHaikus();

  const haiku = haikus.find(function (item) {
    return item.id === id;
  });

  if (!haiku) {
    return;
  }

  selectedHaikuId = haiku.id;

  detailTitle.textContent = haiku.title;
  detailDate.textContent = formatDate(haiku.date);
  detailLineOne.textContent = haiku.lineOne;
  detailLineTwo.textContent = haiku.lineTwo;
  detailLineThree.textContent = haiku.lineThree;

  showScreen(detailScreen);
}

function deleteSelectedHaiku() {
  if (selectedHaikuId === null) {
    return;
  }

  const userConfirmed = confirm("Delete this haiku?");

  if (!userConfirmed) {
    return;
  }

  let haikus = getHaikus();

  haikus = haikus.filter(function (haiku) {
    return haiku.id !== selectedHaikuId;
  });

  saveHaikus(haikus);

  selectedHaikuId = null;

  renderHaikuList();
  showScreen(listScreen);
}

newHaikuButton.addEventListener("click", function () {
  clearForm();
  showScreen(newHaikuScreen);
});

readHaikusButton.addEventListener("click", function () {
  renderHaikuList();
  showScreen(listScreen);
});

backFromNewButton.addEventListener("click", function () {
  showScreen(menuScreen);
});

backFromListButton.addEventListener("click", function () {
  showScreen(menuScreen);
});

backFromDetailButton.addEventListener("click", function () {
  renderHaikuList();
  showScreen(listScreen);
});

saveHaikuButton.addEventListener("click", createNewHaiku);

deleteHaikuButton.addEventListener("click", deleteSelectedHaiku);