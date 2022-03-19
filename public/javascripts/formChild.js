var counter = 1;
var btn = document.getElementById('addInp');
var members = document.getElementById('members');

function setAttributes(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}
var addInput = () => {
    counter++;

    var div = document.createElement("div");
    div.classList.add("mb-2", "input-group");
    var span = document.createElement("span");
    span.setAttribute("class", "input-group-text");
    const username = "username" + counter;
    span.innerText = "name" + counter;
    div.appendChild(span);
    var input = document.createElement("input");
    setAttributes(input, { "type": "text", "name": `members[${username}]`, "class": "form-control", "placeholder": "Ron_5g", "required": true })

    div.appendChild(input);
    span = document.createElement("span");
    span.setAttribute("class", "input-group-text");
    span.innerText = "owes";
    div.appendChild(span);
    input = document.createElement("input");
    setAttributes(input, { "type": "text", "name": `members[${username}]`, "class": "form-control", "placeholder": "0.00", "required": true })

    div.appendChild(input);
    members.appendChild(div);
}

var removeInput = () => {
    if (counter > 1) {
        const temp = members.lastElementChild;
        temp.remove();
        counter--;
    }
}
