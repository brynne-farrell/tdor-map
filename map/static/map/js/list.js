document.addEventListener('addName', function(event) {
    var splitDate = event.detail.date.split("-");
        
    var monthLookup = {
        'Jan': 0,
        'Feb': 1,
        'Mar': 2,
        'Apr': 3,
        'May': 4,
        'Jun': 5,
        'Jul': 6,
        'Aug': 7,
        'Sep': 8,
        'Oct': 9,
        'Nov': 10,
        'Dec': 11,
    };

    var day = splitDate[0];
    var month = monthLookup[splitDate[1]];
    var year = "20" + splitDate[2];

    var date = new Date(year, month, day);
//     var date = new Date(event.detail.date);
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