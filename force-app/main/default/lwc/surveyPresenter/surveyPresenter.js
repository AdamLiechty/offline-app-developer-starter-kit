import { api, track, LightningElement } from 'lwc';

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
        // eslint-disable-next-line @lwc/lwc/no-async-operation
    }

    handleNext() {
        if (this.currentPageIndex + 1 <= this.survey.pages.length - 1) {
            let question = this.template.querySelector('.formQuestion')
            question.classList.add('slideInRight')
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            setTimeout( function(){
                question.classList.remove('slideInRight')
            },500)
            this.currentPage = this.survey.pages[++this.currentPageIndex]
        }
    }

    handlePrevious() {
        if (this.currentPageIndex - 1 >= 0) {
            this.template.querySelector('.formQuestion').classList.add('fadeLeftSlide');
            let question = this.template.querySelector('.formQuestion')
            question.classList.add('slideInLeft');
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            setTimeout( function(){
                question.classList.remove('slideInLeft')
            },500)
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
        console.log(this.responses);
        history.back()// close window
    }
}
