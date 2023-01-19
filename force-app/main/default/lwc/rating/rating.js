import { LightningElement,track,api } from 'lwc';

export default class Rating extends LightningElement {
    @track star1State = false
    @track star2State = false
    @track star3State = false
    @track star4State = false
    @track star5State = false
    @api label

    /* Dumb fix later */
    handleStar1Click() {
        this.star1State = !this.star1State;
    }

    handleStar2Click() {
        this.star2State = !this.star2State;
    }

    handleStar3Click() {
        this.star3State = !this.star3State;
    }

    handleStar4Click() {
        this.star4State = !this.star4State;
    }

    handleStar5Click() {
        this.star5State = !this.star5State;
    }
    
}
