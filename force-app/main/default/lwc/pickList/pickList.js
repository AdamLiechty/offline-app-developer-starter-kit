import { LightningElement, api } from 'lwc';

export default class PickList extends LightningElement {
    @api choices
    value = 'inProgress';

    get options() {
        let options = []
        for (let index = 0; index < this.choices.length; index++) {
            let choice = this.choices[index];
            options.push({ label: choice.Name, value: choice.Id })
            
        }
        return options
    }

    handleChange(event) {
        this.value = event.detail.value;
    }
}
