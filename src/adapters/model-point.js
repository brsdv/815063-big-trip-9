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
}
