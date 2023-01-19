import { LightningElement,api } from 'lwc';

export default class SingleSelection extends LightningElement {
    isSelected = false;
    isSelected2 = false;
    @api label

    handleClick() {
        this.isSelected = !this.isSelected;
    }

    handleClick2() {
        this.isSelected2 = !this.isSelected2;
    }
}
