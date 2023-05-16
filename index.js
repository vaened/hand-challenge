const MIN_CELL = 0;
const MAX_CELL = 255;

let pointer = 0;
let memory = [];

const safeguard = (pointer) => {
    if (pointer > MAX_CELL) {
        return MIN_CELL;
    }

    if (pointer < MIN_CELL) {
        return MAX_CELL;
    }

    return pointer;
}

const loop = {
    '🤜': {
        revert: '🤛',
        modify: (val) => ++ val,
    },
    '🤛': {
        revert: '🤜',
        modify: (val) => -- val,
    },
}

function conditionalJumpFor(instruction, sentences, currentPosition) {
    let coincidences = 0;
    const action = loop[instruction];

    for (sentences.length > currentPosition; (currentPosition = action.modify(currentPosition));) {
        const character = sentences[currentPosition];

        if (character === instruction) {
            coincidences ++;
        }

        if (character === action.revert) {
            break;
        }
    }

    while (coincidences > 0) {
        const character = sentences[(currentPosition = action.modify(currentPosition))];

        if (character === action.revert) {
            coincidences --;
        }
    }

    return currentPosition;
}

function trans(sentence) {
    const sentences = Array.from(sentence);
    const codes = [];

    for (let currentPosition = 0; sentences.length > currentPosition; currentPosition ++) {
        const instruction = sentences[currentPosition];

        switch (instruction) {
            case '👉':
                pointer ++;
                break;
            case '👈':
                pointer --;
                break;
            case '👆':
                memory[pointer] = safeguard((memory[pointer] || 0) + 1)
                break;
            case '👇':
                memory[pointer] = safeguard((memory[pointer] || 0) - 1)
                break;
            case '🤜':
                currentPosition = memory[pointer] !== 0 ? currentPosition : conditionalJumpFor('🤜', sentences, currentPosition);
                break;
            case '🤛':
                currentPosition = memory[pointer] === 0 ? currentPosition : conditionalJumpFor('🤛', sentences, currentPosition);
                break;
            case '👊':
                codes.push(memory[pointer]);
                break;
        }
    }

    console.log({
        ascii: codes.join('|'),
        text: codes.map(letter => String.fromCharCode(letter)).join('')
    })
}

trans('👉👆👆👆👆👆👆👆👆🤜👇👈👆👆👆👆👆👆👆👆👆👉🤛👈👊👉👉👆👉👇🤜👆🤛👆👆👉👆👆👉👆👆👆🤜👉🤜👇👉👆👆👆👈👈👆👆👆👉🤛👈👈🤛👉👇👇👇👇👇👊👉👇👉👆👆👆👊👊👆👆👆👊👉👇👊👈👈👆🤜👉🤜👆👉👆🤛👉👉🤛👈👇👇👇👇👇👇👇👇👇👇👇👇👇👇👊👉👉👊👆👆👆👊👇👇👇👇👇👇👊👇👇👇👇👇👇👇👇👊👉👆👊👉👆👊');