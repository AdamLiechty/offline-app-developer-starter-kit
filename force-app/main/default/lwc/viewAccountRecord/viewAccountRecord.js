import { LightningElement, api, wire } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ViewAccountRecord extends LightningElement {
  @api recordId;
  @api objectApiName;

  @wire(getRecord, { recordId: "$recordId", layoutTypes: "Compact" })
  record;

  get name() {
    return this.recordDataExists &&
      this.record.data.fields &&
      this.record.data.fields.Name
      ? this.record.data.fields.Name.value
      : "";
  }

  get draftDetails() {
    if (
      !(
        this.recordDataExists &&
        this.record.data.drafts &&
        this.record.data.drafts.serverValues
      )
    ) {
      return null;
    }

    // flatten the serverValues
    const draftChanges = this.record.data.drafts.serverValues;
    const serverChanges = Object.keys(draftChanges).map((key) => ({
      fieldName: key,
      ...draftChanges[key],
    }));

    return serverChanges;
  }

  get cardIconName() {
    return "standard:" + this.objectApiName.toLowerCase();
  }

  get recordDataExists() {
    return this.record && this.record.data;
  }

  exampleToast() {
    const toastEvent = new ShowToastEvent({
      title: 'Toast title',
      message: 'Toast message. See https://developer.salesforce.com/docs/component-library/documentation/en/lwc/use_toast',
      variant: 'info'
    });
    this.dispatchEvent(toastEvent);
  }
}
