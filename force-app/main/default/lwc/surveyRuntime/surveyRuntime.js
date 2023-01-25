import { api, LightningElement } from 'lwc';

export default class SurveyRuntime extends LightningElement {
    @api recordId;
    @api objectApiName;

    handleResponseSubmit(event) {
        const { surveyId, surveyVersionId, responses } = event.detail;
        console.log(surveyId, surveyVersionId, responses);

        history.back() // Close window.
    }
}
