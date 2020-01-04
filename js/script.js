const desk = document.getElementById("board");

updateDatePickers(); // update the date

getCardsFromLocalStorage(); // get the cards from the local storage

document.addEventListener("click", (event) => {
    let target = event.target;
    if (target.classList.contains("header-button")) { 
        // opens a modal window by removing class 'overlay-hidden'
        document.getElementsByClassName('overlay')[0].classList.remove('overlay-hidden');
    }
    if (target.classList.contains('overlay') || target.classList.contains('cross')) {
        closeModal(); // close the modal window by clicking either on the cross or in any other place
        clearDoctorFormSettings(); // clear all fields of the doctor's form
    }
    if (target.id === "doctors-list") { 
        // show the doctor's list by switching to class 'doctors-list_opened'
        document.getElementsByClassName("select-doctor")[0].classList.toggle("doctors-list_opened");
    }
    if (target.classList.contains("doctor")) {
        chooseDoctorSettings(target); // choose the form for the appropriate physician
    }
    if (target.id !== "doctors-list" && !target.classList.contains("doctor")) {
        // hide the doctor's list by removing the class 'doctors-list_opened'
        document.getElementsByClassName('select-doctor')[0].classList.remove('doctors-list_opened');
    }
    if (target.classList.contains("show-more")) {
        showMoreInfo(target); // show more info
    }
    if (target.classList.contains("submit-btn")) {
        event.preventDefault(); // prevent default settings
        let parent = target.parentElement; // let's consider that click was on parent element
        let inputs = parent.querySelectorAll("input"); // take all parent elements (with tag 'input')
        const arr = []; // create an array with items
        inputs.forEach((item) => { // for each item in an element with tag 'input'
            arr.push(item.value); // add the value of the item into array
        });
        if (arr.every((a) => { // if every element of the array 
            return a !== ""; // is not empty string, than return it
        })) {   
            console.log('ok');             // else:
            saveInputVal();  // save the value which has being added
            closeModal();    // close the modal window by adding a class 'overlay-hidden' 
            clearDoctorFormSettings(); // clearing all fields of the doctor's form
        }
    }
    if (target.classList.contains("delete-card")) { // let's click on element with class 'delete-card'
        closeCard(target); // close the card
    }
});

function clearCurrentDoctorChoice() { // clear the fields of a doctor choosing
    // if there are fields with class 'form-shown'
    if (document.getElementsByClassName("form-shown").length) { 
        // remove those fields by taking the class 'form-shown' out
        document.getElementsByClassName("form-shown")[0].classList.remove("form-shown");
    }
}

function clearDoctorFormSettings() { // clear all the fields of the doctor's form
    clearCurrentDoctorChoice(); // clear the fields of a doctor choosing
    // let the inner text 'Choose a doctor' be assigned for an element with id 'doctors-list' 
    document.getElementById("doctors-list").innerHTML = "Choose a doctor";
    // set attributes 'data-doc' to '' for element with id 'doctors-list'
    document.getElementById("doctors-list").setAttribute("data-doc", ""); 
    const forms = document.querySelectorAll(".info-input"); // select all elements with class 'info-input'
    forms.forEach((item) => { // to parse all elements of the array
        item.value = ""; // assign а value of '' to the element with class 'info-input'
    });
    const textareas = document.querySelectorAll("textarea"); // select all fields with the tag 'text area'
    textareas.forEach((item) => { // to parse all elements of the array
        item.value = ''; // assign а value of '' to the fields with the tag 'text area'
    })
}

function chooseDoctorSettings(doctor) { // choose the doctor (certain specialist)
    // assigne the text written in a doctor's field  to string in a doctor's list
    document.getElementById("doctors-list").innerHTML = doctor.innerHTML;
    // set an attribute 'data-doc' with the doctor's id to a field in a doctor's  list
    document.getElementById("doctors-list").setAttribute("data-doc", `${doctor.id}`);
    // switch to the form for certain cpecialist with the class 'doctors-list_opened' in the doctor's list
    document.getElementsByClassName("select-doctor")[0].classList.toggle("doctors-list_opened");
    clearCurrentDoctorChoice(); // close the doctor's fields
    document.getElementById(`${doctor.id}-form`).classList.add("form-shown"); // create the doctor's form by adding the required fields
}

function closeModal() { // close the modal window
    // close the modal window by adding a class 'overlay-hidden'
    console.log('closed');
    document.getElementsByClassName("overlay")[0].classList.add("overlay-hidden");
    console.log(document.getElementsByClassName("overlay")[0])
}

function updateDatePickers() { // update the date
    let today = new Date().toISOString().substr(0, 10);
    document.querySelectorAll('.visit-date').forEach((item) => {
        item.setAttribute('min', `${today}`);
    });
    document.querySelector('.prev-visit-date').setAttribute('max', `${today}`);
}

function showMoreInfo(btn) { // create a switch-button when click the button 'Show more' and backwards
    let parentCard = btn.parentElement; // assigne the button of the parent element to parent card
    let hiddenInfo = parentCard.querySelectorAll(".card-content-additional"); // assigne all elements in a parentCard to hiddenInfo
    hiddenInfo.forEach((item) => { // to parse all elements of the array
        item.classList.toggle("card-content-hidden"); // switch the item with class 'card-content-hidden' to 'hide' and backwards
    });
        if (btn.innerHTML === "Show more") { 
            btn.innerHTML = "Hide"; // assigne inner text to 'Hide'
        } else {                       // or
            btn.innerHTML = "Show more"; // assigne inner text to 'Show more'
        }
}

function saveInputVal(chosenDoctor) { // create a fields with a filled values for a specialist
    // return the (first) array with atribut 'data-Doc' delimitered with'-' of the element with id 'doctors-list'
    chosenDoctor = document.getElementById("doctors-list").getAttribute('data-Doc').split('-')[0];

    if (chosenDoctor === "therapist") {
        let form = document.querySelector(`#${chosenDoctor}-form`);
        let name = form.querySelector('[name=name]').value;
        let date = form.querySelector('[name=date]').value;
        let purpose = form.querySelector('[name=visit-reason]').value;
        let comment = form.querySelector('[name=comment]').value;
        let age = form.querySelector('[name=age]').value;
        const item = new Therapist(name, date, purpose, comment, age);
        item.createNoteCard(); // create a card for a specialist 'therapist'
    }
    if (chosenDoctor === "cardiologist") {
        let form = document.querySelector(`#${chosenDoctor}-form`);
        let name = form.querySelector('[name=name]').value;
        let date = form.querySelector('[name=date]').value;
        let purpose = form.querySelector('[name=visit-reason]').value;
        let comment = form.querySelector('[name=comment]').value;
        let age = form.querySelector('[name=age]').value;
        let pressure = form.querySelector('[name=pressure]').value;
        let index = form.querySelector('[name=index-mass]').value;
        let diseases = form.querySelector('[name=cardio-disease]').value;
        const item = new Cardiologist(name, date, purpose, comment, age, pressure, index, diseases);
        item.createNoteCard(); // create a card for a specialist 'cardiologist'
    }
    if (chosenDoctor === "dentist") {
        let form = document.querySelector(`#${chosenDoctor}-form`);
        let name = form.querySelector('[name=name]').value;
        let date = form.querySelector('[name=date]').value;
        let purpose = form.querySelector('[name=visit-reason]').value;
        let comment = form.querySelector('[name=comment]').value;
        let prevDate = form.querySelector('[name=prev-visit]').value;
        const item = new Dentist(name, date, purpose, comment, prevDate);
        item.createNoteCard(); // create a card for a specialist 'dentist'

    }
}

function getCardsFromLocalStorage() { // get the cards from the local storage
    let local = localStorage.length; // assigne the elements of the local storage to local
    if (local > 0) { // if the local storage has at least one element
        desk.querySelector("p").innerHTML = ""; // than assigne the inner text of the 'p'-element to ''
        for (let l = 0; l < local; l++) { // if the elements of the has at least one element
            let key = localStorage.key(l); // assigne the element of the local storage as key
            let item = localStorage.getItem(key); // assigne the element of the local with the key as item
            desk.innerHTML += item; // add the description-text to the item
        }
    }
}

function closeCard(card) { // close a card
    let parent = card.parentNode; // assigne a parent node of the card to parent (card)
    let currentID = parent.getAttribute('data-id'); // take the parent-elements with attribute 'data-id' and assigned it to current id
    window.localStorage.removeItem(currentID); // remove element with current id from the local storage
    desk.removeChild(parent); // remove parent (card) from the desk
    checkEmptyDesk(); // verify the desk
}

function checkEmptyDesk() { // verify the desk
    // if it is true that the number of elements with the class 'card' is zero
    if (!document.querySelectorAll(".card").length) { 
        // than assigne the description-text of the 'p'-element of the desk to 'No items have been added'
        desk.querySelector("p").innerHTML = 'No items have been added'; 
    }
}

// creates a main class 'Visit'
class Visit {
    constructor(doctor, name, date, purpose, comment, color = "yellow") {
        this.name = {
            description: "Name:",
            text: name
        };
        this.doctor = {
            description: "Doctor:",
            text: doctor
        };
        this.date = {
            description: "Date:",
            text: date
        };
        this.purpose = {
            description: "Visit purpose:",
            text: purpose
        };
        this.comment = {
            description: "Comments:",
            text: comment
        };
        this.color = color;
        this.obligatoryInfo = [this.name, this.doctor];
        this.supplementaryInfo = [this.date, this.purpose, this.comment];
    }

    createNoteCard() { // add a method - create a note card
        let card = document.createElement("div"); // creare a 'div'-element - that is our card
        card.classList.add("card"); // assigne a class 'card' to 'div'-element
        card.style.backgroundColor = `${this.color}`; // style a 'div'-element with color
        // card.style.borderColor = `${this.borderColor}`; // style a 'div'-element with borderColor
        desk.appendChild(card); // add the 'div'-element to the document

        if (desk.querySelector("p").innerHTML !== "") { // if in 'p' was something left
            desk.querySelector("p").innerHTML = ""; // remove it
        }

        // in order to add mandatory information on the card
        for (let i = 0; i < this.obligatoryInfo.length; i++) {
            let info = document.createElement("p"); // creare a 'p'-element - that is our obligatoryInfo
            info.classList.add("card-content");// add a class 'card-content'
            // set the required values for the element 'p' with the class 'card-content'
            info.innerText = `${this.obligatoryInfo[i].description} ${this.obligatoryInfo[i].text}`;
            card.appendChild(info); // додаєм елемент в карточку
        }

        // in order to add additional information to the card
        for (let i = 0; i < this.supplementaryInfo.length; i++) { 
            let info = document.createElement("p"); // creare a 'p'-element - that is our supplementaryInfo
            info.classList.add("card-content"); // add a class 'card-content'
            info.classList.add("card-content-additional"); // додаємо клас 'card-info-additional'
            info.classList.add("card-content-hidden"); // додаємо також клас 'card-content-hidden'
            // set the supplementary values for the element 'p' with the class 'card-info'
            info.innerText = `${this.supplementaryInfo[i].description} ${this.supplementaryInfo[i].text}`;
            card.appendChild(info);
        }

        // create a button to show more info
        let showMoreBtn = document.createElement("button"); // creare a 'button'-element - that is our show more button
        showMoreBtn.classList.add("show-more"); // add a class 'show-more' to the 'button'-element
        showMoreBtn.innerHTML = "Show more"; // assigne the description-text to the 'button'-element
        card.appendChild(showMoreBtn); // add a 'button'-element to the document
        let deleteBtn = document.createElement("btn"); // creare a 'btn'-element - that is our delete button
        deleteBtn.classList.add("delete-card"); // add class 'delete-card' to the 'btn'-element
        card.appendChild(deleteBtn); // add a 'btn'-element to the document

        let newID = new Date().toISOString().substr(0, 19);

        card.setAttribute("data-ID", `${newID}`); // add the Attributes of the elements with 'data-ID'

        localStorage.setItem(`${newID}`, card.outerHTML); // install the item in the local storage with newID

        makeDragonDrop(card); // make a card D'n'D
    }

}

// creates a class 'Therapist' and inherit the properties of the class 'Visit'
class Therapist extends Visit { 
    constructor(name, date, purpose, comment, age) {
        super("Therapist", name, date, purpose, comment, "#ee82ee");
        this.age = {
            description: "Age:",
            text: age
        };
        this.supplementaryInfo.push(this.age);
    }
}

findCard(); // find a card for D'n'D

function makeDragonDrop(cardTarget) { // make a card D'n'D
    let card = cardTarget;

    function move(e) {
        let cord = card.getBoundingClientRect();
        let dek = desk.getBoundingClientRect();
        if ((cord.x - 20 - dek.x) < 0) {
            card.mousePositionX = e.clientX + card.offsetLeft - 20;
        }
        if ((cord.y - 20 - dek.y) < 0) {
            card.mousePositionY = e.clientY + card.offsetTop - 20;
        }
        if (((dek.x + dek.width) - (cord.x + cord.width + 20)) < 0) {
            card.mousePositionX = (card.offsetLeft + cord.width - dek.width) + e.clientX + 30;
        }
        if (((dek.y + dek.height) - (cord.y + cord.height + 20)) < 0) {
            card.mousePositionY = (card.offsetTop + cord.height - dek.height) + e.clientY + 30;
        }
        card.style.transform = `translate(${e.clientX - card.mousePositionX}px,${e.clientY - card.mousePositionY}px)`;
    }

    card.addEventListener('mousedown', (e) => {
        if (card.style.transform) {
            const transforms = card.style.transform;
            const transformX = parseFloat(transforms.split('(')[1].split(',')[0]);
            const transformY = parseFloat(transforms.split('(')[1].split(',')[1]);
            card.mousePositionX = e.clientX - transformX;
            card.mousePositionY = e.clientY - transformY;
        } else {
            card.mousePositionX = e.clientX;
            card.mousePositionY = e.clientY;
        }
        document.addEventListener('mousemove', move);
    });

    document.addEventListener('mouseup', e => {

    document.removeEventListener('mousemove', move);
    });
}


function findCard() { // find a card for D'n'D
    if (document.querySelectorAll(".card").length) {  // if it's true that the number of the elements is not zero
        document.querySelectorAll(".card").forEach((item) => { // to parse all elements of the array
            makeDragonDrop(item); //  we can drag and drop them
        })
    }
}

// created a class 'Cardiologist' and inherited the properties of the class 'Visit'
class Cardiologist extends Visit {
    constructor(name, date, purpose, comment, age, pressure, index, diseases) {
        super("Cardiologist", name, date, purpose, comment, "#ffa500");
        this.age = {
            description: "Age:",
            text: age
        };
        this.pressure = {
            description: "Pressure:",
            text: pressure
        };
        this.index = {
            description: "BMI:",
            text: index
        };
        this.diseases = {
            description: "Diseases:",
            text: diseases
        };
        this.supplementaryInfo.push(this.age);
        this.supplementaryInfo.push(this.pressure);
        this.supplementaryInfo.push(this.index);
        this.supplementaryInfo.push(this.diseases);
    }
}

// created a class 'Dentist' and inherited the properties of the class 'Visit'
class Dentist extends Visit {
    constructor(name, date, purpose, comment, prevDate) {
        super("Dentist", name, date, purpose, comment, "dodgerblue");
        this.prevDate = {
            description: "Recent visit date:",
            text: prevDate
        };
        this.supplementaryInfo.push(this.prevDate);
    }
}