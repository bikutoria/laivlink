# This iskra comes from a match.
This web application allows users to generate conversation questions tailored to specific goals and themes for a date night. It features dynamic theme selection based on user-chosen goals, feedback buttons to improve questions, and integrated analytics to track user interactions.

Background video by [StefWithAnF](https://www.pexels.com/video/colored-liquid-mass-thinning-reactions-when-mix-with-other-liquid-3582427/)

## iskra to-do

- mobile optimization
- add sports, history, geography to topics
- add a dev mode with manual text input for all
- when choosing a goal, then choosing a theme, keep theme selection when coming back for another goal
- imrove analytics
- refactor app.js beast it is crazy out there
- add login or donations to grow
- add a goal to "feel grounded in the moment" so that questions like "what is your favourite X?" are phrased as "what is the most recent X you liked? why did it resonate?"

# useful

## to run locally

`cd iskra`
`node server.js`

open index.html in your browser

## dev mode

In console, type `enableDevMode()`

# Development log

- **Initial Setup**:
  - Created a Node.js backend using Express and Cohere AI API for question generation.
  - Set up a simple HTML front-end to accept user input (goal and theme) and display responses.
  - Added minimal CSS for basic styling.

- **Functionality Enhancements**:
  - Implemented multiple-choice selections for goals and themes.
  - Added buttons for user feedback (👍, ❤️, 👎, ♻️) and response retrieval.
  - Enabled goal and theme selection to dynamically update available themes based on selected goals.

- **User Experience Improvements**:
  - Introduced a loading indicator (GIF) to show during response fetching.
  - Split the interface into "Choice Submission" and "Questions & Feedback" sections for better user flow.
  - Added functionality to return to the choice submission screen and start a new session.

- **Analytics Integration**:
  - Integrated Amplitude for tracking events such as session starts, choice submissions, and feedback interactions.
  - Ensured console logs for Amplitude events for debugging purposes.

- **Development Mode**:
  - Introduced a dev mode toggle via a browser console command (`enableDevMode()`).
  - Hid console logs and certain buttons unless dev mode is enabled.

# Bug log

- selecting and unselecting a goal (no goals selected) gives an error, keeps the last theme spread