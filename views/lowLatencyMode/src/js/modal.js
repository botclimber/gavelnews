const defaultModal = document.getElementById("default-modal");
const defaultModalOverlay = document.getElementById("defaultOverlay");

// Function to open the modal
function openModal() {
    defaultModal.classList.add('open');
    defaultModalOverlay.classList.add('open');
}

// Function to close the modal
function closeModal() {
    defaultModal.classList.remove('open');
    defaultModalOverlay.classList.remove('open');
}

// Attach event listener to the close button (if available) to close the modal
const closeButton = defaultModal.querySelector(".close");
if (closeButton) {
    closeButton.addEventListener("click", closeModal);
}

// Close the modal when clicking outside of it
window.addEventListener("click", function (event) {
    if (event.target === defaultModal) {
        closeModal();
    }
});