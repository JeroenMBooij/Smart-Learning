
export const ANSWER_SHOW_HTML = `
    <div class="d-flex text-center mt-5" id="inputShowBox" name="Box">
        <p class="my-link" onclick="submitAnswer('show')">
            {showAnswer}
        </p>
    </div>
`;

export const ANSWER_TYPE_HTML = `
    <div class="d-flex" id="inputTypeBox" name="Box">
        <textarea rows="3" class="text-input ml-auto mr-auto"></textarea>
        <i class="fa-solid fa-check text-success hover-icon button-size mt-auto"></i>
    </div>
`;

export const ANSWER_WRITE_HTML = `
    <div class="d-flex justify-content-between" id="inputWriteBox" name="Box">
        <canvas class="write-canvas ml-auto mr-auto" id="write-canvas"></canvas>
        <div class="d-flex flex-column justify-content-between">
        <i class="fa-solid fa-rotate-right text-danger hover-icon button-size"></i>
            <i class="fa-solid fa-check text-success hover-icon button-size"></i>
        </div>
    </div>
`;

export const ANSWER_SPEECH_HTML = `
    <div class="d-flex justify-content-around" id="inputSpeechBox" name="Box" style="height: 85px">
        <div class="d-flex flex-column justify-content-between">
            <i class="fa-solid fa-play text-primary hover-icon button-size"></i>
            <i class="fa-solid fa-rotate-right text-danger hover-icon button-size"></i>
        </div>

        <div>
            <i class="fa-solid fa-microphone hover-icon input-size text-warning mt-5"></i>
        </div>
        <div class="mt-auto mb-auto">
            <i class="fa-solid fa-check text-success hover-icon button-size"></i>
        </div>
    </div>
`;

export const ANSWER_SHOW_CSS = `

`;

export const ANSWER_TYPE_CSS = `
    .text-input {
        width: calc(100% - 40px);
    }   
`;

export const ANSWER_WRITE_CSS = `
    .write-canvas {
        border: solid 1px black;
        height: 25vh;
        width: 80vw;
    }
`;

export const ANSWER_SPEECH_CSS = `

`;

export const ANSWER_TYPE_OPTION =`
    <i class="fa-solid fa-keyboard hover-icon" onclick="setAnswerInput('type')"></i>
`;

export const ANSWER_WRITE_OPTION =`
    <i class="fa-solid fa-pen hover-icon" onclick="setAnswerInput('write')"></i>
`;

export const ANSWER_SPEECH_OPTION =`
    <i class="fa-solid fa-microphone-lines hover-icon" onclick="setAnswerInput('speech')"></i>
`;

export const ANSWER_SUBMIT_JAVASCRIPT = `
    function submitAnswer(option)
    {
        console.log('answer');
    }
`;

export const ANSWER_DISPLAY_JAVASCRIPT = `
    let values = $("[name='box']");
    let count = 0;
    values.forEach(value => 
    {
        if(count != 0)
            value.addClass('d-none').removeClass('d-flex');
        
        count++;
    });
`;


export const ANSWER_SWITCH_JAVASCRIPT = `
    window.scrollTo(0, document.body.scrollHeight);

    let showInbox = $('#inputShowBox');
    showInbox?.removeClass('d-flex').addClass('d-none');
`;

export const ANSWER_INPUT_SHOW_JAVASCRIPT =`
    function setAnswerInput(option)
    {
        let typeInbox = $('#inputTypeBox');
        let writeInbox = $('#inputWriteBox');
        let speechInbox = $('#inputSpeechBox');

        switch(option)
        {
            case 'type':
                typeInbox?.removeClass('d-none').addClass('d-flex');
                writeInbox?.addClass('d-none').removeClass('d-flex');
                speechInbox?.addClass('d-none').removeClass('d-flex');
                break;
            case 'write':
                typeInbox?.addClass('d-none').removeClass('d-flex');
                writeInbox?.removeClass('d-none').addClass('d-flex');
                speechInbox?.addClass('d-none').removeClass('d-flex');
                break;
            case 'speech':
                typeInbox?.addClass('d-none').removeClass('d-flex');
                writeInbox?.addClass('d-none').removeClass('d-flex');
                speechInbox?.removeClass('d-none').addClass('d-flex');
                break;
        }
    }
`
