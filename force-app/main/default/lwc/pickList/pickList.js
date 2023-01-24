import { LightningElement, api } from 'lwc';
import { QuestionResponseChangeEvent } from 'c/surveyEvents';

export default class PickList extends LightningElement {
    @api question
    @api response

    get responseValue() { return this.response && this.response.value; }

    get options() {
        return this.question.choices.map(c => ({
            value: c.Id,
            label: c.Name
        }));
    }

    handleChange(e) {
        const choice = this.question.choices.find(c => c.Id === e.target.value);
        const displayValue = choice && choice.Name;
        const responseEvent = new QuestionResponseChangeEvent(this.question.Id, {
            value: e.target.value,
            displayValue
        });
        this.dispatchEvent(responseEvent);
    }    
}
