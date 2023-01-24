export class QuestionResponseChangeEvent extends CustomEvent {
    constructor(questionId, {value, displayValue}) {
        super('questionresponsechange', {
            bubbles: true,
            detail: {
                questionId,
                response: { value, displayValue }
            }
        })
    }
} 
