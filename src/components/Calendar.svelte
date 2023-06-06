<script>
    import {preferences, createBookingRef} from '../stores/globalStore.js';
    import toastr from 'toastr';

    export let item;

    let hours = Array(24).fill(null).map((_, i) => i);
    let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']; // Start the week on Monday

    let daysToView = 6

    // The currently selected bike is the Nihola
    let selectedBike;
    $selectedBike = '6467cf90314e17fe4414a17f';
    if (item === "bike2") {
        // The currently selected bike is the Bullitt
        $selectedBike = '64675ee4253ddd95f01b580e';
    }
    let availability = writable({}); // Availability status
    let weekOffset = writable(0); // Current week offset
    let currentDay = writable(0)
    let dayDates = writable(0)

    let userEmail;

    preferences.subscribe(value => {
        userEmail = value.username;
    });

    // Initialize the component
    initialize();

    function handleBikeChange(bikeId) {
        $selectedBike = bikeId;
        initialize();
    }

    // Function to initialize the component
    function initialize()
    {
        let now = new Date();

        //gets the current day from the days array
        $currentDay = days[now.getDay() === 0 ? daysToView : now.getDay() - 1];

        // Calculate days until next Monday
        let dayOfTheWeek = now.getDay();

        let daysSinceLastMonday = dayOfTheWeek === 0 ? daysToView : dayOfTheWeek - 1;

        let currentWeekOffset = $weekOffset;
        if (dayOfTheWeek === 0 && $weekOffset === 0) {
            currentWeekOffset = 0;
        }

        $dayDates = Array(daysToView + 1).fill(null).map((_, i) => {
            let d = new Date();
            d.setDate(now.getDate() - daysSinceLastMonday); // go to last Monday
            d.setDate(d.getDate() + i + currentWeekOffset * (daysToView + 1)); // add 'i' days plus week offset
            if (i < daysToView) { // first day start at 00:00
                d.setHours(0, 0, 0, 0);
            }
            if (i === daysToView) { // last day ends at 23:59:59.999
                d.setHours(23, 59, 59, 999);
            }
            return d;
        });

        updateWeekAvailability();

    }


    // Function to update week availability
    function updateWeekAvailability() {
        $availability = generateAvailabilityMap();
        fetchBookings();

    }

    // Function to generate availability map
    function generateAvailabilityMap() {
        let now = new Date();
        let currentHour = now.getHours();
        let today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // get today's date without the time
        let avMap = {};
        $dayDates.forEach((dayDate) => {
            let dayOnly = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate()); // get day's date without the time
            if (dayOnly.getTime() < today.getTime()) {
                avMap[dayDate] = Array(24).fill('Past');
            } else if (dayOnly.getTime() === today.getTime()) {
                avMap[dayDate] = Array(24).fill('Available').map((_, hour) => hour >= currentHour ? 'Available' : 'Past');
            } else {
                avMap[dayDate] = Array(24).fill('Available');
            }
        });
        return avMap;
    }


    // Function to fetch bookings
    async function fetchBookings() {
        // Get the start and end dates of the current week
        let startDate = $dayDates[0];
        let endDate = $dayDates[daysToView]

        try {
            let response = await fetch(import.meta.env.VITE_API_URL + '/api/weekly-bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    startDate: startDate,
                    endDate: endDate,
                    bikeId: $selectedBike
                }),
            });
            let data = await response.json();
            if (data.status === 200) {
                bookings = data.bookings;
                // Update the availability map with the fetched bookings
                updateAvailability();
            } else {
                toastr.error(data.message);
            }
        } catch (error) {
            console.error('Fetch Error:', error);
        }
    }

    // Function to update availability
    function updateAvailability() {
        let now = new Date();
        let currentDay = now; // Get the current day as YYYY-MM-DD
        let currentHour = now.getHours();

        bookings.forEach(booking => {
            let bookingStart = new Date(booking.startTime);
            let bookingEnd = new Date(booking.endTime);

            // Determine the range of hours to mark as 'Booked' for each day
            let startHour = bookingStart.getHours();
            let endHour = bookingEnd.getHours();

            // Loop over each day from the start to the end of the booking
            for (let d = new Date(bookingStart); d <= bookingEnd; d.setDate(d.getDate() + 1)) {
                let dd = new Date(d);
                dd.setHours(0, 0, 0, 0);
                if (dd.getDay() === 0) {
                    dd.setHours(23, 59, 59, 999)
                }

                // Loop over each hour from the start to the end of the booking
                for (let hour = startHour; hour < endHour; hour++) {
                    if (d === currentDay && hour < currentHour) {
                        $availability[dd][hour] = 'PastBooked';
                    } else if (new Date(d) < new Date(currentDay)) {
                        $availability[dd][hour] = 'PastBooked';
                    } else {
                        if (booking.userID.email === $preferences.username) {
                            $availability[dd][hour] = {
                                status: 'BookedByMe',
                                bookingId: booking._id
                            };
                        } else {
                            $availability[dd][hour] = {
                                status: 'Booked',
                                bookingId: booking._id
                            };
                        }
                    }
                }

                // Reset hours for the next day
                startHour = 0;
                endHour = 24;
            }
        });
    }


    // Function to format the date in European format (dd.mm.yyyy)
    function formatDate(date) {
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
    }


    import {writable} from "svelte/store";
    import Modal from "./Modal.svelte";
    import BookingModal from "./BookingModal.svelte";

    let bookings = []; // The current bookings


    let cleanupFunction;

    // Function to navigate to the next/previous week
    function navigateWeek(offset) {
        // Clean up the old event listeners
        if (cleanupFunction) {
            cleanupFunction();
        }
        $weekOffset += offset;
        // Update the week and create new event listeners
        cleanupFunction = initialize();
    }

    let bookingModal = false

    async function editBooking(day, hour) {
        let bookingDate = day; // Get the date for the selected day
        let year = bookingDate.getFullYear();
        let month = bookingDate.getMonth();
        let date = bookingDate.getDate();

        $createBookingRef = {
            status: $availability[day][hour],
            bikeID: $selectedBike,
            year: year,
            month: month,
            date: date,
            hour: hour,
        }
        bookingModal = true;
    }

    function popUpClose() {
        initialize()
        bookingModal = false;
    }

</script>

<main>
    <div class="legend">
        <div><span class="legend-item Available"></span> Available</div>
        <div><span class="legend-item BookedByMe"></span> My Bookings</div>
        <div><span class="legend-item Booked"></span> Booked</div>
    </div>
    <Modal open={bookingModal} onClosed={popUpClose} title="Book Bike">
        <BookingModal onClose={popUpClose}/>
    </Modal>
    <div class="control-container">
        <div>
            {#if $weekOffset !== 0}
                <a on:click={() => navigateWeek(-1)}>⬅️</a> <!-- Navigate to previous week -->
            {:else}
                <a>⏹️</a> <!-- Navigate to next week -->
            {/if}
        </div>
        <div>
            <label>
                <input type="radio" bind:group={item} value="bike1" on:change={
                () => {handleBikeChange('6467cf90314e17fe4414a17f')}}>
                Nihola - Bike 1
            </label>
            <label>
                <input type="radio" bind:group={item} value="bike2" on:change={
                () => {handleBikeChange('64675ee4253ddd95f01b580e')}}>
                Bullitt - Bike 2
            </label>
        </div>
        <div>

            <a on:click={() => navigateWeek(1)}>➡️</a> <!-- Navigate to next week -->
        </div>
    </div>


    <table class="table-container">
        <thead>
        <tr>
            {#each $dayDates as dayDate, i (dayDate)}
                <th class="cell">
                    <h4>{formatDate(dayDate)}</h4>
                </th>
            {/each}
        </tr>
        </thead>
        <tbody>
        {#each hours as hour}
            <tr>
                {#each $dayDates as dayDate}
                    {#if $availability[dayDate][hour] === 'Past' || $availability[dayDate][hour] === 'PastBooked'}
                        <td class="cell {$availability[dayDate][hour]}">
                            {hour}:00
                        </td>
                    {:else if $availability[dayDate][hour] === 'Available'}
                        <td class="cell {$availability[dayDate][hour]}"
                            on:click={() => editBooking(dayDate, hour)}>
                            {hour}:00
                        </td>
                    {:else if $availability[dayDate][hour].status === 'BookedByMe'}
                        <td class="cell BookedByMe"
                            on:click={() => editBooking(dayDate, hour)}>
                            {hour}:00
                        </td>
                    {:else if $availability[dayDate][hour].status === 'Booked'}
                        <td class="cell Booked"
                            on:click={() => editBooking(dayDate, hour)}>
                            {hour}:00
                        </td>
                    {/if}
                {/each}
            </tr>
        {/each}
        </tbody>
    </table>
</main>


<style>

    body {
        min-width: 100vw;
        overflow-x: hidden;
        background-color: #222222;
    }

    main {
        padding-top: 70px;
    }

    /* Existing styles... */

    a {
        font-size: 1em; /* Set the initial size of the arrows */
    }

    input[type='radio'] {
        width: 1em; /* Set the initial size of the radio buttons */
        height: 1em; /* Set the initial size of the radio buttons */
    }

    @media (max-width: 600px) {
        a {
            font-size: 2em; /* Increase the size of the arrows on small screens */
        }

        input[type='radio'] {
            width: 2em; /* Increase the size of the radio buttons on small screens */
            height: 2em; /* Increase the size of the radio buttons on small screens */
        }
    }

    @media (max-width: 860px) {
        th h4, th h5 {
            font-size: smaller;
        }

        .cell {
            width: 4vmax;
        }

        main {
            padding-top: 10px; /* adjust as needed */
            padding-left: 0;
            padding-right: 0;
        }

        .table-container {
            width: 80%; /* adjust as needed */
        }
    }

    .cell {
        height: 3vh; /* smaller height */
        width: 11vmax; /* larger width */
        align-items: center;
        justify-content: center;
        border: 1px solid #ddd;
        box-sizing: border-box; /* makes sure the border is included in the element's total width and height */

    }


    .control-container {
        font-size: 2em;
        display: flex;
        justify-content: space-between;
    }

    .bike-selector {
        font-size: 2em;
    }

    .table-container {
        overflow-x: scroll;
        -webkit-overflow-scrolling: touch;
    }

    .cell.Available {
        background-color: green;
        color: white;
        cursor: pointer;
    }

    .cell.Past {
        background-color: grey;
        color: white;
    }

    .cell.BookedByMe {
        background-color: #008cff;
        color: white;
        cursor: pointer;
    }

    .cell.Booked {
        background-color: red;
        color: white;
        cursor: pointer;
    }

    .cell.PastBooked {
        background-color: #fd8888;
        color: white;
    }

    .cell.Available:hover, .cell.Booked:hover {
        transform: scale(1.2);
        transition: transform 0.2s ease-in-out;
    }

    .legend {
        display: flex;
        justify-content: space-around;
        margin-bottom: 20px;
    }

    .legend-item {
        display: inline-block;
        width: 20px;
        height: 20px;
        margin-right: 10px;
    }

    .legend-item.Available {
        background-color: green;
    }

    .legend-item.Past {
        background-color: grey;
    }

    .legend-item.BookedByMe {
        background-color: #008cff;
    }

    .legend-item.Booked {
        background-color: red;
    }

    .legend-item.PastBooked {
        background-color: #fd8888;
    }


</style>
