import { api, LightningElement } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';

export default class SurveyRuntime extends LightningElement {
    @api recordId;
    @api objectApiName;

    handleResponseSubmit(event) {
        const { surveyId, surveyVersionId, responses } = event.detail;

        const responseObj = {
            apiName: 'OfflineSurveyResponse__c',
            fields: {
                SurveyVersionId__c: surveyVersionId,
                ResponseJSON__c: JSON.stringify(responses)
            }
        };
        createRecord(responseObj).then(() => {
            console.log('created OfflineSurveyResponse__c', responseObj);
            history.back() // Close window.
        });
    }
}
