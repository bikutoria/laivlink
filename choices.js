let teamChoice = "";
let relationshipChoice = "";
let locationChoice = "";

document.querySelectorAll('.selectable').forEach(label => {
    label.addEventListener('click', () => {
        // Ensure only one choice is selected per group
        const group = label.closest('.selectable-group');
        group.querySelectorAll('.selectable').forEach(item => item.classList.remove('selected'));
        label.classList.add('selected');

        // Populate variables
        switch (group.id) {
            case "team":
                teamChoice = label.getAttribute('data-value');
                break;
            case "relationship":
                relationshipChoice = label.getAttribute('data-value');
                break;
            case "location":
                locationChoice = label.getAttribute('data-value');
                break;
        }
    });
});

function handleChoices() {
    console.log("Team Choice: ", teamChoice);
    console.log("Relationship Choice: ", relationshipChoice);
    console.log("Location Choice: ", locationChoice);

    // Continue with the existing user flow
    submitChoices('What is the first question we should start the discussion with?', 0.5, 0.4);
}