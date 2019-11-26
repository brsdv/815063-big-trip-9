export class ModelPoint {
  constructor(data) {
    this.id = data[`id`];
    this.price = data[`base_price`];
    this.dateFrom = data[`date_from`];
    this.dateTo = data[`date_to`];
    this.destination = data[`destination`];
    this.isFavorite = data[`is_favorite`];
    this.type = data[`type`];
    this.offers = data[`offers`];
  }

  static parsePoint(data) {
    return new ModelPoint(data);
  }

  static parsePoints(data) {
    return data.map(ModelPoint.parsePoint);
  }

  toRAW() {
    return {
      'id': this.id,
      'base_price': this.price,
      'date_from': this.dateFrom,
      'date_to': this.dateTo,
      'destination': this.destination,
      'is_favorite': this.isFavorite,
      'type': this.type,
      'offers': this.offers
    };
  }
}
