export class QuestionResponseChangeEvent extends CustomEvent {
    constructor(questionId, response) {
        super('questionresponsechange', {
            bubbles: true,
            detail: { questionId, response }
        })
    }
} 
