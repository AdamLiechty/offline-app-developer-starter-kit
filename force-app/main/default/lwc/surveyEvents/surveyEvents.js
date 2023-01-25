export class QuestionResponseChangeEvent extends CustomEvent {
    constructor(questionId, response) {
        super('questionresponsechange', {
            bubbles: true,
            detail: { questionId, response }
        })
    }
} 

export class ResponseSubmitEvent extends CustomEvent {
    constructor(surveyId, surveyVersionId, responses) {
        super('responsesubmit', {
            bubbles: true,
            detail: { surveyId, surveyVersionId, responses }
        })
    }
}
