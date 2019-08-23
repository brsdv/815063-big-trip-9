export const getTripInfoTemplate = (totalCards, townsTrip, datesTrip) => `<div class="trip-info__main">
<h1 class="trip-info__title">${townsTrip.length > 3 ? `${townsTrip[0]} &mdash; ... &mdash; ${townsTrip[townsTrip.length - 1]}` : `${townsTrip[0]} &mdash; ${townsTrip[1]} ${townsTrip[2] ? `&mdash; ${townsTrip[2]}` : ``}`}</h1>

<p class="trip-info__dates">AUG ${new Date(datesTrip[0]).getDate()}&nbsp;&mdash;&nbsp;${new Date(datesTrip[datesTrip.length - 1]).getDate()}</p>
</div>
<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCards.map((element) => element.price).reduce((sum, current) => sum + current)}</span>
</p>`;
