import AbstractComponent from "./abstract-component.js";

class NotStats extends AbstractComponent {
  getTemplate() {
    return `<p class="trip-events__msg">No charting data</p>`.trim();
  }
}

export default NotStats;
