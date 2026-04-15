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
  const username = sessionStorage.getItem('username');
  const userProfileLink = document.getElementById('user-profile');
  
  if (username) {
      userProfileLink.textContent = username; // Set the link text to the username
      userProfileLink.href = "profile.html"; // Change the link to the profile page
  } else {
      userProfileLink.textContent = "Account"; // Default text
      userProfileLink.href = "account.html"; // Default link
  }
}

// Call this function when the page loads
window.onload = updateNavBar;

