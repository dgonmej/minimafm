// Mode selector

const toggle = document.querySelector('.js-change-theme');
const body = document.querySelector('body');
const profile = document.querySelectorAll('.profile');
const authorReference_1 = document.getElementById('author-reference-1');
const authorReference_2 = document.getElementById('author-reference-2');
const mainSection = document.getElementById('section-main');
const bottomSection = document.getElementById('section-bottom');

const section = document.querySelectorAll('.section-theme');
const box = document.querySelectorAll('.box-theme');

function changeClass(childrens, item, classRemoved, classAdded) {
    if (childrens) {
        item.forEach(i => {
            i.classList.remove(classRemoved);
            i.classList.add(classAdded);
        });
    } else {
        item.classList.remove(classRemoved);
        item.classList.add(classAdded);
    }
};

toggle.addEventListener('click', () => {
    if (body.classList.contains('text-gray-900')) {
console.log('--- DARK MODE ---');

        toggle.innerHTML = "<i class='fas fa-sun'></i>";

        changeClass(true, profile, 'bg-blue-700', 'bg-blue-900');
        changeClass(false, authorReference_1, 'lg:block', 'lg:hidden');
        changeClass(false, authorReference_2, 'lg:hidden', 'lg:block');

        mainSection.style.backgroundImage = "url('images/wallpaper_secondary.jpg')";
        
        changeClass(true, box, 'bg-white', 'bg-gray-900');
        changeClass(true, section, 'bg-white', 'bg-black');
        changeClass(false, body, 'text-gray-900', 'text-gray-100');
    } else {
console.log('-- LIGHT MODE ---');

        toggle.innerHTML = "<i class='fas fa-moon'></i>";

        changeClass(true, profile, 'bg-blue-900', 'bg-blue-700');
        changeClass(false, authorReference_1, 'lg:hidden', 'lg:block');
        changeClass(false, authorReference_2, 'lg:block', 'lg:hidden');
        
        
        mainSection.style.backgroundImage = "url('images/wallpaper_primary.jpg')";
        
        changeClass(true, box, 'bg-gray-900', 'bg-white');
        changeClass(true, section, 'bg-black', 'bg-white');
        changeClass(false, body, 'text-gray-100', 'text-gray-900');
    }
});

