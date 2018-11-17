document.addEventListener("DOMContentLoaded", function() {
    var legendContent = document.getElementById("legendContent");
    var legendShowHideButton = document.getElementById("legendShowHideButton");
    legendShowHideButton.addEventListener("click", function(){
        if (legendContent.classList.contains("hidden")){
            legendContent.classList.remove("hidden");
            legendShowHideButton.innerText = "Less";
        } else {
           legendContent.classList.add("hidden");
            legendShowHideButton.innerText = "More";
        }
    })
});