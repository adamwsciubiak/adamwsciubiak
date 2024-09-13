script.jsdocument.addEventListener('DOMContentLoaded', function () {
    var iframe = document.getElementById('google-form');
    iframe.onload = function () {
        // Access the iframe content and remove header and footer
        var formDocument = iframe.contentWindow.document;

        // Remove the form title
        var title = formDocument.querySelector('.freebirdFormviewerViewHeaderHeader');
        if (title) {
            title.style.display = 'none';
        }

        // Remove the form footer
        var footer = formDocument.querySelector('.freebirdFormviewerViewFooterLegalDisclaimerContainer');
        if (footer) {
            footer.style.display = 'none';
        }
    };
});
