amplitude.getInstance().init("1486dec43c66669fa40c6fc9a50f177d");

let devMode = false;
let conversationId = uuid.v4();
if (devMode) console.log(`New session started with conversation ID: ${conversationId}`);
logEvent("Welcome Page View", { conversation_id: conversationId });

const MAX_GOALS = 2, MAX_THEMES = 4;

function logEvent(event, properties) {
    amplitude.getInstance().logEvent(event, properties);
    if (devMode) console.log(`Event: ${event}`, properties);
}

function handleSelection(group, maxSelections) {
    document.querySelectorAll(`#${group} label`).forEach(label => {
        label.addEventListener('click', () => {
            toggleSelection(label, group, maxSelections);
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

function getSelectedValues(group) {
    return Array.from(document.querySelectorAll(`#${group} .selected`)).map(label => label.getAttribute('data-value')).join(', ');
}

async function getResponse(messageText, temperature, presencePenalty) {
    const goals = getSelectedValues('goals');
    const themes = getSelectedValues('themes');
    const longevity = getSelectedValues('longevity');
    const intimacy = getSelectedValues('intimacy');
    
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
    return `You are a question-generation bot designed to help two coworkers get to know each other, connect, and have meaningful conversations at a work holiday event. Your goal is to craft thought-provoking, creative, and engaging questions that avoid clichés or overly simplistic ideas. Focus on creating a question that sparks genuine curiosity and encourages deeper discussion.

The company that two coworkers work for is at the leading edge of innovation, offering a Generative AI product that empowers call centre agents to be productive and giving better customer experience. The company is headquartered in Winnipeg, but has workers working both in Winnipeg or remotely in Canada.

The coworkers:
    •   ${longevity}.
    •   ${intimacy}.
    •   ${goals}.
    •   Have shared interests in ${themes}.

Your task:
1. Generate the **most interesting and thought-provoking question** based on the shared interests provided.
2. The question must be direct, clear, easy to understand and creative, avoiding generic or "cringe" phrasing.
3. The tone should be intelligent, conversational, and professional, respecting the work context.
4. The question must align with the themes and goals of the event while being engaging and insightful.

Avoid:
- Generic icebreakers or overused conversation starters.
- Questions that seem forced, awkward, or overly casual.
- Topics related to personal or sensitive matters like health, salary, marital status, or politics.

Examples:
- What’s the most innovative idea you've heard this year, and why did it resonate with you?
- If you could collaborate on a dream project with anyone at the company, what would it be?
- What’s one skill you’ve mastered recently that you’re proud of?
- What’s a surprising insight you've gained from working in your role?
- What’s the most fun project you’ve worked on recently?
- What surprised you most about this year’s onsite?
- Have you picked up any interesting hobbies this year?

Your response must:
- Be a single question, phrased in an intelligent and conversational style.
- Be concise (50–140 characters).
- Focus solely on the provided themes and goals, ensuring relevance and engagement.
- Be formatted with no extra quotation marks and wording, only 1 question.

Remember, your priority is to offer the most compelling and thoughtful question right from the start to make the conversation meaningful, memorable, and fun.`;
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

// Initialize selection handling
handleSelection('goals', MAX_GOALS);
handleSelection('themes', MAX_THEMES);
handleSelection('longevity', 1);
handleSelection('intimacy', 1);