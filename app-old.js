amplitude.getInstance().init("1486dec43c66669fa40c6fc9a50f177d");

let devMode = false;
let conversationId = uuid.v4();
if (devMode) console.log(`New session started with conversation ID: ${conversationId}`);
logEvent("Welcome Page View", { conversation_id: conversationId });

const MAX_GOALS = 2, MAX_THEMES = 4;
const themesByGoals = {
    'have fun': ['travel', 'sports', 'movies', 'music', 'food & cooking', 'date ideas', 'funny stories', 'new projects', 'would you rather', 'cheeky questions'],
    'get to know each other': ['travel', 'sports', 'movies', 'music', 'books', 'TV', 'childhood', 'shared experiences', 'would you rather', 'values', 'personal opinions', 'personal favorites'],
    'introspect together': ['books', 'health', 'personal and career growth', 'new projects', 'childhood', 'philosophy', 'values', 'personal opinions', 'spirituality'],
    'explore future': ['new projects', 'bucket list', 'date ideas', 'personal and career growth', 'philosophy', 'values', 'personal opinions'],
    'discuss life goals': ['travel', 'personal and career growth', 'new projects', 'bucket list', 'shared experiences', 'values', 'personal opinions'],
    'deepen the connection': ['travel', 'sports', 'health', 'movies', 'music', 'books', 'TV', 'date ideas', 'shared experiences', 'would you rather', 'cheeky questions', 'philosophy', 'values', 'personal opinions', 'spirituality'],
    'simply chat': ['sports', 'movies', 'funny stories', 'food & cooking', 'music', 'books', 'TV', 'date ideas', 'would you rather', 'cheeky questions', 'personal favorites']
};

function logEvent(event, properties) {
    amplitude.getInstance().logEvent(event, properties);
    if (devMode) console.log(`Event: ${event}`, properties);
}

function handleSelection(group, maxSelections, callback) {
    document.querySelectorAll(`#${group} label`).forEach(label => {
        label.addEventListener('click', () => {
            toggleSelection(label, group, maxSelections);
            if (callback) callback();
        });
    });
}

function toggleSelection(label, group, maxSelections) {
    const selectedLabels = document.querySelectorAll(`#${group} .selected`);
    if (label.classList.contains('selected')) {
        label.classList.remove('selected');
    } else if (selectedLabels.length < maxSelections) {
        label.classList.add('selected');
    } else {
        alert(`You can select up to ${maxSelections} ${group === 'goals' ? 'goals' : 'themes'}.`);
    }
}

function updateThemes() {
    const selectedGoals = getSelectedValues('goals').split(', ');
    const themesSet = new Set();
    selectedGoals.forEach(goal => themesByGoals[goal].forEach(theme => themesSet.add(theme)));

    const themesDiv = document.getElementById('themes');
    themesDiv.innerHTML = '';
    themesSet.forEach(theme => {
        const label = document.createElement('label');
        label.textContent = theme;
        label.setAttribute('data-value', theme);
        themesDiv.appendChild(label);
    });
    handleSelection('themes', MAX_THEMES);
}

function getSelectedValues(group) {
    return Array.from(document.querySelectorAll(`#${group} .selected`)).map(label => label.getAttribute('data-value')).join(', ');
}

async function getResponse(messageText, temperature, presencePenalty) {
    const goals = getSelectedValues('goals'), themes = getSelectedValues('themes');
    const longevity = getSelectedValues('longevity'), intimacy = getSelectedValues('intimacy');
    if (!goals || !themes || !longevity || !intimacy) {
        alert("Please select at least one option from each category.");
        return;
    }

    const preambleText = createPreambleText(goals, themes, longevity, intimacy);
    showLoading();
    try {
        const response = await fetch('https://innovative-ariadne-bikutoria-07e577dd.koyeb.app/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ preamble: preambleText, message: messageText, conversation_id: conversationId, temperature, presencePenalty })
        });
        const data = await response.json();
        document.getElementById('response').innerText = data.response.text;
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error processing your request. Please try again later.');
    } finally {
        hideLoading();
    }
}

function createPreambleText(goals, themes, longevity, intimacy) {
    return `You are a question generation bot used by a couple currently having a date night. The couple's relationship longevity is ${longevity} and the level of intimacy is ${intimacy}.
The goals of the evening are to ${goals}. Your job is to come up with questions that you can ask each other to get to know each other deeper and build a long-term bond.
Here are the themes we are interested in: ${themes}.

Your response should:
- be between 50 and 150 characters, but no more than 150 characters.
- contain one question only.
- not include any additional text, explanation, or context.
- consider the relationship's longevity and intimacy from the first question and deepend further with more questions.
- not include " at the start or the end of the question.
- improve based on the feedback throughout the conversation.
- never repeat even in a rephrased way.
- never mention sexual topics.
- phrased directly, in an engaging way.
- revolve around the themes of interest and work towards the goal of the evening throughout the conversation.`;
}

function submitChoices(messageText, temperature, presencePenalty) {
    getResponse(messageText, temperature, presencePenalty);
    logEvent("Choice Submission", { goals: getSelectedValues('goals'), themes: getSelectedValues('themes'), longevity: getSelectedValues('longevity'), intimacy: getSelectedValues('intimacy'), conversation_id: conversationId });
    toggleVisibility('choice-submission', 'response-section');
}

function submitFeedback(messageText, buttonValue, temperature, presencePenalty) {
    document.getElementById('response').innerHTML = '<div id="loading"><img src="loading.gif" alt="Loading..."></div>';
    logEvent("Question and Feedback", { response_value: document.getElementById('response').innerText, button_value: buttonValue, conversation_id: conversationId });
    getResponse(messageText, temperature, presencePenalty);
}

function startNewSession() {
    conversationId = uuid.v4();
    if (devMode) console.log(`New session started with conversation ID: ${conversationId}`);
    logEvent("Welcome Page View", { conversation_id: conversationId });
    toggleVisibility('response-section', 'choice-submission');
}

function returnToChoices() {
    toggleVisibility('response-section', 'choice-submission');
}

function showLoading() {
    const responseDiv = document.getElementById('response');
    responseDiv.innerHTML = '<div id="loading"><img src="loading.gif" alt="Loading..."></div>';
}

function hideLoading() {
    const loadingDiv = document.getElementById('loading');
    loadingDiv.style.display = 'none';
    loadingDiv.innerHTML = '';
}

function toggleVisibility(hideId, showId) {
    document.getElementById(hideId).style.display = 'none';
    const showElement = document.getElementById(showId);
    showElement.style.display = 'flex';
    showElement.style.flexDirection = 'column';
    showElement.style.alignItems = 'center';
    showElement.style.justifyContent = 'center';
}

// Initialize goal selection handling
handleSelection('goals', MAX_GOALS, updateThemes);
handleSelection('longevity', 1);
handleSelection('intimacy', 1);

// Enable dev mode via console
window.enableDevMode = function () {
    devMode = true;
    document.getElementById('startNewSession').style.display = 'block';
    document.getElementById('returnToChoices').style.display = 'block';
    console.log("Dev mode enabled");
};
