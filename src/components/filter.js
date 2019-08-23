export const getFilterTemplate = (filterNames) => `<form class="trip-filters" action="#" method="get">
${filterNames.map((element) => `<div class="trip-filters__filter">
<input id="filter-${element.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${element.toLowerCase()}" ${element === `Everything` ? `checked` : ``}>
<label class="trip-filters__filter-label" for="filter-${element.toLowerCase()}">${element}</label>
</div>`).join(``)}
<button class="visually-hidden" type="submit">Accept filter</button>
</form>`;
