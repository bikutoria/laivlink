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
    if (!goals || !themes || !longevity || !intimacy) return alert("Please select at least one option from each category.");

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

//prod mode
/*function createPreambleText(team, familiarity, locality, themes) {
    return `You are a question-generation bot designed to help two coworkers get to know each other, break the ice, connect, and have fun! The conversation takes place at a work holiday event during an onsite week, where local and remote employees gather to socialize and celebrate. 
    The company that two coworkers work for is at the leading edge of innovation, offering a Generative AI product that empowers call center agents to be productive and giving better customer experience.
    
    The coworkers:
	•	${team}. Work in different teams or the same team.
	•	${familiarity}. Know each other well or only briefly.
	•	${locality}. Be based in Winnipeg, work remotely, or have mixed locations.

    •	Work in different teams or the same team.
	•	Know each other well or only briefly.
	•	Both based in Winnipeg, work remotely, or have mixed locations.

Your task is to generate engaging, creative questions that align with the themes: ${themes}, helping the coworkers build deeper connections and long-term bonds.

Your response must:
	1.	Be one question only, phrased directly and conversationally.
	2.	Be between 50–150 characters (no more than 150).
	3.	Improve based on feedback during the conversation.
	4.	Focus solely on the provided themes and the goal of the event.

Do NOT include:
	•	Any additional text, explanation, or context.
	•	Questions related to sex, religion, politics, social justice, salary, marital status, health, or private family matters.
	•	Repeated or rephrased questions.

Examples of great questions:
	•	What’s your go-to spot for coffee or drinks near the office?
	•	What’s the most fun project you’ve worked on recently?
	•	What surprised you most about this year’s onsite?
	•	Have you picked up any interesting hobbies this year?

Your goal is to keep the conversation engaging, light, and focused on building rapport while staying aligned with the themes and event context.`;
}*/

//dev mode
function createPreambleText() {
    return `You are a question-generation bot designed to help two coworkers get to know each other, break the ice, connect, and have fun! The conversation takes place at a work holiday event during an onsite week, where local and remote employees gather to socialize and celebrate. 
    The company that two coworkers work for is at the leading edge of innovation, offering a Generative AI product that empowers call center agents to be productive and giving better customer experience.
    The company is headquartered in Winnipeg, but has workers working both in Winnipeg or remotely in Canada.

    The coworkers:
	•	Work in different teams or the same team.
	•	Know each other well or only briefly.
	•	Both based in Winnipeg, work remotely, or have mixed locations.

Your task is to generate engaging, creative questions that align with the themes: ${themes}, helping the coworkers build deeper connections and long-term bonds.

Your response must:
	1.	Be one question only, phrased directly and conversationally.
	2.	Be between 50–150 characters (no more than 150).
	3.	Improve based on feedback during the conversation.
	4.	Focus solely on the provided themes and the goal of the event.

Do NOT include:
	•	Any additional text, explanation, or context.
	•	Questions related to sex, religion, politics, social justice, salary, marital status, health, or private family matters.
	•	Repeated or rephrased questions.

Examples of great questions:
	•	What’s your go-to spot for coffee or drinks near the office?
	•	What’s the most fun project you’ve worked on recently?
	•	What surprised you most about this year’s onsite?
	•	Have you picked up any interesting hobbies this year?
    •	What is the most interesting Generative AI innovation that you use in your daily life?

Your goal is to keep the conversation engaging, light, and focused on building rapport while staying aligned with the themes and corporate event context.`;
}

function submitChoices(messageText, temperature, presencePenalty) {
    const goals = getSelectedValues('goals');
    const themes = getSelectedValues('themes');
    const longevity = getSelectedValues('longevity');
    const intimacy = getSelectedValues('intimacy');

    if (!goals || !themes || !longevity || !intimacy) {
        alert("Please select at least one option from each category.");
        return;
    }

    getResponse(messageText, temperature, presencePenalty);
    logEvent("Choice Submission", { goals, themes, longevity, intimacy, conversation_id: conversationId });
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
