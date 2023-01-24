public with sharing class FormSource {
    @AuraEnabled(cacheable=true)
    public static List<SurveyVersion> getVersionList() {
        return [
            SELECT BrandingSetId, CreatedById, CreatedDate, Description, Id, IsDeleted, IsTemplate, LastModifiedById, LastModifiedDate, LastReferencedDate, LastViewedDate, Name, SurveyId, SurveyStatus, SystemModstamp, VersionNumber
            FROM SurveyVersion
            WHERE SurveyStatus = 'Active'
            WITH SECURITY_ENFORCED
            LIMIT 100
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Survey> getSurveyList() {
        return [
            SELECT ActiveVersionId, CreatedById, CreatedDate, Description, DeveloperName, Id, IsDeleted, LastModifiedById, LastModifiedDate, LastReferencedDate, LastViewedDate, LatestVersionId, Name, NamespacePrefix, OwnerId, SurveyType, SystemModstamp, TotalVersionsCount
            FROM Survey
            WITH SECURITY_ENFORCED
            LIMIT 100
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<SurveyPage> getPages() {
        return [
            SELECT CreatedById, CreatedDate, DeveloperName, Id, IsDeleted, LastModifiedById, LastModifiedDate, Name, SurveyVersionId, SystemModstamp
            FROM SurveyPage
            WITH SECURITY_ENFORCED
            LIMIT 100
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<SurveyQuestion> getQuestions() {
        return [
            SELECT CreatedById, CreatedDate, DeveloperName, Id, IsDeleted, IsDeprecated, LastModifiedById, LastModifiedDate, Name, PageName, QuestionName, QuestionOrder, QuestionType, SurveyPageId, SurveyVersionId, SystemModstamp, ValidationType
            FROM SurveyQuestion
            WITH SECURITY_ENFORCED
            LIMIT 100
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<SurveyQuestionChoice> getChoices() {
        return [
            SELECT CreatedById, CreatedDate, DeveloperName, Id, IsDeleted, IsDeprecated, LastModifiedById, LastModifiedDate, Name, QuestionId, SurveyVersionId, SystemModstamp
            FROM SurveyQuestionChoice
            WITH SECURITY_ENFORCED
            LIMIT 100
        ];
    }
}