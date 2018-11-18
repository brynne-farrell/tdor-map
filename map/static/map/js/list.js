document.addEventListener('addName', function(event) {
    var date = new Date(event.detail.date);
    var nameListDiv = document.getElementById("nameList");
    newName = document.createElement("p");
    newName.classList.add("nameDisplay");
    newName.innerText = event.detail.name + " on " + date.toLocaleDateString();
    nameListDiv.prepend(newName);
});

document.addEventListener('resetCounter', function(event) {
    var nameListDiv = document.getElementById("nameList");
    nameListDiv.innerText = '';
});