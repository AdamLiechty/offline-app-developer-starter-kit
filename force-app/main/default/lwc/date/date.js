import { LightningElement, api } from 'lwc';
import { QuestionResponseChangeEvent } from 'c/surveyEvents';

export default class Date extends LightningElement {
    @api question
    @api response

    get responseValue() { return this.response && this.response.value; }

    handleChange(e) {
        const responseEvent = new QuestionResponseChangeEvent(this.question.Id, {
            value: e.target.value
        });
        this.dispatchEvent(responseEvent);
    }    
}
