import { LightningElement, api } from 'lwc';
import { QuestionResponseChangeEvent } from 'c/surveyEvents';

export default class SurveyPage extends LightningElement {
    @api page
    @api responses

    handleResponse(e) {
        this.dispatchEvent(new QuestionResponseChangeEvent(e.detail.questionId, e.detail.response));
    }
}
