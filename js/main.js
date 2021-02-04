// Обьект с сохраненными ответами
var answers = {
  2: null,
  3: null,
  4: null,
  5: null,
};

// Движение вперед
var btnNext = document.querySelectorAll('[data-nav = "next"]');

btnNext.forEach(function (button) {
  button.addEventListener("click", function () {
    var thisCard = this.closest("[data-card]");
    var thisCardNumber = parseInt(thisCard.dataset.card);

    if (thisCard.dataset.validate == "novalidate") {
      navigate("next", thisCard);
      updateProgressBar("next", thisCardNumber);
    } else {
      // При движении вперед сохраняем данные в обьект
      saveAnswer(thisCardNumber, gatherCardData(thisCardNumber));

      // Валидация на заполненность
      if (isFilled(thisCardNumber) && checkOnRequired(thisCardNumber)) {
        navigate("next", thisCard);
        updateProgressBar("next", thisCardNumber);
      } else {
        alert("Сделайте ответ, прежде чем переходить далее.");
      }
    }
  });
});

// Движение назад
var btnPrev = document.querySelectorAll('[data-nav = "prev"]');

btnPrev.forEach(function (button) {
  button.addEventListener("click", function () {
    var thisCard = this.closest("[data-card]");
    var thisCardNumber = parseInt(thisCard.dataset.card);
    navigate("prev", thisCard);
    updateProgressBar("prev", thisCardNumber);
  });
});

// Функция для навигации вперед и назад
function navigate(direction, thisCard) {
  var thisCardNumber = parseInt(thisCard.dataset.card);
  var nextCard;

  if (direction == "next") {
    nextCard = thisCardNumber + 1;
  } else if (direction == "prev") {
    nextCard = thisCardNumber - 1;
  }

  thisCard.classList.add("hidden");
  document
    .querySelector(`[data-card="${nextCard}"]`)
    .classList.remove("hidden");
}
// Функция сбора заполненных данных с карточки
function gatherCardData(number) {
  var question;
  var result = [];

  // Находим текущую карточку по номеру и data-атрибуту
  var currentCard = document.querySelector(`[data-card="${number}"]`);

  // Находим главный вопрос карточки
  question = currentCard.querySelector("[data-question]").innerText;

  // 1. Находим все заполненные значения из радио кнопок
  var radioCheckboxValues = currentCard.querySelectorAll(
    '[type="radio"], [type="checkbox"]'
  );
  radioCheckboxValues.forEach(function (item) {
    if (item.checked) {
      result.push({
        name: item.name,
        value: item.value,
      });
    }
  });

  // 2. Находим все заполненные значения из инпутов
  var inputValues = currentCard.querySelectorAll(
    '[type="text"], [type="email"], [type="number"]'
  );

  inputValues.forEach(function (item) {
    itemValue = item.value;
    if (itemValue.trim() != "") {
      result.push({
        name: item.name,
        value: item.value,
      });
    }
  });

  var data = {
    question: question,
    answer: result,
  };

  return data;
}

// Функция записи ответа в обьект с ответами
function saveAnswer(number, data) {
  answers[number] = data;
}

// Функция проверки на заполненность
function isFilled(number) {
  return answers[number].answer.length > 0;
}

// Фунция валидации email
function validateEmail(email) {
  var pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
  return pattern.test(email);
}

// Проверка на заполненность required чекбоксов и инпутов с email
function checkOnRequired(number) {
  var currentCard = document.querySelector(`[data-card="${number}"]`);
  var requiredFields = currentCard.querySelectorAll("[required]");
  var isValidArray = [];

  requiredFields.forEach(function (item) {
    if (item.type == "checkbox" && !item.checked) {
      isValidArray.push(false);
    } else if (item.type == "email" && !validateEmail(item.value)) {
      isValidArray.push(false);
    }
  });

  return !isValidArray.includes(false);
}

// Подсвечиваем рамку у радиокнопок
document.querySelectorAll(".radio-group").forEach(function (item) {
  item.addEventListener("click", function (e) {
    // Проверяем где произошел клик - внутри тега label или нет
    var label = e.target.closest("label");
    if (label) {
      // Отменяем активный класс у всех тегов label
      label
        .closest(".radio-group")
        .querySelectorAll("label")
        .forEach(function (item) {
          item.classList.remove("radio-block--active");
        });
      label.classList.add("radio-block--active");
    }
  });
});

// Подсвечиваем рамку у чекбоксов
document
  .querySelectorAll('label.checkbox-block input[type="checkbox"]')
  .forEach(function (item) {
    item.addEventListener("change", function () {
      // Если чекбокс проставлен, тогда
      if (item.checked) {
        item.closest("label").classList.add("checkbox-block--active");
      } else {
        item.closest("label").classList.remove("checkbox-block--active");
      }
    });
  });

// Отображение прогресс бара

function updateProgressBar(direction, cardNumber) {
  // Расчет всего кол-ва карточек
  var cardsTotalNumber = document.querySelectorAll("[data-card]").length;

  // Текущая карточка
  // Проверка направления перемещения
  if (direction == "next") {
    cardNumber = cardNumber + 1;
  } else if (direction == "prev") {
    cardNumber = cardNumber - 1;
  }

  // Расчет процентов прохождения
  var progress = ((cardNumber * 100) / cardsTotalNumber).toFixed();

  // Находим и обновляем прогресс бар
  var progressBar = document
    .querySelector(`[data-card="${cardNumber}"]`)
    .querySelector(".progress");
  if (progressBar) {
    // Обновить число прогресс бара
    progressBar.querySelector(
      ".progress__label strong"
    ).innerText = `${progress}%`;
    // Обновить полоску прогресс бара
    progressBar.querySelector(
      ".progress__line-bar"
    ).style = `width: ${progress}%`;
  }
}
