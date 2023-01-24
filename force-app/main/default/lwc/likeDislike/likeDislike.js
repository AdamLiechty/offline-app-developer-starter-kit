import { LightningElement, api } from 'lwc';
import { QuestionResponseChangeEvent } from 'c/surveyEvents';

export default class LikeDislike extends LightningElement {
    @api question
    @api response

    get likeState() { return this.response && this.response.value === true; }
    get dislikeState() { return this.response && this.response.value === false; }

    handleLikeButtonClick() {
        const value = this.likeState ? null : true;
        this.fireResponse(value);
    }

    handleDislikeButtonClick() {
        const value = this.dislikeState ? null : false;
        this.fireResponse(value);
    }

    fireResponse(value) {
        const response = value == null ? null : { value }
        const responseEvent = new QuestionResponseChangeEvent(this.question.Id, response);
        this.dispatchEvent(responseEvent);
    }
}
