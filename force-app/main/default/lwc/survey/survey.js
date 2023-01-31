import { LightningElement, api, wire } from 'lwc';
import { ResponseSubmitEvent } from 'c/surveyEvents';
import getVersionList from '@salesforce/apex/SurveySource.getVersionList';
import getPages from '@salesforce/apex/SurveySource.getPages';
import getQuestions from '@salesforce/apex/SurveySource.getQuestions';
import getChoices from '@salesforce/apex/SurveySource.getChoices';
import mockData from './mockData';

function bucket(arr, keyFn) {
    return arr.reduce((map, x) => {
        const key = keyFn(x);
        const bucket = map.get(key) || [];
        if (bucket.length === 0) map.set(key, bucket);
        bucket.push(x);
        return map;
    }, new Map())
}

export default class SurveyRuntime extends LightningElement {
    @api surveyId;

    mSurvey = {}
    mShowSurvey = false
    mShowLoading = true
    mLoadingMessage = "Loading..."
    //debug
    mockApex = false //Load mock JSON in place of Apex

    versionList;
    questions;
    choices;
    pages;

    @wire(getVersionList)
    wiredVersionList({ error, data }) {
        if (data) {
            this.versionList = data;
            this.processSurveyData();
        } else if (error) {
            console.error(error)
            this.versionList = undefined;
        }
    }

    @wire(getQuestions)
    wiredQuestions({ error, data }) {
        if (data) {
            this.questions = data;
            this.processSurveyData();
        } else if (error) {
            console.error(error)
            this.questions = undefined;
        }
    }

    @wire(getChoices)
    wiredChoices({ error, data }) {
        if (data) {
            this.choices = data;
            this.processSurveyData();
        } else if (error) {
            console.error(error)
            this.choices = undefined;
        }
    }

    @wire(getPages)
    wiredPages({ error, data }) {
        if (data) {
            this.pages = data;
            this.processSurveyData();
        } else if (error) {
            console.error(error)
            this.pages = undefined;
        }
    }

    async processSurveyData() {
        if (this.versionList && this.questions && this.choices && this.pages) {
            await this.openSurvey(this.surveyId);
        }
    }

    async openSurvey(surveyId) {
        console.log(`Loading Survey ${surveyId}`)
        if(surveyId){
            this.mLoadingMessage = "Loading Questions..."
            let versions
            let questions
            let choices 
            let pages
            if (this.mockApex) {
                console.log(`!!Using Mock Data!!`)
                versions = mockData.versionList
                questions = mockData.questions
                choices = mockData.choices
                pages = mockData.pages
            } else {
                versions = this.versionList;
                questions = this.questions;
                choices = this.choices;
                pages = this.pages;
            }
            this.mLoadingMessage = "Reading Questions..."
            const version = versions.find((v) => v.SurveyId === surveyId && v.SurveyStatus === 'Active')
            this.mSurvey = { ...version }

            const questionsByPage = bucket(questions, q => q.SurveyPageId);
            const choicesByQuestion = bucket(choices, c => c.QuestionId);

            this.mSurvey.pages = pages.filter(p => p.SurveyVersionId === version.Id).map(p => {
                const currentPage = { ...p };
                const pageQuestions = questionsByPage.get(currentPage.Id) || [];
                currentPage.questions = pageQuestions.map(q => {
                    const question = { ...q };
                    question.choices = choicesByQuestion.get(q.Id) || [];
                    question.choices.sort((a,b)=>{ return a.Name > b.Name ? 1 : -1 });
                    return question;
                }).sort((a,b) => a.QuestionOrder - b.QuestionOrder);
                return currentPage;
            }).sort((a, b) => a.Name > b.Name ? 1 : -1);

            console.log(`Reading Complete`);
            this.mShowSurvey = true
            this.mShowLoading = false
        }
    }

    handleResponseSubmit(event) {
        const { surveyId, surveyVersionId, responses } = event.detail;
        this.dispatchEvent(new ResponseSubmitEvent(surveyId, surveyVersionId, responses));
    }
}
