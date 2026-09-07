/* ================================
   PAGE NAVIGATION
================================ */

function showPage(pageId) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {
        page.classList.remove("active");
    });


    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active");
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    if (pageId === "find") {
        displayAllDonors();
    }
}


/* ================================
   DONOR REGISTRATION
================================ */

document.addEventListener("DOMContentLoaded", function () {

    const donorForm = document.getElementById("donorForm");


    if (!donorForm) {
        return;
    }


    donorForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const name =
            document.getElementById("name").value.trim();

        const age =
            parseInt(
                document.getElementById("age").value
            );

        const bloodGroup =
            document.getElementById("bloodGroup").value;

        const phone =
            document.getElementById("phone").value.trim();

        const location =
            document.getElementById("location").value.trim();

        const lastDonation =
            document.getElementById("lastDonation").value;

        const availability =
            document.getElementById("availability").value;


        /* VALIDATION */

        if (name.length < 3) {

            showMessage(
                "Please enter a valid name.",
                "error"
            );

            return;
        }


        if (isNaN(age) || age < 18 || age > 65) {

            showMessage(
                "Please enter an age between 18 and 65.",
                "error"
            );

            return;
        }


        if (!/^[0-9]{10}$/.test(phone)) {

            showMessage(
                "Please enter a valid 10-digit phone number.",
                "error"
            );

            return;
        }


        if (!bloodGroup) {

            showMessage(
                "Please select a blood group.",
                "error"
            );

            return;
        }


        if (!location) {

            showMessage(
                "Please enter your location.",
                "error"
            );

            return;
        }


        if (!availability) {

            showMessage(
                "Please select your availability.",
                "error"
            );

            return;
        }


        /* DONOR OBJECT */

        const donor = {

            name: name,

            age: age,

            bloodGroup: bloodGroup,

            phone: phone,

            location: location,

            lastDonation: lastDonation || "Not provided",

            availability: availability,

            registeredDate:
                new Date().toISOString()

        };


        try {

            await addDonor(donor);


            showMessage(
                "Donor registered successfully!",
                "success"
            );


            donorForm.reset();


        } catch (error) {

            console.error(error);


            showMessage(
                "Unable to register donor.",
                "error"
            );

        }

    });

});


/* ================================
   FORM MESSAGE
================================ */

function showMessage(message, type) {

    const messageBox =
        document.getElementById("formMessage");


    if (!messageBox) {
        return;
    }


    messageBox.textContent = message;


    if (type === "success") {

        messageBox.style.color = "green";

    } else {

        messageBox.style.color = "red";

    }


    setTimeout(() => {

        messageBox.textContent = "";

    }, 4000);

}


/* ================================
   DISPLAY ALL DONORS
================================ */

async function displayAllDonors() {

    try {

        const donors = await getAllDonors();

        displayDonorResults(donors);

    } catch (error) {

        console.error(error);

    }

}


/* ================================
   SEARCH DONORS
================================ */

async function searchDonors() {

    const bloodGroup =
        document
            .getElementById("searchBloodGroup")
            .value
            .toLowerCase();


    const location =
        document
            .getElementById("searchLocation")
            .value
            .trim()
            .toLowerCase();


    try {

        const donors = await getAllDonors();


        const filteredDonors = donors.filter(donor => {

            const bloodMatch =
                !bloodGroup ||
                donor.bloodGroup.toLowerCase() === bloodGroup;


            const locationMatch =
                !location ||
                donor.location
                    .toLowerCase()
                    .includes(location);


            return bloodMatch && locationMatch;

        });


        displayDonorResults(filteredDonors);


    } catch (error) {

        console.error(error);

    }

}


/* ================================
   DISPLAY DONOR RESULTS
================================ */

function displayDonorResults(donors) {

    const results =
        document.getElementById("donorResults");


    if (!results) {
        return;
    }


    results.innerHTML = "";


    if (donors.length === 0) {

        results.innerHTML = `
            <div class="no-results">
                <h3>No Donors Found</h3>
                <p>
                    No matching donor records are available.
                </p>
            </div>
        `;

        return;
    }


    donors.forEach(donor => {

        const card =
            document.createElement("div");

        card.className = "donor-card";


        card.innerHTML = `

            <h3>
                ${escapeHTML(donor.name)}
            </h3>

            <p>
                <strong>Blood Group:</strong>
                ${escapeHTML(donor.bloodGroup)}
            </p>

            <p>
                <strong>Age:</strong>
                ${escapeHTML(String(donor.age))}
            </p>

            <p>
                <strong>Phone:</strong>
                ${escapeHTML(donor.phone)}
            </p>

            <p>
                <strong>Location:</strong>
                ${escapeHTML(donor.location)}
            </p>

            <p>
                <strong>Last Donation:</strong>
                ${escapeHTML(donor.lastDonation)}
            </p>

            <p>
                <strong>Availability:</strong>
                ${escapeHTML(donor.availability)}
            </p>

            <button
                class="delete-btn"
                onclick="removeDonor(${donor.id})"
            >
                Delete
            </button>

        `;


        results.appendChild(card);

    });

}


/* ================================
   DELETE DONOR
================================ */

async function removeDonor(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this donor?"
        );


    if (!confirmed) {
        return;
    }


    try {

        await deleteDonor(id);

        alert("Donor deleted successfully.");

        displayAllDonors();


    } catch (error) {

        console.error(error);

        alert("Unable to delete donor.");

    }

}


/* ================================
   SECURITY
================================ */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}