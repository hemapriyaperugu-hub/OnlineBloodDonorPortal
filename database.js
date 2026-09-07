// ============================================
// BLOODCONNECT - SUPABASE DATABASE
// ============================================

const SUPABASE_URL = "https://hutfetcubzrzehsnutgr.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_nB9Bfwm2XHoijitzSRvS9w_VAUs0dC4";


// Common headers for Supabase REST API
function getHeaders() {
    return {
        "apikey": SUPABASE_PUBLISHABLE_KEY,
        "Authorization": `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        "Content-Type": "application/json"
    };
}


// ============================================
// DONORS
// ============================================

// Add a donor
async function addDonor(donor) {

    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/donors`,
        {
            method: "POST",

            headers: {
                ...getHeaders(),
                "Prefer": "return=representation"
            },

            body: JSON.stringify({
                name: donor.name,
                age: donor.age,
                blood_group: donor.bloodGroup,
                phone: donor.phone,
                location: donor.location,
                last_donation: donor.lastDonation || null,
                availability: donor.availability
            })
        }
    );

    if (!response.ok) {
        const error = await response.text();
        console.error("Add donor error:", error);
        throw new Error("Failed to register donor.");
    }

    const data = await response.json();

    return convertDonor(data[0]);
}


// Get all donors
async function getAllDonors() {

    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/donors?select=*&order=id.asc`,
        {
            method: "GET",
            headers: getHeaders()
        }
    );

    if (!response.ok) {
        const error = await response.text();
        console.error("Get donors error:", error);
        throw new Error("Failed to load donors.");
    }

    const data = await response.json();

    return data.map(convertDonor);
}


// Get one donor by ID
async function getDonorById(id) {

    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/donors?id=eq.${id}&select=*`,
        {
            method: "GET",
            headers: getHeaders()
        }
    );

    if (!response.ok) {
        throw new Error("Failed to load donor.");
    }

    const data = await response.json();

    if (data.length === 0) {
        return null;
    }

    return convertDonor(data[0]);
}


// Update donor
async function updateDonor(id, donor) {

    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/donors?id=eq.${id}`,
        {
            method: "PATCH",

            headers: {
                ...getHeaders(),
                "Prefer": "return=representation"
            },

            body: JSON.stringify({
                name: donor.name,
                age: donor.age,
                blood_group: donor.bloodGroup,
                phone: donor.phone,
                location: donor.location,
                last_donation: donor.lastDonation || null,
                availability: donor.availability
            })
        }
    );

    if (!response.ok) {
        const error = await response.text();
        console.error("Update donor error:", error);
        throw new Error("Failed to update donor.");
    }

    const data = await response.json();

    return data.length > 0 ? convertDonor(data[0]) : null;
}


// Delete donor
async function deleteDonor(id) {

    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/donors?id=eq.${id}`,
        {
            method: "DELETE",
            headers: getHeaders()
        }
    );

    if (!response.ok) {
        const error = await response.text();
        console.error("Delete donor error:", error);
        throw new Error("Failed to delete donor.");
    }

    return true;
}


// Convert Supabase donor format
// to the format already used by your website
function convertDonor(donor) {

    return {
        id: donor.id,
        name: donor.name,
        age: donor.age,
        bloodGroup: donor.blood_group,
        phone: donor.phone,
        location: donor.location,
        lastDonation: donor.last_donation,
        availability: donor.availability,
        registeredDate: donor.registered_date
    };
}


// ============================================
// EMERGENCY REQUESTS
// ============================================

// Add emergency request
async function addEmergencyRequest(requestData) {

    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/emergency_requests`,
        {
            method: "POST",

            headers: {
                ...getHeaders(),
                "Prefer": "return=representation"
            },

            body: JSON.stringify({
                patient_name: requestData.patientName,
                blood_group: requestData.bloodGroup,
                units_required: requestData.unitsRequired,
                hospital: requestData.hospital,
                location: requestData.location,
                contact_number: requestData.contactNumber,
                urgency: requestData.urgency,
                additional_information:
                    requestData.additionalInformation || null
            })
        }
    );

    if (!response.ok) {
        const error = await response.text();
        console.error("Add emergency request error:", error);
        throw new Error("Failed to create emergency request.");
    }

    const data = await response.json();

    return convertEmergencyRequest(data[0]);
}


// Get all emergency requests
async function getAllEmergencyRequests() {

    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/emergency_requests?select=*&order=id.desc`,
        {
            method: "GET",
            headers: getHeaders()
        }
    );

    if (!response.ok) {
        const error = await response.text();
        console.error("Get emergency requests error:", error);
        throw new Error("Failed to load emergency requests.");
    }

    const data = await response.json();

    return data.map(convertEmergencyRequest);
}


// Delete emergency request
async function deleteEmergencyRequest(id) {

    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/emergency_requests?id=eq.${id}`,
        {
            method: "DELETE",
            headers: getHeaders()
        }
    );

    if (!response.ok) {
        const error = await response.text();
        console.error("Delete emergency request error:", error);
        throw new Error("Failed to delete emergency request.");
    }

    return true;
}


// Convert Supabase request format
// to the format used by the website
function convertEmergencyRequest(request) {

    return {
        id: request.id,
        patientName: request.patient_name,
        bloodGroup: request.blood_group,
        unitsRequired: request.units_required,
        hospital: request.hospital,
        location: request.location,
        contactNumber: request.contact_number,
        urgency: request.urgency,
        additionalInformation:
            request.additional_information,
        createdAt: request.created_at
    };
}


// ============================================
// DATABASE CONNECTION TEST
// ============================================

async function testDatabaseConnection() {

    try {

        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/donors?select=id&limit=1`,
            {
                method: "GET",
                headers: getHeaders()
            }
        );

        if (response.ok) {
            console.log("✅ BloodConnect Supabase database connected.");
            return true;
        }

        console.error(
            "❌ Supabase connection failed:",
            await response.text()
        );

        return false;

    } catch (error) {

        console.error(
            "❌ Database connection error:",
            error
        );

        return false;
    }
}


// Test connection when page loads
testDatabaseConnection();
