import { LightningElement, api } from 'lwc';
import { QuestionResponseChangeEvent } from 'c/surveyEvents';

export default class SingleSelection extends LightningElement {
    @api question;
    @api response;

    get responseValue() { return this.response && this.response.value; }

    get options() {
        return this.question.choices.map(c => ({
            ...c,
            isSelected: c.Id === this.responseValue
        }));
    }

    handleClick(e) {
        const choice = this.question.choices.find(c => c.Id === e.target.name);
        const displayValue = choice && choice.Name;
        const response = this.responseValue === choice.Id ? null : {
            value: e.target.name,
            displayValue
        };
        const responseEvent = new QuestionResponseChangeEvent(this.question.Id, response);
        this.dispatchEvent(responseEvent);
    }
}
