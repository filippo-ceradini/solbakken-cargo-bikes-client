<script>
    let user = null; // This should be replaced with a store or context in a real-world app

    $: loggedIn = user !== null;
</script>

<nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
    <div class="container-fluid ">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" href="/">Home</a>
                </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/contact">Contact</a>
                    </li>
                {#if loggedIn}
                    <li class="nav-item">
                        <a class="nav-link" href="/account">Profile</a>
                    </li>
                {/if}
                    <li class="nav-item">
                        <a class="nav-link" href="/about">About</a>
                    </li>
            </ul>
        </div>
    </div>
</nav>

<style>
    .navbar {
        width: 100%;
        z-index: 1000;
    }

    .navbar-expand-lg .navbar-collapse {
        display: flex!important;
        justify-content: space-around;
        flex-basis: auto;
    }
</style>
