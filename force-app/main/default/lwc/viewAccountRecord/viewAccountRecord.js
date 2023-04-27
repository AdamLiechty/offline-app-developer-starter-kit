import { LightningElement, api, wire } from "lwc";
import {
  getRecord,
  createRecord,
  getRecordCreateDefaults,
  generateRecordInputForCreate,
} from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

import NAME_FIELD from "@salesforce/schema/Account.Name";
import PHONE_FIELD from "@salesforce/schema/Account.Phone";
import WEBSITE_FIELD from "@salesforce/schema/Account.Website";
import INDUSTRY_FIELD from "@salesforce/schema/Account.Industry";
import TYPE_FIELD from "@salesforce/schema/Account.Type";

export default class ViewAccountRecord extends LightningElement {
  @api recordId;
  @api objectApiName;

  get fields() {
    return [NAME_FIELD, PHONE_FIELD, WEBSITE_FIELD, INDUSTRY_FIELD, TYPE_FIELD];
  }

  @wire(getRecord, { recordId: "$recordId", fields: "$fields" })
  record;

  get name() {
    return this.record?.data?.fields?.Name?.value ?? "";
  }

  exampleToast() {
    const toastEvent = new ShowToastEvent({
      title: "Toast title",
      message:
        "Toast message. See https://developer.salesforce.com/docs/component-library/documentation/en/lwc/use_toast",
      variant: "info",
    });
    this.dispatchEvent(toastEvent);
  }

  // createCustom() {
  //   const defaults = this.objectCreateDefaults.data;
  //   const objectInfo = defaults.objectInfos.OfflineSurveyResponse__c;
  //   const record = {
  //     apiName: defaults.record.apiName,
  //     fields: {
  //       ...defaults.record.fields,
  //       Name: "Custom create",
  //       ResponseJSON__c: JSON.stringify({ test: "JSON" }),
  //       SurveyVersionId__c: "001002003004005006",
  //     },
  //   };
  //   record.fields.Name = "Custom create";
  //   record.fields.ResponseJSON__c = JSON.stringify({ test: "JSON" });
  //   record.fields.SurveyVersionId__c = "001002003004005006";
  //   const recordInput = generateRecordInputForCreate(record, objectInfo);
  //   createRecord(recordInput)
  //     .then((x) => console.log("created custom object", x))
  //     .catch((e) => console.error(e));
  // }
}
