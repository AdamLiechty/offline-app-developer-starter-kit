import { LightningElement, api, track } from 'lwc';
import { QuestionResponseChangeEvent } from 'c/surveyEvents';

export default class MultiPickList extends LightningElement {
    @api question
    @api response

    get options() {
        return this.question.choices.map(c => ({
            value: c.Id,
            label: c.Name
        }));
    }

    get chosenOptions() {
        const ids = this.response && this.response.value || [];
        return this.options.filter(o => ids.includes(o.value));
    }

    handleChange(e) {
        const choice = this.question.choices.find(c => c.Id === e.target.value);
        if (!choice) return;
        this.updateChoices(oldResponseValue => {
            if (oldResponseValue.includes(choice.Id)) return oldResponseValue;
            return [...oldResponseValue, choice.Id];
        })
    }    

    handleRemove(e) {
        this.updateChoices(oldResponseValue =>
            oldResponseValue.filter(id => id !== e.target.name));
    }

    updateChoices(newIdsFn) {
        const oldResponseValue = this.response && this.response.value || [];

        // Remove the clicked pill's choice from the selection set.c/createAccountRecord
        const value = newIdsFn(oldResponseValue);
        const newChoices = this.question.choices.filter(c => value.includes(c.Id));
        const displayValue = newChoices.map(c => c.Name);
        const responseEvent = new QuestionResponseChangeEvent(this.question.Id, { value, displayValue });
        this.dispatchEvent(responseEvent);
    }
}