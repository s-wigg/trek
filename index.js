
const getTrips = function getTrips() {
  $('#tripList ol').empty();
  $('#message').empty();
  $.get('https://trektravel.herokuapp.com/trips', (response) => {
    console.log(response);
    response.forEach((trip) => {
      const tripName = `<li data-id="${trip.id}">${trip.name}</li>`;
      $('#tripList ol').append(tripName);
    });
    $('#tripList ol').show();
  })
  .fail(() => {
    console.log('failure');
  })
  .always(() => {
    console.log('always even if we have success or failure');
  });
}; // end of getTrips function

const viewTripsbyQuery = function viewTripsbyQuery(formInput) {
  $('#tripList ol').empty();

  $.get(`https://trektravel.herokuapp.com/trips${formInput}`, (response) => {
    response.forEach((trip) => {
      const tripName = `<li data-id="${trip.id}">${trip.name}</li>`;
      $('#tripList ol').append(tripName);
      $('#tripList ol').show();
    });
  })
  .fail(() => {
    console.log('failure');
  });
}; // end of viewTripsbyQuery function

const viewTripsbyContinent = function viewTripsbyContinent() {
  const continentDropdown = `<select id="continentSelector" class=" small-8 large-4 columns dropdown row align-center">
  <option value="null">Continents</option>
  <option value="Africa">Africa</option>
  <option value="Asia">Asia</option>
  <option value="Australasia">Australasia</option>
  <option value="Europe">Europe</option>
  <option value="NorthAmerica">North America</option>
  <option value="SouthAmerica">South America</option>
  </select>`;
  $('#tripsByContinentSelector').append(continentDropdown);
  $('#tripsByContinentSelector').change(() => {
    const e = document.getElementById('continentSelector');
    const selectedContinent = `/continent?query=${e.options[e.selectedIndex].text}`;
    viewTripsbyQuery(selectedContinent);
  });
}; // end of viewTripsbyContinent function

const viewTripsByNumberofWeeks = function viewTripsByNumberofWeeks() {
  const weeksCheckBoxes = `<fieldset> <div class="large-6 columns" id="radioButtons">
  <input type="radio" name="duration" value="1" id="1week"><label >1 Week </label>
  <input type="radio" name="duration" value="2" id="2week"><label >2 Weeks </label>
  <input type="radio" name="duration" value="3" id="3week"><label >3 Weeks </label>
  <input type="radio" name="duration" value="4" id="4week"><label >4 Weeks </label>
  </div>
  <p><input class="button" type="button" id="lengthButton" value="Find Trips by Length"></p>
  </fieldset>`;
  $('#tripList ol').empty();
  $('#tripsByNumberofWeeks').append(weeksCheckBoxes);
  $('#lengthButton').on('click', () => {
    const radioValue = $("input[name='duration']:checked").val();
    const radioValueQuery = `/weeks?query=${radioValue}`;
    viewTripsbyQuery(radioValueQuery);
  });
}; // end of viewTripsByNumberofWeeks function

const viewTrip = function viewTrip(tripID) {
  $.get(`https://trektravel.herokuapp.com/trips/${tripID}`, (response) => {
    const tripInfo =
    `<div data-id="${response.id}">
    <p id="clickToHide"> ~ Click Anywhere to Hide ~ </p>
    <h3 id="tripInfoName"> <strong> ${response.name} </strong></h3>
    <p> <strong> Continent: </strong> ${response.continent} </p>
    <p> <strong> Description: </strong> ${response.about} </p>
    <p> <strong> Category: </strong> ${response.category} </p>
    <p> <strong> Weeks: </strong> ${response.weeks} </p>
    <p> <strong> Cost: </strong> ${response.cost} </p>
    </div>
    <button id="reserveFormButton" class="button" data-id="${response.id}"> Reserve this Trip </button>`;
    $('#tripInfo').append(tripInfo);
    $('#tripList ol').hide();
  })
    .fail((response) => {
      console.log(response);
      $('#fail').html('<p>Request was unsuccessful</p>');
    })
    .always(() => {
      console.log('Looking for adventure...');
    });
}; // end of viewTrip function

const finalizeReservation = function finalizeReservation() {
  $('#reserveFormField').on('submit', 'form', function(e) {
    e.preventDefault();
    const url = $(this).attr('action'); // Retrieve the action from the form
    const formData = $(this).serialize();
    $(this).hide();
    $.post(url, formData, function(response) {
      $('#message').html('<p> Trip Reserved! </p>');
    }).fail(() => {
      $('#message').html('<p>Reserving Trip Failed</p>');
    });
  });
}; // end of finalizeReservation

const reserveForm = function reserveTripForm(tripID) {
  const reservationForm = `
  <div id="message"></div>
  <div>
  <form action="https://trektravel.herokuapp.com/trips/${tripID}/reservations" method="post" data-id="${tripID}">
  <section class="small-12 large-9 columns">
  <label>Name</label>
  <input type="text" id="name" name="name" placeholder="Name"></input>
  </section>
  <section class="small-12 large-9 columns">
  <label>Email</label>
  <input type="text" id="email" name="email" placeholder="Email"></input>
  </section>
  </section>
  <section class="small-12 large-12 columns" id="finalizeButton">
  <button class="button medium" type="submit">Finalize Reservation</button>
  </section>
  </form>
  </div>`;
  $('#reserveFormField').append(reservationForm);
  finalizeReservation();
}; // end of reserveTrip function

$(document).ready(() => {
  viewTripsbyContinent();
  viewTripsByNumberofWeeks();

  $('#button').on('click', () => {
    getTrips();
  });

  $('#tripInfo').on('click', '#reserveFormButton', function() {
    console.log('Attempting to make reservation...');
    const tripID = $(this).attr('data-id');
    $(this).hide();
    reserveForm(tripID);
  });

  $('#tripList ol').on('click', 'li', function() {
    const tripID = $(this).attr('data-id');
    viewTrip(tripID);
  });

  $('#tripInfo').on('click', 'div', function() {
    const tripID = $(this).attr('data-id');
    $(this).hide();
    const buttonToHide = $(`[data-id="${tripID}"][id="reserveFormButton"]`);
    $(buttonToHide).hide();
    const formToHide = $(`[data-id="${tripID}"][action]`);
    $(formToHide).hide();
    $('#message').empty();
    $('#tripList ol').show();
  });
}); // end of document.ready
