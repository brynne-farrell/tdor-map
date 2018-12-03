document.addEventListener("DOMContentLoaded", function() {
    var legendContent = document.getElementById("legendContent");
    var legendShowHideButton = document.getElementById("legendShowHideButton");
    legendShowHideButton.addEventListener("click", function() {
        if (legendContent.classList.contains("hidden")) {
            legendContent.classList.remove("hidden");
        }
    })
});
document.addEventListener("DOMContentLoaded", function() {
    var legendContent = document.getElementById("legendContent");
    var legendShowHideButton = document.getElementById("jx-close-about");
    legendShowHideButton.addEventListener("click", function() {
        if (!legendContent.classList.contains("hidden")) {
           legendContent.classList.add("hidden");
        }
    })
});