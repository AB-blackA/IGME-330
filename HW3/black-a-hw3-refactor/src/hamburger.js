/* Author: Net Ninja
 * Since: Oct 2, 2020
 * Purpose: hamburger.js is responsible for allowing a working hamburger menu
 * in about.html. This code is also used in index.html, but it's accessed via
 * main.ts in the setupUI function (at the very end).
 * This file was made through a tutorial series about Bulma. Check it out here:
 * https://www.youtube.com/watch?v=qvn2SxGvyPs&list=PL4cUxeGkcC9iXItWKbaQxcyDT1u6E7a8a&index=6&ab_channel=NetNinja
*/

    const burgerIcon = document.querySelector("#burger");
    const navbarMenu = document.querySelector("#nav-links");

    burgerIcon.addEventListener('click', ()  => {
        navbarMenu.classList.toggle("is-active");
    });
