# Offline App Developer Starter Kit

The Offline App Developer Starter Kit provides instructions and sample code to get you up and running quickly with Lightning Web Components (LWC) Offline. This README provides steps to clone, modify, and deploy example offline components and quick actions, and view them in the offline-enabled version of the Salesforce Mobile app.

## Prerequisites

- The Salesforce product team will enable the following permissions for your organization during onboarding: 
  - `LightningWebRuntime`
  - `LightningSDK`
  - `Briefcase`
- Install Salesforce CLI:
  - Follow the steps in the [Salesforce CLI Setup Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_intro.htm)
- Install Visual Studio Code and the Salesforce Extension Pack
  - [Visual Studio Code Download](https://code.visualstudio.com/download)
  - [Salesforce Extension Pack](https://marketplace.visualstudio.com/items?itemName=salesforce.salesforcedx-vscode)

### Set up Briefcase

1. Navigate to Briefcase Builder from Setup and click **New Briefcase**:
  ![Setup Briefcase](images/SetupBriefcase.png)

2. Follow the wizard to create a new Briefcase:
  ![Briefcase Wizard](images/BriefcaseWizard1.png)

3. Select objects and filters to apply:
  ![Briefcase Wizard](images/BriefcaseWizard2.png)

4. Set user assignments and complete the wizard. A new Briefcase is created:
  ![Briefcase Wizard](images/BriefcaseWizard3.png)

## Set Up The Starter Kit Project

1. Clone this repository:  
  
   ```sh
   git clone https://github.com/salesforce/offline-app-developer-starter-kit.git
   ```

2. Open directory:

   ```sh
   cd offline-app-developer-starter-kit
   ```

3. Authorize access to your org. Either Salesforce CLI or VS Code can be used for authorization and deployment. VS Code is recommended.

   - Authorize Salesforce from VS Code:

      - Enter the command palette in VSCode (CMD+SHIFT+P) and type `SFDX:Authorize an org`
        ![VS Code Authorize](images/VSCodeAuthorize.png)
      - A browser window opens with the Salesforce login screen. Log in to your org.

   - **Alternatively,** authorize Salesforce from CLI:

      ```sh
      sfdx auth:web:login -d -a AliasName
      ```

      - Login with your org credentials
      - **-d** sets this the default org with the CLI
      - **-a** sets an alias

      See also: [CLI Reference](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference.htm)

## View and Modify Components and Quick Actions

Navigate to:

```sh
cd force-app/main/default
```

- `lwc/` directory contains example Lightning web component bundles:  
  ![VS Code Authorize](images/lwcDirectory.png)
- `quickActions/` directory contains example Quick Actions:  
  ![Quick Actions](images/quickActionsDirectory.png)

  For example: `Account.view.quickAction-meta.xml` contains metadata to describe a quick action:

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <QuickAction xmlns="http://soap.sforce.com/2006/04/metadata">
      <actionSubtype>ScreenAction</actionSubtype>
      <label>View</label>
      <lightningWebComponent>genericVisit</lightningWebComponent>
      <optionsCreateFeedItem>false</optionsCreateFeedItem>
      <type>LightningWebComponent</type>
  </QuickAction>
  ```

  The `<lightningWebComponent>` element specifies the Lightning web component loaded for
  the given quick action.

## Deploy Changes

Before you can run a changed component, you need to deploy it to your org. Changes made to components or quick actions can be deployed via the CLI or VS Code.

Using CLI:

```sh
sfdx force:source:deploy --sourcepath ./force-app/main/default
```

Using VS Code:

- Right-click on a component or Quick Action and select: `SFDX: Deploy Source to Org`  
  ![VS Code Deploy](images/DeployVSCode.png)
- Upon successful deploy you will see in the console:  
  ![VS Deploy Success](images/DeployedLWCConsole.png)

> **Note**
> You might need to clear caches and quit the app and restart it before changes to LWCs are active.
## Add LWC Quick Actions to Mobile Layouts

![Add LWC Quick Actions to Mobile Layouts](images/LWCQuickActionsMobileLayouts.png)

For a quick action to appear in the action bar for a record view, it must be assigned to the main page layout for the record's object type.

Here's an example of assigning the Edit LWC quick action for an Account:

1. From Setup, open the Object Manager.
2. Enter `Account` in the Quick Find box, then select **Account**.
3. From the Account object management settings, go to **Page Layouts** and click **Account Layout**.
4. In the **Salesforce Mobile and Lightning Experience Actions** panel, if you see a link to **override the predefined actions**, the page layout is using the default actions. Click the link to enable customizing the actions.
5. Select **Mobile & Lightning Actions** in the palette.
6. Drag the **Edit (LWC)** quick action into the mobile section. Make it the first item.
7. _Optional:_ Reorganize the actions so frequently used actions are first, and remove any unnecessary actions.
8. Click **Save**.

> **Note**
> In a future release you will be able to assign quick actions per record type. For the time being, only actions on the main page layout are shown.

## View Offline Components in the Salesforce Mobile App

> **Note**
> The experience is identical across iOS and Android.

- Launch the mobile app:
  ![Offline Splash](images/OfflineSplash.png)
- Tap **Download Offline Records**:
  ![Offline Download](images/OfflineDownload.png)
- Once primed, offline records are displayed in a list:
  ![View Records](images/OfflineRecords.png)
- To see the deployed component, tap an associated record:
  FIXME: Missing Image

## Call Apex Methods from Lightning Web Components

Apex methods can be called from Lightning web components. When developing for the Offline App, we highly encourage you to use base components and Lightning Data Service (LDS) via wire adapters for viewing or modifying data. Apex methods aren't available offline.

The Starter Kit provides an example of calling Apex from an LWC:

- `viewAccountsWithApex`: This component takes user input and calls the included `AccountController` Apex method for `getAccountList`. It can be accessed from an Account record quick action.
- The quick action is defined in `quickActions/Account.viewAccountsWithApex.quickAction-meta.xml`.
- This example uses additional utility components, `errorPanel` and `ldsUtils`, which are also included in the Starter Kit. They're useful, but not specific to offline features.

> **Note**
> End users must have access to the `AccountController` Apex class. If they don't, calls to the `getAccountList` Apex method will fail. See [How Does Apex Class Security Work?](https://help.salesforce.com/s/articleView?id=sf.code_package_security.htm&type=5) for more information.

The above components have been adapted from the [lwc-recipes repository](https://github.com/trailheadapps/lwc-recipes). For further information about calling Apex from LWCs, such as calling methods with complex parameters, see [Wire Apex Methods to Lightning Web Components](https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.apex_wire_method) in the _Lightning Web Components Developer Guide._

## Current Limitations

- The Offline App mobile build is required to view deployed components.

## Surveys Proof of Concept Sample Code

`force-app/main/default` contains a working demo of survey-taking, with some limitations.

1. `classes/`: An Apex class `SurveySource` contains cacheable functions to get raw survey
    definition records.
2. `lwc/`
   1. `survey` accepts a `surveyId` property. It `@wire`s the results from the cacheable
      `SurveySource` Apex functions, and puts that data into a survey hierarchy.
   2. `surveyPresenter` accepts a `survey` property with the hierarchy constructed in the `survey`
      LWC. This and all composed components do not require any `@wire`d data. It aggregates all
      responses from pages/questions. When the user taps 'Submit', it fires a `ResponseSubmitEvent`.
   3. `surveyPage` displays a single page of questions.
   4. `surveyQuestion` shows a single question on a page. It renders one of multiple type-specific
      question LWCs, for example `surveyTextResponse`. Each question LWC:
      1. Accepts a `question` property, defining the question posed to the user.
      2. Accepts a `response` property, which is the user's current response to that question,
         possibly undefined.
      3. Fires a `QuestionResponseChangeEvent` whenever the user's response to that question changes.
   5. `surveyRuntime`. While the LWCs above could be adopted as-is, this component is merely an
      example of how to compose the `survey` component and handle the `ResponseSubmitEvent`. In this
      example, an `OfflineSurveyResponse__c` record is created. `createRecord` is supported offline,
      so records will be synced when back online. This custom object simply saves the JSON of the
      survey responses. In a real implementation, a different custom object could be used with a
      diffrent structure. There could be triggers that process the responses on the server when such
      records are synced. Or the `ResponseSubmitEvent` could be handled in a completely different
      way consistent with your needs.
3. `objects/OfflineSurveyResponse` is the custom object that serves as one just example of how
   users' survey responses could be created whether offline or online, and synced to the org when
   there is connectivity.

### Limitations

This surveys proof of concept serves as a pattern for having some survey-taking capabilities in
the Offline App in the Summer '23 timeframe. Limitations include:

1. Field types. Only FreeText, ShortText, Picklist, Boolean, Rating, MultiChoice, and RadioButton
   are supported in these components.
2. Conditional logic for pages and questions is not supported at this time. If some questions do not
   apply basedon how a user answers a question, then question text has to be used to direct the user
   to manually skip those questions.
3. SurveyResponse and SurveyQuestionResponse objects are not yet compatible with Offline App, which
   is why the custom object is used in this sample code.
4. The Apex class `SurveySource` is the means that allows Offline App to be able to prefetch survey
   definitions for use whether offline or online. Each function must be annotated with
   `@AuraEnabled(cacheable=true)`. Despite this naming, it does allow the response to be
   cached for offline use by LWC. Note that the client will not attempt to re-fetch such survey data for at least 15
   minutes, even when online.

### Integration steps

The following are some recommended steps to integrate the sample code in this repo into your
specific solution.

1. Copy `lwc/survey*` components, as well as `loadingSpinner`, `paginator`, and `progressIndicator` to your project.
2. Most of these components are likely usable as-is, except for `surveyRuntime` which is only an
example of how to consume the top-level `survey` component and handle the `ResponseSubmitEvent`.
The `surveyId` can be dynamic in the LWC that composes the `survey`.
3. Like `quickActions/Account.survey.quickAction-meta.xml` you will need a LWC quick action to point
   to your component. It is recommended that this target component be devoted to survey-taking.
   However, another LWC could navigate to it using Lightning navigation and a page reference similar to:
   ```json
   {
     "type": "standard__quickAction",
     "attributes": {
       "actionName": "Account.survey"
     },
     "state": {
       "recordId": "xyz",
       "objectApiName": "Account"
     }
   }
   ```
4. Copy `classes/SurveSource/`. The `@AuraEnabled(cacheable=true)` functions are imported by the
   `survey` LWC. Note that these functions pull all records of each type in the org with a limit 100
   (which could be increased). Additional changes could allow more filtered fetching of records
   based on SurveyVersionId, by adding a parameter to many of these functions, in order to avoid hitting limits when an org has many surveys/versions/pages/questions/options.
5. Copy custom object `objects/OfflineSurveyResponse__c` or create your own and modify the
`ResponseSubmitEvent` handler to match. One recommended next step is to implement a trigger upon the
org receiving these new records that ingests the response data and loads it into its desired destination.