export const FEEDBACK_INPUT_CSS = `
    .feedback-row {
        display:flex;
        justify-content: space-between;
        height: 85px;
    }

    .feedback-button {
        width: 20%;
        height: 30px;
        color: white;
        opacity: 0.7;
        font-weight: bold;
        margin-top: auto;
    }

    .feedback-button:hover {
        cursor: pointer;
        opacity: 1;
    }
`

export const FEEDBACK_INPUT_HTML = `
    <div class="feedback-row">
        <button class="feedback-button bg-danger">{again}</button>
        <button class="feedback-button bg-secondary">{hard}</button>
        <button class="feedback-button bg-success">{good}</button>
        <button class="feedback-button bg-primary">{easy}</button>
    </div>
`;