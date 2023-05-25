<script>
    import { navigate } from 'svelte-routing';

    let bike1 = 'https://cykelgruppen.dk/wp-content/uploads/2021/01/DK10004-scaled.jpg';
    let bike2 = 'https://www.larryvsharry.com/media/wysiwyg/cms_pages/Homepage/new-Original.jpg'

    function bookBike1() {
        navigate('/book/bike1');
    }

    function bookBike2() {
        navigate('/book/bike2');
    }
</script>

<div class="group-vertical">
    <img src={bike1} class="bike-image" alt="Bike 1" on:click={bookBike1} />
    <img src={bike2} class="bike-image" alt="Bike 2" on:click={bookBike2} />
</div>


<style>
    .group-vertical {
        display: flex;
        align-items: center;
        justify-content: center;
    }


     .bike-image {
         padding: 5%;
         width: 30%; /* Adjust this percentage as needed */
         height: auto; /* This maintains the aspect ratio */
     }


</style>