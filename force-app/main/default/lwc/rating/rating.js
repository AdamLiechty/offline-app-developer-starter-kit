import { LightningElement, api } from 'lwc';
import { QuestionResponseChangeEvent } from 'c/surveyEvents';

export default class Rating extends LightningElement {
    @api question
    @api response

    get choices() {
        return this.question.choices.map(c => ({
            Id: c.Id,
            Name: c.Name,
            selected: this.response && this.response.value === c.Id
        }))
    }

    handleClick(e) {
        const responseEvent = new QuestionResponseChangeEvent(this.question.Id, {
            value: e.target.dataset.id,
            displayValue: e.target.dataset.name
        });
        this.dispatchEvent(responseEvent);
    }    
}
