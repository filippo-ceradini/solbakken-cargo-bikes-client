<script>
    import { navigate } from 'svelte-routing';

    let bike1 = '/path/to/bike1.jpg';
    let bike2 = '/path/to/bike2.jpg';

    function bookBike1() {
        navigate('/book/bike1');
    }

    function bookBike2() {
        navigate('/book/bike2');
    }
</script>

<div>
    <img src={bike1} alt="Bike 1" on:click={bookBike1} />
    <img src={bike2} alt="Bike 2" on:click={bookBike2} />
</div>
