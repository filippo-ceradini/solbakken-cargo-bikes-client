<script>
    import {
        Button,
        Dropdown,
        DropdownItem,
        Chevron,
        DropdownDivider,
        Navbar,
        NavBrand,
        NavHamburger,
        NavUl,
        NavLi
    } from 'flowbite-svelte';
    let group3 = 2;
</script>

<Navbar let:hidden let:toggle class="navbar-expand-lg fixed-top">
    <NavBrand href="/">
        <img src="https://flowbite.com/docs/images/logo.svg" class="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
        <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white dark">Flowbite</span>
    </NavBrand>
    <NavHamburger on:click={toggle} />
    <NavUl {hidden} class="ml-3">
        <NavLi href="/" active={true}>Home</NavLi>
        <NavLi class="cursor-pointer"><Chevron aligned>Dropdown</Chevron></NavLi>
        <Dropdown offset="18">
            <DropdownItem>Dashboard</DropdownItem>
            <DropdownItem>Settings</DropdownItem>
            <DropdownItem>Earnings</DropdownItem>
            <DropdownItem slot="footer">Sign out</DropdownItem>
        </Dropdown>
        <NavLi href="/services">Services</NavLi>
        <NavLi href="/pricing">Pricing</NavLi>
        <NavLi href="/contact">Contact</NavLi>
    </NavUl>
</Navbar>