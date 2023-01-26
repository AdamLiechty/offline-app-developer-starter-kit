import { api, track, LightningElement } from 'lwc';
import { ResponseSubmitEvent } from 'c/surveyEvents';

export default class SurveyPresenter extends LightningElement {
    @api survey = {}
    @api
    showsurvey
    @api
    showloading
    @api
    loadingmessage
    @track
    currentPage
    @track
    pagesCount = 0
    currentPageIndex = 0
    @track
    showSave = false

    responses = {}


    connectedCallback() {
        if (this.survey.pages) {
            this.currentPage = this.survey.pages[0]
            this.pagesCount = this.survey.pages.length
        }
    }

    renderedCallback() {
        if (this.currentPageIndex === this.survey.pages.length - 1) {
            this.showSave = true;
        }
        else{
            this.showSave = false;
        }
    }

    handleNext() {
        if (this.currentPageIndex + 1 <= this.survey.pages.length - 1) {
            animate(this.template.querySelector('.formQuestion'), 'slideInRight');
            this.currentPage = this.survey.pages[++this.currentPageIndex]
        }
    }

    handlePrevious() {
        if (this.currentPageIndex - 1 >= 0) {
            animate(this.template.querySelector('.formQuestion'), 'slideInLeft');
            this.currentPage = this.survey.pages[--this.currentPageIndex]
        }
    }

    handleResponse(e) {
        const { questionId, response } = e.detail;
        this.responses = {...this.responses, [questionId]: response};
        if (response == null) {
            delete this.responses[questionId];
        }
        console.log(this.responses);
    }

    handleSave() {
        this.dispatchEvent(new ResponseSubmitEvent(
            this.survey.SurveyId,
            this.survey.Id,
            this.responses
        ));
    }
}

// Applies a CSS class to an element in order to trigger an
function animate(element, animationClass) {
    if (element._oldAnimationClass) {
        element.classList.remove(element._oldAnimationClass)
    }
    requestAnimationFrame(() => {
        // DOM has processed the element without any existing animation class.
        requestAnimationFrame(() => {
            // Add the animation class in a new animation frame.
            element.classList.add(animationClass)
            element._oldAnimationClass = animationClass;
        })
    })
}
