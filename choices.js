let teamChoice = "";
let relationshipChoice = "";
let locationChoice = "";
let interestsChoice = [];

// Handle single-choice selections (radio buttons)
document.querySelectorAll('.choice-option input[type="radio"]').forEach(input => {
    input.addEventListener('change', () => {
        const group = input.closest('.choice-group').id;
        switch (group) {
            case "team":
                teamChoice = input.value;
                break;
            case "relationship":
                relationshipChoice = input.value;
                break;
            case "location":
                locationChoice = input.value;
                break;
        }
    });
});

// Handle multiple-choice selections (checkboxes)
document.querySelectorAll('.choice-option input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            interestsChoice.push(checkbox.value);
        } else {
            interestsChoice = interestsChoice.filter(item => item !== checkbox.value);
        }
    });
});

function handleChoices() {
    console.log("Team Choice: ", teamChoice);
    console.log("Relationship Choice: ", relationshipChoice);
    console.log("Location Choice: ", locationChoice);
    console.log("Interests Choice: ", interestsChoice);

    // Continue with the existing user flow
    submitChoices('What is the first question we should start the discussion with?', 0.5, 0.4);
}