import { LightningElement, api, wire } from 'lwc';
import { ResponseSubmitEvent } from 'c/surveyEvents';
import getVersionList from '@salesforce/apex/FormSource.getVersionList';
import getPages from '@salesforce/apex/FormSource.getPages';
import getQuestions from '@salesforce/apex/FormSource.getQuestions';
import getChoices from '@salesforce/apex/FormSource.getChoices';

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
                versions = this.getVersionListMock()
                questions = this.getQuestionsMock()
                choices = this.getChoicesMock()
                pages = this.getPagesMock()
            } else {
                versions = this.versionList;
                questions = this.questions;
                choices = this.choices;
                pages = this.pages;
                // versions = await getVersionList()
                // questions = await getQuestions()
                // choices = await getChoices()
                // pages = await getPages()
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

    getVersionListMock() {
        return [
            {
                "IsTemplate": false,
                "LastModifiedDate": "2022-11-17T14:49:32.000Z",
                "IsDeleted": false,
                "SurveyId": "0KdRO00000001Jr0AI",
                "LastViewedDate": "2022-12-12T13:44:00.000Z",
                "LastReferencedDate": "2022-12-12T13:44:00.000Z",
                "VersionNumber": 1,
                "Name": "Customer Satisfaction",
                "SystemModstamp": "2022-11-17T14:49:32.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "RowVersion": "gTI7lF2oYMlDxM+gTW1a62nzqxfxxihRqAygUNh9DPs=",
                "SurveyStatus": "Obsolete",
                "CreatedDate": "2022-11-17T14:49:30.000Z",
                "Id": "0KsRO00000001Rl0AI",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "IsTemplate": false,
                "LastModifiedDate": "2022-12-15T13:27:54.000Z",
                "IsDeleted": false,
                "SurveyId": "0KdRO00000001Jw0AI",
                "LastViewedDate": "2022-12-15T13:27:54.000Z",
                "LastReferencedDate": "2022-12-15T13:27:54.000Z",
                "VersionNumber": 5,
                "Name": "Wind turbine",
                "SystemModstamp": "2022-12-15T13:27:54.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "RowVersion": "G1Nv+Sb4ET8yi4FNWG9QT/ZcEmJXKJ6PxWEsxnJOmzw=",
                "SurveyStatus": "Active",
                "CreatedDate": "2022-12-15T13:24:08.000Z",
                "Id": "0KsRO00000001Vs0AI",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "IsTemplate": false,
                "LastModifiedDate": "2022-11-17T14:49:28.000Z",
                "IsDeleted": false,
                "SurveyId": "0KdRO00000001Jm0AI",
                "LastViewedDate": "2022-12-12T13:43:45.000Z",
                "LastReferencedDate": "2022-12-12T13:43:45.000Z",
                "VersionNumber": 1,
                "Name": "Net Promoter Score",
                "SystemModstamp": "2022-11-17T14:49:28.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "RowVersion": "gTI7lF2oYMlDxM+gTW1a62nzqxfxxihRqAygUNh9DPs=",
                "SurveyStatus": "Obsolete",
                "CreatedDate": "2022-11-17T14:49:22.000Z",
                "Id": "0KsRO00000001Rg0AI",
                "LastModifiedById": "005RO000000HzT1YAK"
            }
        ]
    }

    getQuestionsMock() {
        return [
            {
                "LastModifiedDate": "2022-11-17T14:49:32.000Z",
                "IsDeleted": false,
                "QuestionType": "Rating",
                "PageName": "Page 1",
                "Name": "How would you rate our service?",
                "SystemModstamp": "2022-11-17T14:49:32.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "SurveyPageId": "0KeRO00000002M10AI",
                "IsDeprecated": false,
                "QuestionName": "How would you rate our service?",
                "CreatedDate": "2022-11-17T14:49:32.000Z",
                "SurveyVersionId": "0KsRO00000001Rl0AI",
                "Id": "0KuRO00000002nI0AQ",
                "QuestionOrder": 1,
                "DeveloperName": "q_a246a61a_449e_4a24_b4b7_6e1930ffb5a0",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-11-17T14:49:32.000Z",
                "IsDeleted": false,
                "QuestionType": "FreeText",
                "PageName": "Page 1",
                "Name": "Any comments or feedback for us?",
                "SystemModstamp": "2022-11-17T14:49:32.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "SurveyPageId": "0KeRO00000002M10AI",
                "IsDeprecated": false,
                "QuestionName": "Any comments or feedback for us?",
                "CreatedDate": "2022-11-17T14:49:32.000Z",
                "SurveyVersionId": "0KsRO00000001Rl0AI",
                "Id": "0KuRO00000002nJ0AQ",
                "QuestionOrder": 2,
                "DeveloperName": "q_9bb47854_bb5d_4e36_9874_f5e3e2c967a0",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "QuestionType": "Picklist",
                "PageName": "Page 1",
                "Name": "Is the turbine spinning?",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "SurveyPageId": "0KeRO00000002UC0AY",
                "IsDeprecated": false,
                "QuestionName": "Is the turbine spinning?",
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KuRO00000002yg0AA",
                "QuestionOrder": 1,
                "DeveloperName": "q_49d03399_abaf_4535_99d7_6daef0f5078b",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "ValidationType": "Custom",
                "QuestionType": "ShortText",
                "PageName": "Page 1",
                "Name": "How many blades does the turbine have?",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "SurveyPageId": "0KeRO00000002UC0AY",
                "IsDeprecated": false,
                "QuestionName": "How many blades does the turbine have?",
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KuRO00000002yh0AA",
                "QuestionOrder": 2,
                "DeveloperName": "q_d405257b_4356_4eb0_94e9_0611c79796c0",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "QuestionType": "ShortText",
                "PageName": "Page 2",
                "Name": "Why is it stopped?",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "SurveyPageId": "0KeRO00000002UB0AY",
                "IsDeprecated": false,
                "QuestionName": "Why is it stopped?",
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KuRO00000002yi0AA",
                "QuestionOrder": 1,
                "DeveloperName": "q_08dfe98a_df6d_43be_8c1e_adcf1e5cad7d",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "QuestionType": "Date",
                "PageName": "Page 3",
                "Name": "Date Question!",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "SurveyPageId": "0KeRO00000002UA0AY",
                "IsDeprecated": false,
                "QuestionName": "Date Question!",
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KuRO00000002yj0AA",
                "QuestionOrder": 1,
                "DeveloperName": "q_89caeb8d_4d0a_4dc5_b111_d2bd47600e23",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "QuestionType": "Boolean",
                "PageName": "Page 3",
                "Name": "Like or Dislike Question!",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "SurveyPageId": "0KeRO00000002UA0AY",
                "IsDeprecated": false,
                "QuestionName": "Like or Dislike Question!",
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KuRO00000002yk0AA",
                "QuestionOrder": 2,
                "DeveloperName": "q_36059b5a_98db_45e0_a7b4_d649b2b71a03",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "QuestionType": "FreeText",
                "PageName": "Page 3",
                "Name": "Long Text Question!",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "SurveyPageId": "0KeRO00000002UA0AY",
                "IsDeprecated": false,
                "QuestionName": "Long Text Question!",
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KuRO00000002yl0AA",
                "QuestionOrder": 3,
                "DeveloperName": "q_1748e6f2_a1d8_4dfc_83e8_53ee7d8f27da",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "QuestionType": "MultiChoice",
                "PageName": "Page 3",
                "Name": "Multiple Selection Question",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "SurveyPageId": "0KeRO00000002UA0AY",
                "IsDeprecated": false,
                "QuestionName": "Multiple Selection Question",
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KuRO00000002ym0AA",
                "QuestionOrder": 4,
                "DeveloperName": "q_ba29d3a8_c510_4c0f_a4c3_7b3b3b89b475",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "QuestionType": "NPS",
                "PageName": "Page 3",
                "Name": "Net Promoter Score Question!",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "SurveyPageId": "0KeRO00000002UA0AY",
                "IsDeprecated": false,
                "QuestionName": "Net Promoter Score Question!",
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KuRO00000002yn0AA",
                "QuestionOrder": 5,
                "DeveloperName": "q_47e33d4f_c6e5_43e0_b002_51add2871ffc",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "QuestionType": "Picklist",
                "PageName": "Page 3",
                "Name": "Picklist Question!",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "SurveyPageId": "0KeRO00000002UA0AY",
                "IsDeprecated": false,
                "QuestionName": "Picklist Question!",
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KuRO00000002yo0AA",
                "QuestionOrder": 6,
                "DeveloperName": "q_5cda5f8b_d809_4266_a58e_28185309a9a3",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "QuestionType": "StackRank",
                "PageName": "Page 3",
                "Name": "Ranking Question!",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "SurveyPageId": "0KeRO00000002UA0AY",
                "IsDeprecated": false,
                "QuestionName": "Ranking Question!",
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KuRO00000002yp0AA",
                "QuestionOrder": 7,
                "DeveloperName": "q_a42ed03c_2b86_4bd2_8488_fc249d4098ed",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "QuestionType": "Rating",
                "PageName": "Page 3",
                "Name": "Rating Question!",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "SurveyPageId": "0KeRO00000002UA0AY",
                "IsDeprecated": false,
                "QuestionName": "Rating Question!",
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KuRO00000002yq0AA",
                "QuestionOrder": 8,
                "DeveloperName": "q_d84f770b_ed23_4903_88f7_b68fc5ba6e51",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "QuestionType": "CSAT",
                "PageName": "Page 3",
                "Name": "Score Question",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "SurveyPageId": "0KeRO00000002UA0AY",
                "IsDeprecated": false,
                "QuestionName": "Score Question",
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KuRO00000002yr0AA",
                "QuestionOrder": 9,
                "DeveloperName": "q_db16b8a8_6965_416d_935d_71047910cc68",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "QuestionType": "ShortText",
                "PageName": "Page 3",
                "Name": "Short Text Question!",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "SurveyPageId": "0KeRO00000002UA0AY",
                "IsDeprecated": false,
                "QuestionName": "Short Text Question!",
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KuRO00000002ys0AA",
                "QuestionOrder": 10,
                "DeveloperName": "q_90e10556_15e0_473f_8237_68e39c79cec6",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "QuestionType": "RadioButton",
                "PageName": "Page 3",
                "Name": "Single Selection Question",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "SurveyPageId": "0KeRO00000002UA0AY",
                "IsDeprecated": false,
                "QuestionName": "Single Selection Question",
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KuRO00000002yt0AA",
                "QuestionOrder": 11,
                "DeveloperName": "q_c654b934_b545_4ed1_9fd5_8244c9a0398d",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "QuestionType": "Slider",
                "PageName": "Page 3",
                "Name": "Slider Question",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "SurveyPageId": "0KeRO00000002UA0AY",
                "IsDeprecated": false,
                "QuestionName": "Slider Question",
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KuRO00000002yu0AA",
                "QuestionOrder": 12,
                "DeveloperName": "q_2de7e31c_4e79_40be_8673_d693ad70f233",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-11-17T14:49:29.000Z",
                "IsDeleted": false,
                "QuestionType": "NPS",
                "PageName": "Page 1",
                "Name": "How likely are you to recommend our service to a friend or colleague?",
                "SystemModstamp": "2022-11-17T14:49:29.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "SurveyPageId": "0KeRO00000002Lr0AI",
                "IsDeprecated": false,
                "QuestionName": "How likely are you to recommend our service to a friend or colleague?",
                "CreatedDate": "2022-11-17T14:49:29.000Z",
                "SurveyVersionId": "0KsRO00000001Rg0AI",
                "Id": "0KuRO00000002n80AA",
                "QuestionOrder": 1,
                "DeveloperName": "q_a9f5c9a1_900d_4ed6_ae00_3ac7123c0225",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-11-17T14:49:29.000Z",
                "IsDeleted": false,
                "QuestionType": "FreeText",
                "PageName": "Page 1",
                "Name": "Any comments or feedback for us?",
                "SystemModstamp": "2022-11-17T14:49:29.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "SurveyPageId": "0KeRO00000002Lr0AI",
                "IsDeprecated": false,
                "QuestionName": "Any comments or feedback for us?",
                "CreatedDate": "2022-11-17T14:49:29.000Z",
                "SurveyVersionId": "0KsRO00000001Rg0AI",
                "Id": "0KuRO00000002n90AA",
                "QuestionOrder": 2,
                "DeveloperName": "q_faf5a20c_5482_4e10_8981_e9992e752fdf",
                "LastModifiedById": "005RO000000HzT1YAK"
            }
        ]
    }

    getChoicesMock(){
        return [
            {
                "LastModifiedDate": "2022-11-17T14:49:32.000Z",
                "IsDeleted": false,
                "Name": "1.0",
                "SystemModstamp": "2022-11-17T14:49:32.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "QuestionId": "0KuRO00000002nI0AQ",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "IsDeprecated": false,
                "CreatedDate": "2022-11-17T14:49:32.000Z",
                "SurveyVersionId": "0KsRO00000001Rl0AI",
                "Id": "0KcRO00000003al0AA",
                "DeveloperName": "S_5287bdf3_c970_4616_92cd_4c9f84a2b989",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-11-17T14:49:32.000Z",
                "IsDeleted": false,
                "Name": "3.0",
                "SystemModstamp": "2022-11-17T14:49:32.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "QuestionId": "0KuRO00000002nI0AQ",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "IsDeprecated": false,
                "CreatedDate": "2022-11-17T14:49:32.000Z",
                "SurveyVersionId": "0KsRO00000001Rl0AI",
                "Id": "0KcRO00000003am0AA",
                "DeveloperName": "S_71e8d064_6cee_4976_b55f_c2377ee0da3e",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-11-17T14:49:32.000Z",
                "IsDeleted": false,
                "Name": "5.0",
                "SystemModstamp": "2022-11-17T14:49:32.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "QuestionId": "0KuRO00000002nI0AQ",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "IsDeprecated": false,
                "CreatedDate": "2022-11-17T14:49:32.000Z",
                "SurveyVersionId": "0KsRO00000001Rl0AI",
                "Id": "0KcRO00000003an0AA",
                "DeveloperName": "S_f87d224a_cbe4_47cd_8aac_787272eb69a8",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-11-17T14:49:32.000Z",
                "IsDeleted": false,
                "Name": "4.0",
                "SystemModstamp": "2022-11-17T14:49:32.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "QuestionId": "0KuRO00000002nI0AQ",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "IsDeprecated": false,
                "CreatedDate": "2022-11-17T14:49:32.000Z",
                "SurveyVersionId": "0KsRO00000001Rl0AI",
                "Id": "0KcRO00000003ao0AA",
                "DeveloperName": "S_b0abae33_672e_4337_a265_84c9cb10e3bb",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-11-17T14:49:32.000Z",
                "IsDeleted": false,
                "Name": "2.0",
                "SystemModstamp": "2022-11-17T14:49:32.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "QuestionId": "0KuRO00000002nI0AQ",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "IsDeprecated": false,
                "CreatedDate": "2022-11-17T14:49:32.000Z",
                "SurveyVersionId": "0KsRO00000001Rl0AI",
                "Id": "0KcRO00000003ap0AA",
                "DeveloperName": "S_98b5d5b1_42fb_452b_a6dc_948b4bc96185",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "Name": "1.0",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "QuestionId": "0KuRO00000002yq0AA",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "IsDeprecated": false,
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KcRO00000003uh0AA",
                "DeveloperName": "c_bd626750_40a1_4a37_bdf7_4dbd1607c242",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "Name": "Running Fine",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "QuestionId": "0KuRO00000002yg0AA",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "IsDeprecated": false,
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KcRO00000003ui0AA",
                "DeveloperName": "c_c1916966_056b_4ee5_bc3e_9752e3bafad8",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "Name": "Ranking 1",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "QuestionId": "0KuRO00000002yp0AA",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "IsDeprecated": false,
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KcRO00000003uY0AQ",
                "DeveloperName": "q_a42ed03c_2b86_4bd2_8488_fc249d4098ed_rank0",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "Name": "Ranking 2",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "QuestionId": "0KuRO00000002yp0AA",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "IsDeprecated": false,
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KcRO00000003uZ0AQ",
                "DeveloperName": "q_a42ed03c_2b86_4bd2_8488_fc249d4098ed_rank1",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "Name": "Like",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "QuestionId": "0KuRO00000002yk0AA",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "IsDeprecated": false,
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KcRO00000003ua0AA",
                "DeveloperName": "q_36059b5a_98db_45e0_a7b4_d649b2b71a03_bplref_tt",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "Name": "Dislike",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "QuestionId": "0KuRO00000002yk0AA",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "IsDeprecated": false,
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KcRO00000003ub0AA",
                "DeveloperName": "q_36059b5a_98db_45e0_a7b4_d649b2b71a03_bnlref_tt",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "Name": "6.0",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "QuestionId": "0KuRO00000002yq0AA",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "IsDeprecated": false,
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KcRO00000003uc0AA",
                "DeveloperName": "c_085713fa_6f58_43ea_813c_93db1f2f8df7",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "Name": "Choice 2",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "QuestionId": "0KuRO00000002ym0AA",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "IsDeprecated": false,
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KcRO00000003ud0AA",
                "DeveloperName": "c_fc2092cf_57e1_42b1_808d_2126455ae710",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "Name": "2.0",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "QuestionId": "0KuRO00000002yq0AA",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "IsDeprecated": false,
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KcRO00000003ue0AA",
                "DeveloperName": "c_0ce044fd_d171_40e5_88ce_1b188aa2b6f8",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "Name": "Not Running",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "QuestionId": "0KuRO00000002yg0AA",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "IsDeprecated": false,
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KcRO00000003uf0AA",
                "DeveloperName": "c_187977a9_f0c4_4bac_9e59_954b24fc7932",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "Name": "Choice 1",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "QuestionId": "0KuRO00000002yt0AA",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "IsDeprecated": false,
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KcRO00000003ug0AA",
                "DeveloperName": "c_55eee81c_522f_468e_bd6a_165725d8f595",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "Name": "Choice 3",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "QuestionId": "0KuRO00000002ym0AA",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "IsDeprecated": false,
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KcRO00000003uj0AA",
                "DeveloperName": "c_cefaa5ac_625f_4b32_a11e_2c6787e99013",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "Name": "5.0",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "QuestionId": "0KuRO00000002yq0AA",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "IsDeprecated": false,
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KcRO00000003uk0AA",
                "DeveloperName": "c_d1fffd94_3a67_4772_81bc_f5a15626c44a",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "Name": "Choice 1",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "QuestionId": "0KuRO00000002ym0AA",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "IsDeprecated": false,
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KcRO00000003ul0AA",
                "DeveloperName": "c_db7afc4a_0245_4ef3_bb2b_f207e66181db",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "Name": "PickList 1",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "QuestionId": "0KuRO00000002yo0AA",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "IsDeprecated": false,
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KcRO00000003um0AA",
                "DeveloperName": "c_de6cbf16_4e15_4653_9e4d_85505f021994",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "Name": "4.0",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "QuestionId": "0KuRO00000002yq0AA",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "IsDeprecated": false,
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KcRO00000003un0AA",
                "DeveloperName": "c_e46e4848_20c8_4116_adf0_2d5bdad02cc2",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "Name": "PickList 2",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "QuestionId": "0KuRO00000002yo0AA",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "IsDeprecated": false,
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KcRO00000003uo0AA",
                "DeveloperName": "c_f06c4f7c_4ab5_4bd2_b546_84fbc56ba731",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "Name": "3.0",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "QuestionId": "0KuRO00000002yq0AA",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "IsDeprecated": false,
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KcRO00000003up0AA",
                "DeveloperName": "c_f1b63357_2e24_426c_bf42_3548c7eff891",
                "LastModifiedById": "005RO000000HzT1YAK"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:55.000Z",
                "IsDeleted": false,
                "Name": "Choice 2",
                "SystemModstamp": "2022-12-15T13:27:55.000Z",
                "CreatedById": "005RO000000HzT1YAK",
                "QuestionId": "0KuRO00000002yt0AA",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "IsDeprecated": false,
                "CreatedDate": "2022-12-15T13:27:55.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KcRO00000003uq0AA",
                "DeveloperName": "c_0a1ea590_9e93_409a_9edf_56fddc9c2fef",
                "LastModifiedById": "005RO000000HzT1YAK"
            }
        ]
    }

    getPagesMock() {
        return [
            {
                "LastModifiedDate": "2022-11-17T14:49:32.000Z",
                "IsDeleted": false,
                "CreatedById": "005RO000000HzT1YAK",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "CreatedDate": "2022-11-17T14:49:32.000Z",
                "SurveyVersionId": "0KsRO00000001Rl0AI",
                "Id": "0KeRO00000002M10AI",
                "DeveloperName": "surveyQuestionPage",
                "LastModifiedById": "005RO000000HzT1YAK",
                "Name": "Page 1",
                "SystemModstamp": "2022-11-17T14:49:32.000Z"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:54.000Z",
                "IsDeleted": false,
                "CreatedById": "005RO000000HzT1YAK",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "CreatedDate": "2022-12-15T13:27:54.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KeRO00000002UA0AY",
                "DeveloperName": "p_0e31504c_4166_4c46_94d0_89c32e82285d",
                "LastModifiedById": "005RO000000HzT1YAK",
                "Name": "Page 3",
                "SystemModstamp": "2022-12-15T13:27:54.000Z"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:54.000Z",
                "IsDeleted": false,
                "CreatedById": "005RO000000HzT1YAK",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "CreatedDate": "2022-12-15T13:27:54.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KeRO00000002UB0AY",
                "DeveloperName": "p_1cd0adf9_eb17_4fb0_bf6a_2105d230f326",
                "LastModifiedById": "005RO000000HzT1YAK",
                "Name": "Page 2",
                "SystemModstamp": "2022-12-15T13:27:54.000Z"
            },
            {
                "LastModifiedDate": "2022-12-15T13:27:54.000Z",
                "IsDeleted": false,
                "CreatedById": "005RO000000HzT1YAK",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "CreatedDate": "2022-12-15T13:27:54.000Z",
                "SurveyVersionId": "0KsRO00000001Vs0AI",
                "Id": "0KeRO00000002UC0AY",
                "DeveloperName": "p_424d47c2_be13_41ae_87e7_fb1a5b1fe818",
                "LastModifiedById": "005RO000000HzT1YAK",
                "Name": "Page 1",
                "SystemModstamp": "2022-12-15T13:27:54.000Z"
            },
            {
                "LastModifiedDate": "2022-11-17T14:49:29.000Z",
                "IsDeleted": false,
                "CreatedById": "005RO000000HzT1YAK",
                "RowVersion": "cw0oLdgpzVn4vO8awkRNWa/JeGNBZlFPQfEoGFUo0RQ=",
                "CreatedDate": "2022-11-17T14:49:29.000Z",
                "SurveyVersionId": "0KsRO00000001Rg0AI",
                "Id": "0KeRO00000002Lr0AI",
                "DeveloperName": "surveyQuestionPage",
                "LastModifiedById": "005RO000000HzT1YAK",
                "Name": "Page 1",
                "SystemModstamp": "2022-11-17T14:49:29.000Z"
            }
        ]
    }
}
