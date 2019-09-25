const ESC_KEYDOWN = 27;

export const Position = {
  AFTERBEGIN: `afterbegin`,
  AFTEREND: `afterend`,
  BEFOREEND: `beforeend`,
};

export const Mode = {
  DEFAULT: `default`,
  ADDING: `adding`
};

export const SiteMenu = {
  TABLE: `Table`,
  STATISTIC: `Stats`
};

export const FilterMenu = {
  EVER: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const SortType = {
  DEFAULT: `default`,
  TIME: `time`,
  PRICE: `price`
};

export const StatChart = {
  MONEY: `MONEY`,
  TRANSPORT: `TRANSPORT`,
  TIME_SPEND: `TIME SPEND`
};

export const switchActiveMenu = (evt, sibling) => {
  evt.target.classList.add(`trip-tabs__btn--active`);
  sibling.classList.remove(`trip-tabs__btn--active`);
};

export const isEscButton = (evt) => {
  return evt.keyCode === ESC_KEYDOWN;
};

export const isLength = (container) => {
  return container.children.length <= 1;
};

export const isElementCount = (container) => {
  return container.querySelector(`.day__info`).childElementCount === 0;
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const renderElement = (container, element, place = Position.BEFOREEND) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.AFTEREND:
      container.after(element);
      break;
    case Position.BEFOREEND:
      container.append(element);
      break;
  }
};

export const removeNode = (element) => {
  if (element) {
    element.remove();
  }
};

export const shortDate = (element) => {
  return new Date(element).toLocaleString(`en`, {day: `numeric`, month: `numeric`, year: `numeric`});
};

export const parseSortedDate = (elements) => {
  const setDate = new Set();
  const sortElements = elements.map((element) => element.date).sort();
  sortElements.map((element) => shortDate(element)).forEach((element) => setDate.add(element));
  return Array.from(setDate);
};
