import { LightningElement,track } from 'lwc';

export default class LikeDislike extends LightningElement {
    @track likeState = false;
    @track dislikeState = false;

    handleLikeButtonClick() {
        this.likeState = !this.likeState;
        this.dislikeState = false;
    }

    handleDislikeButtonClick() {
        this.dislikeState = !this.dislikeState;
        this.likeState = false;
    }
}
