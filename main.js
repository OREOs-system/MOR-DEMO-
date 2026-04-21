var swiper = new Swiper(".home", {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
   
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

 function toggleMenu(menuId) {
    const menu = document.getElementById(menuId);
    const boxes = document.querySelectorAll('.menu-details');

    
    boxes.forEach(box => {
        if (box.id !== menuId) {
            box.style.display = "none"; 
        }
    });

   
    menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'block' : 'none';
}

function toggleMenu() {
  const menu = document.getElementById('menu1'); // Replace 'menu1' with the correct ID you want to toggle
  if (menu) {
      menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'block' : 'none';
  }
}
// Assuming you have a login function
function loginUser (username) {
  // Store the username in session storage
  sessionStorage.setItem('username', username);
  updateNavBar();
}
function updateNavBar() {
  // Profile functionality removed - all users link to account.html
}

// Call this function when the page loads
window.onload = updateNavBar;

