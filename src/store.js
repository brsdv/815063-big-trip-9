class Store {
  constructor() {
    this._points = null;
    this._destinations = null;
    this._offers = null;
  }

  setPoints(points) {
    this._points = points;
  }

  getPoints() {
    return this._points;
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  getDestinations() {
    return this._destinations;
  }

  setOffers(offers) {
    this._offers = offers;
  }

  getOffers() {
    return this._offers;
  }
}

export default Store;
