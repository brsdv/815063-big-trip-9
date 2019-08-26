const TOTAL_CARD_COUNT = 4;

const shuffle = function (array) {
  const cloneArray = [...array];
  let j;
  let temp;

  for (let i = cloneArray.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = cloneArray[j];
    cloneArray[j] = cloneArray[i];
    cloneArray[i] = temp;
  }

  return cloneArray;
};

const getRandomText = (number) => {
  const discriptions = [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`
  ];

  return shuffle(discriptions).slice(0, number).join(` `);
};

const getDataEvents = () => ({
  types: shuffle([
    {
      type: `bus`,
      img: `img/icons/bus.png`,
      title: `Taxi to`
    },
    {
      type: `check`,
      img: `img/icons/check-in.png`,
      title: `Check into`
    },
    {
      type: `drive`,
      img: `img/icons/drive.png`,
      title: `Drive to`
    },
    {
      type: `flight`,
      img: `img/icons/flight.png`,
      title: `Flight to`
    },
    {
      type: `restaurant`,
      img: `img/icons/restaurant.png`,
      title: `Restaurant to`
    },
    {
      type: `ship`,
      img: `img/icons/ship.png`,
      title: `Ship to`
    },
    {
      type: `sightseeing`,
      img: `img/icons/sightseeing.png`,
      title: `Sightseeing to`
    },
    {
      type: `train`,
      img: `img/icons/train.png`,
      title: `Train to`
    },
    {
      type: `transport`,
      img: `img/icons/transport.png`,
      title: `Transport to`
    },
    {
      type: `trip`,
      img: `img/icons/trip.png`,
      title: `Trip to`
    }
  ]).slice(0, 1),
  town: [
    `Saint Petersburg`,
    `Berlin`,
    `Prague`,
    `Lappeenranta`,
    `Helsinki`,
  ][Math.floor(Math.random() * 5)],
  photos: new Array(3).fill(``).map(() => `http://picsum.photos/300/150?r=${Math.random()}`),
  discription: getRandomText(Math.ceil(Math.random() * 3)),
  time: {
    date: Date.now() + 1 + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
    hour: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12][Math.floor(Math.random() * 13)],
    minute: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55][Math.floor(Math.random() * 10)]
  },
  price: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100][Math.floor(Math.random() * 10)],
  offers: shuffle([
    {
      title: `Add luggage`,
      price: 10,
      isActive: Math.random() >= 0.5
    },
    {
      title: `Switch to comfort`,
      price: 150,
      isActive: Math.random() >= 0.5
    },
    {
      title: `Add meal`,
      price: 2,
      isActive: Math.random() >= 0.5
    },
    {
      title: `Choose seats`,
      price: 9,
      isActive: Math.random() >= 0.5
    },
  ]).slice(0, Math.round(Math.random() * 2))
});

const getMenu = new Set([
  `Table`,
  `Stats`,
]);

const getFilter = new Set([
  `Everything`,
  `Future`,
  `Past`,
]);

export const totalCards = new Array(TOTAL_CARD_COUNT).fill(``).map(getDataEvents);
export const menuNames = Array.from(getMenu);
export const filterNames = Array.from(getFilter);
export const townsTrip = Array.from(new Set(totalCards.map((element) => element.town)));
export const datesTrip = Array.from(new Set(totalCards.map((element) => element.time.date))).sort();