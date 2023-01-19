import { LightningElement, api, track } from 'lwc';

export default class ProgressIndicator extends LightningElement {
    @api count
    @api current
    @track steps = []
    // steps = [
    //     { label: 'Contacted', value: 'step-1' },
    //     { label: 'Open', value: 'step-2' },
    //     { label: 'Unqualified', value: 'step-3' },
    //     { label: 'Nurturing', value: 'step-4' },
    //     { label: 'Closed', value: 'step-5' },
    // ];
    connectedCallback() {
        for (let index = 0; index < this.count; index++) {
            this.steps.push( { label: 'Contacted', value: index })
            
        }
    }

}

