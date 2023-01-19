import { LightningElement, api, track } from 'lwc';

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
    @track typeFreeText
    @track typePickList
    @track typeShortText
    @track typeBoolean
    @track typeRating
    @track typeSlider
    @track typeDate
    @track typeMultiChoice
    @track typeNPS
    @track typeStackRank
    @track typeRating
    @track typeCSAT
    @track typeRadioButton
    @track choices

    connectedCallback(){
        if( this.question) {
            console.log(this.question.QuestionType)
            this.typeFreeText = this.question.QuestionType === 'FreeText'
            this.typeShortText = this.question.QuestionType === 'ShortText'
            this.typePickList = this.question.QuestionType === 'Picklist'
            this.typeBoolean = this.question.QuestionType === 'Boolean'
            this.typeRating = this.question.QuestionType === 'Rating'
            this.typeSlider = this.question.QuestionType === 'Slider'
            this.typeDate = this.question.QuestionType === 'Date'
            this.typeMultiChoice = this.question.QuestionType === 'MultiChoice'
            this.typeNPS = this.question.QuestionType === 'NPS'
            this.typeStackRank = this.question.QuestionType === 'StackRank'
            this.typeRating = this.question.QuestionType === 'Rating'
            this.typeCSAT = this.question.QuestionType === 'CSAT'
            this.typeRadioButton = this.question.QuestionType === 'RadioButton'
        }
    }

    @api
    get questionType() {
        return this.question.QuestionType 
    }



}
