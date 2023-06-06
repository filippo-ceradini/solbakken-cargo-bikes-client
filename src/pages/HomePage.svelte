<script>
    import { navigate} from 'svelte-navigator';
    import {onMount} from "svelte";
    import io from "socket.io-client";
    import {socketconfig} from "../stores/globalStore.js";

    const socket = io(socketconfig, {
        withCredentials: true
    });

    let bike1 = 'https://cykelgruppen.dk/wp-content/uploads/2021/01/DK10004-scaled.jpg';
    let bike2 = 'https://www.larryvsharry.com/media/wysiwyg/cms_pages/Homepage/new-Original.jpg'

    let statusBike1 = "";
    let statusBike2 = "";
    onMount(() => {
        socket.emit("getBikeStatus");
        socket.on('bike-status', (data) => {
            console.log(data)
            statusBike1 = data['Nihola Bike 1'];
            statusBike2 = data['Bullitt Bike 2'];
        });
    })


    function bookBike1() {
        navigate('/book/bike1');
    }

    function bookBike2() {
        navigate('/book/bike2');
    }

    function modalBook() {
        alert('You have booked this bike')
    }
</script>

<main>

    <div class="row">
        <div class="col">
            <div class="bike-container">
                <img src={bike1} class="bike-image img-fluid" alt="Bike 1" on:click={bookBike1}/>
            </div>
        </div>
        <div class="col">
            <div class="bike-container">
                <img src={bike2} class="bike-image img-fluid" alt="Bike 2" on:click={bookBike2}/>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col">
            <div class="bike-container">
                <button class="status-label {statusBike1.toLowerCase()}" on:click={modalBook}>{statusBike1}</button>
            </div>
        </div>
        <div class="col">
            <div class="bike-container">
                <button class="status-label {statusBike2.toLowerCase()}" on:click={modalBook}>{statusBike2}</button>
            </div>
        </div>
    </div>
    <button type="button" class="btn btn-warning" on:click={() => {navigate('/report')}}>Report a problem with the bikes</button>
</main>

<style>
    .bike-container {
        position: relative;
        display: block;
    }

    .status-label {
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        padding: 5px 10px;
        color: white;
        font-weight: bold;
        text-transform: uppercase;
        border-radius: 5px;
        cursor: pointer;
    }

    .status-label.available {
        background-color: green;
    }

    .status-label.booked {
        background-color: red;
    }

    .bike-image {
        max-width: 400px;
        max-height: 300px;
        margin: 10px;
        object-fit: cover;
        transition: transform 0.3s ease-in-out;
    }

    .bike-image:hover {
        transform: scale(1.05);
        cursor: pointer;
    }
</style>
