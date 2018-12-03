document.addEventListener("DOMContentLoaded", function(){
    // Calculate height
    var navbar = document.querySelector('nav');
    var footer = document.querySelector('footer');
    var header = document.getElementById('playbackControls');
    var subtractHeight = navbar.offsetHeight + footer.offsetHeight + header.offsetHeight;
    subtractHeight = subtractHeight * 1.1; // Add an extra 10%< just for breathing room
    
    // Add stylesheet
    var sheet = document.createElement('style');
    sheet.innerHTML = "#nameContainer {max-height: calc(100vh - "+subtractHeight+"px);}";
    document.body.appendChild(sheet);
});