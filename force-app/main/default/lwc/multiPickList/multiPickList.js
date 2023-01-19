import { LightningElement, track } from 'lwc';

export default class MultiPickList extends LightningElement {
    value = 'inProgress';

    @track options = [
        { label: 'New', value: 'new' },
        { label: 'In Progress', value: 'inProgress' },
        { label: 'Finished', value: 'finished' },
    ];

    @track allValues = [];

    handleChange(event) {
        if(!this.allValues.includes(event.target.value)){
            this.allValues.push(event.target.value)
        }
    }

    handleRemove(event) {
        const valueRemoved = event.target.name;
        this.allValues.splice(this.allValues.indexOf(valueRemoved),1)
    }
}