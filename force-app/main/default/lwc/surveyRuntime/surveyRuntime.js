import { api, LightningElement } from 'lwc';

export default class SurveyRuntime extends LightningElement {
    @api recordId;
    @api objectApiName;
}
