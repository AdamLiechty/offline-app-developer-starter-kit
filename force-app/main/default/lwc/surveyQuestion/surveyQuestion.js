import { LightningElement, api } from 'lwc';
import { QuestionResponseChangeEvent } from 'c/surveyEvents';

/*
    Survey Question Types
    "FreeText",
    "Picklist",
    "ShortText",
    "Boolean", //Like or Dislike Question
    "Rating"
    "Slider",
    "Date",
    "MultiChoice", //Multiple Selection Question
    "NPS",
    "StackRank",
    "Rating",
    "CSAT", //Score Question
    "RadioButton", // Selection Question
*/
export default class SurveyQuestion extends LightningElement {
    @api question
    @api responses

    isType(type) {
        return this.question.QuestionType === type
    }

    get response() {
        return this.question && this.responses[this.question.Id];
    }

    get isFreeText() { return this.isType('FreeText'); }
    get isShortText() { return this.isType('ShortText'); }
    get isPickList() { return this.isType('Picklist'); }
    get isBoolean() { return this.isType('Boolean'); }
    get isRating() { return this.isType('Rating'); }
    get isSlider() { return this.isType('Slider'); }
    get isDate() { return this.isType('Date'); }
    get isMultiChoice() { return this.isType('MultiChoice'); }
    get isNPS() { return this.isType('NPS'); }
    get isStackRank() { return this.isType('StackRank'); }
    get isRating() { return this.isType('Rating'); }
    get isCSAT() { return this.isType('CSAT'); }
    get isRadioButton() { return this.isType('RadioButton'); }

    handleResponse(e) {
        this.dispatchEvent(new QuestionResponseChangeEvent(this.question.Id, e.detail.response));
    }
}
