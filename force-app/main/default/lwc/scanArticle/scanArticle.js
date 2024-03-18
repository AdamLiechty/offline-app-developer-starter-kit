import { LightningElement, api } from "lwc";

export default class ViewArticleRecord extends LightningElement {
  @api recordId;
  @api objectApiName;
}
