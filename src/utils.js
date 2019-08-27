const ESC_KEYDOWN = 27;

const Position = {
  AFTERBEGIN: `afterbegin`,
  AFTEREND: `afterend`,
  BEFOREEND: `beforeend`,
};

export const isEscButton = (evt) => evt.keyCode === ESC_KEYDOWN;

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
