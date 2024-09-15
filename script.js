// JavaScript code to handle the "Read More" toggle functionality

// Wait until the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Select all toggle buttons
    const toggleButtons = document.querySelectorAll('.toggle-button');

    // Loop through each button
    toggleButtons.forEach(function(button) {
        // Add click event listener to each button
        button.addEventListener('click', function() {
            // Find the corresponding more-content div
            const moreContent = this.parentElement.nextElementSibling;

            if (moreContent.style.height && moreContent.style.height !== '0px') {
                // Collapse the content
                moreContent.style.height = '0px';
                this.textContent = 'Read More';
            } else {
                // Expand the content
                moreContent.style.height = moreContent.scrollHeight + 'px';
                this.textContent = 'Read Less';
            }
        });
    });
});
