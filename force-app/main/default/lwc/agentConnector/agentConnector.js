/* eslint-disable @salesforce/lwc-graph-analyzer/no-unresolved-parent-class-reference */
import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { getBarcodeScanner } from "lightning/mobileCapabilities";

export default class ViewAccountRecord extends NavigationMixin(
  LightningElement
) {
  scanner;

  @api recordId;
  @api objectApiName;

  alreadyOnLanding = false;

  connectedCallback() {
    this.scanner = getBarcodeScanner();
    if (this.scanner == null || !this.scanner.isAvailable()) {
      console.warn("Scanner not initialized!");
    }
  }

  disconnectedCallback() {
    console.log("disconnected", this.ws);
    this.ws && this.ws.close();
    this.ws = null;
  }

  simConnect() {
    this.connect();
  }

  connect(wsURL) {
    const ws = new WebSocket(
      wsURL ||
        "wss://4f15-2601-1c2-4c00-2ef-248e-63d-71b9-f09c.ngrok-free.app/websocket"
    );
    ws.addEventListener("message", (e) => {
      const data = JSON.parse(e.data);
      switch (data.type) {
        case "landing-uem":
          this.navigateToLandingUEM(data.uem, this.alreadyOnLanding);
          this.alreadyOnLanding = true;
          break;
      }
    });
    this.ws = ws;
  }

  scan() {
    // this.navigateScanned(null, true);
    // setInterval(() => this.navigateScanned(null, true), 5000);
    // return;
    if (this.scanner && this.scanner.isAvailable()) {
      console.log("starting scan...");
      const scanningOptions = {
        barcodeTypes: [
          this.scanner.barcodeTypes.EAN_8,
          this.scanner.barcodeTypes.EAN_13,
          this.scanner.barcodeTypes.UPC_A,
          this.scanner.barcodeTypes.UPC_E,
          this.scanner.barcodeTypes.QR,
        ],
        instructionText: "Scan a barcode",
        successText: "Scanning complete.",
        scannerSize: "XLARGE", // defines the scanner camera view size (e.g SMALL, MEDIUM, LARGE, XLARGE, FULLSCREEN)
        cameraFacing: "BACK", // defines which device camera to use (e.g FRONT, BACK)
        showSuccessCheckMark: true, // visually show a check mark in the scanner native UI after successfully scanning a barcode
        vibrateOnSuccess: true, // vibrate the device after successfully scanning a barcode
        manualConfirmation: false, // set to TRUE in order to wait for the user to manually confirm the selected barcode
        previewBarcodeData: true, // preview the barcode data in the scanner native UI
      };
      this.scanner
        .beginCapture(scanningOptions)
        .then((result) => {
          console.log("successfully scanned", result);
          this.errorMessage = null;
          const scanned = result.value;
          this.connect(scanned);
          // this.navigateScanned(scanned);
        })
        .catch((error) => {
          if (error.code === "USER_DISMISSED") {
            // user closed the scanner - don't consider it as an error case
            this.errorMessage = null;
          } else if (
            error.code === "USER_DENIED_PERMISSION" ||
            error.code === "USER_DISABLED_PERMISSION"
          ) {
            // show a custom message with instructions on how to resolve the issue
            this.errorMessage =
              "Unable to access the device camera. Enable camera access in the Settings app.";
          } else {
            this.errorMessage = error.message;
          }
          console.error("scan error", error);
          console.error(this.errorMessage);
        })
        .finally(() => {
          console.log("scan complete");

          // Clean up by ending capture,
          // whether we completed successfully or had an error
          this.scanner.endCapture();
        });
    } else {
      console.log("Scanner not initialized!");
      this.errorMessage = "Scanner not initialized!";
    }
  }

  navigateToLandingUEM(uem, replace) {
    this[NavigationMixin.Navigate](
      {
        type: "native__mobileHomeBuilder",
        attributes: {
          id: "00DRO000000AfSB",
          source: "dynamic",
        },
        state: {
          UEM: JSON.stringify(uem),
        },
      },
      replace
    );
  }
  navigateScanned(scanned, replace) {
    this[NavigationMixin.Navigate](
      {
        type: "native__mobileHomeBuilder",
        attributes: {
          id: "00DRO000000AfSB",
          source: "dynamic",
        },
        state: {
          UEM: JSON.stringify(randUEM()),
        },
      },
      replace
    );
  }
}

// function randUEM() {
//   uem.view.regions.components.components[0].regions.components.components[0].properties.label = `${Math.random()}`;
//   return uem;
// }

// const uem = {
//   view: {
//     definition: "generated/landing_page",
//     properties: {},
//     regions: {
//       components: {
//         name: "components",
//         components: [
//           {
//             definition: "mcf/container",
//             properties: {
//               backgroundColor: "#F3F2f2",
//             },
//             dataProviders: {},
//             regions: {
//               components: {
//                 components: [
//                   {
//                     definition: "mcf/card",
//                     properties: {
//                       label: "Recently Viewed Contacts",
//                       titleColor: "#EB7092",
//                     },
//                     regions: {
//                       components: {
//                         components: [
//                           {
//                             definition: "mcf/list",
//                             properties: {
//                               label: "Recently Viewed Contacts",
//                               size: 5,
//                               objectApiName: "Contact",
//                               swipeActions: {
//                                 call: [
//                                   {
//                                     label: "Mobile",
//                                     value: "MobilePhone",
//                                   },
//                                 ],
//                                 email: [
//                                   {
//                                     label: "Email",
//                                     value: "Email",
//                                   },
//                                 ],
//                               },
//                               fieldMap: {
//                                 mainField: "Name",
//                                 subField1: "MobilePhone",
//                               },
//                               fields: {
//                                 Name: "StringValue",
//                                 MobilePhone: "StringValue",
//                                 Email: "StringValue",
//                               },
//                               orderBy: [
//                                 {
//                                   LastViewedDate: "DESC",
//                                 },
//                               ],
//                             },
//                             regions: {
//                               components: {
//                                 name: "components",
//                                 components: [
//                                   {
//                                     definition: "mcf/recordRow",
//                                     properties: {},
//                                     regions: {},
//                                   },
//                                 ],
//                               },
//                             },
//                           },
//                         ],
//                       },
//                     },
//                   },
//                   {
//                     definition: "mcf/card",
//                     properties: {
//                       label: "Accounts",
//                       titleColor: "#EB7092",
//                     },
//                     regions: {
//                       components: {
//                         components: [
//                           {
//                             definition: "mcf/list",
//                             properties: {
//                               label: "Accounts",
//                               size: 5,
//                               objectApiName: "Account",
//                               fieldMap: {
//                                 mainField: "Name",
//                                 subField1: "Industry",
//                                 subField2: "Id",
//                               },
//                               fields: {
//                                 Name: "StringValue",
//                                 Industry: "StringValue",
//                                 Id: "String",
//                               },
//                               orderBy: [
//                                 {
//                                   Name: "ASC",
//                                 },
//                               ],
//                             },
//                             regions: {
//                               components: {
//                                 components: [
//                                   {
//                                     definition: "mcf/recordRow",
//                                     properties: {
//                                       displayIcon: false,
//                                     },
//                                     regions: {},
//                                   },
//                                 ],
//                               },
//                             },
//                           },
//                         ],
//                       },
//                     },
//                   },
//                   {
//                     definition: "mcf/card",
//                     properties: {
//                       label: "Upcoming Opportunities",
//                       titleColor: "#EB7092",
//                     },
//                     regions: {
//                       components: {
//                         components: [
//                           {
//                             definition: "mcf/list",
//                             properties: {
//                               label: "Upcoming Opportunities",
//                               size: 3,
//                               objectApiName: "Opportunity",
//                               fieldMap: {
//                                 mainField: "Name",
//                               },
//                               fields: {
//                                 Name: "StringValue",
//                               },
//                               orderBy: [
//                                 {
//                                   CloseDate: "ASC",
//                                 },
//                               ],
//                             },
//                             regions: {
//                               components: {
//                                 components: [
//                                   {
//                                     definition: "mcf/recordRow",
//                                     properties: {
//                                       displayIcon: false,
//                                     },
//                                     regions: {},
//                                   },
//                                 ],
//                               },
//                             },
//                           },
//                         ],
//                       },
//                     },
//                   },
//                 ],
//               },
//             },
//           },
//         ],
//       },
//     },
//   },
//   target: "mcf__native",
//   apiName: "landing_page",
//   id: "8592e04f-f59b-4a19-9b1f-af7d55f2b491",
// };
