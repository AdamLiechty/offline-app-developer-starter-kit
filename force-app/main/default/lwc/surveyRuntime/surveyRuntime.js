import { api, wire, LightningElement } from "lwc";
import {
  createRecord,
  getRecordCreateDefaults,
  generateRecordInputForCreate,
} from "lightning/uiRecordApi";
import SURVEY_RESPONSE_OBJECT from "@salesforce/schema/OfflineSurveyResponse__c";

export default class SurveyRuntime extends LightningElement {
  @api recordId;
  @api objectApiName;

  @wire(getRecordCreateDefaults, { objectApiName: SURVEY_RESPONSE_OBJECT })
  surveyResponseCreateDefaults;

  handleResponseSubmit(event) {
    const { surveyId, surveyVersionId, responses } = event.detail;

    const defaults = this.surveyResponseCreateDefaults.data;
    const objectInfo =
      defaults.objectInfos[SURVEY_RESPONSE_OBJECT.objectApiName];
    const record = {
      apiName: defaults.record.apiName,
      fields: {
        ...defaults.record.fields,
        SurveyVersionId__c: surveyVersionId,
        ResponseJSON__c: JSON.stringify(responses),
      },
    };

    const recordInput = generateRecordInputForCreate(record, objectInfo);
    createRecord(recordInput).then(() => {
      console.log("created OfflineSurveyResponse__c", recordInput);
      history.back(); // Close window.
    });
  }
}
