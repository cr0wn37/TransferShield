export type AppLanguage = "en" | "hi";

export const languageLabels: Record<AppLanguage, string> = {
  en: "English",
  hi: "हिंदी",
};

export const translations = {
  en: {
    transferShield: "TransferShield",
    sharedWorkspace: "Shared workspace",
    progress: "Transfer progress",
    statutoryDeadline: "Statutory deadline",
    actionRequired: "Action required",
    tasks: "Tasks",
    documents: "Documents",
    payment: "Payment",
    finalReview: "Final review",
    timeline: "Timeline",

    inviteBuyer: "Invite buyer",
    joinTransfer: "Join transfer",
    confirmDetails: "Confirm details",
    makePayment: "Make payment",
    buyerDocuments: "Buyer documents & e-sign",
    sellerDocuments: "Seller documents & e-sign",
    reviewSubmission: "Review submission",
    submitToRto: "Submit to RTO",

    buyer: "Buyer",
    seller: "Seller",
    bothParties: "Both parties",
    rto: "RTO",

    waitingOn: "Waiting on",
    withinExpectedTime: "Within expected time",
    slaBreached: "SLA breached",
    actionDueSoon: "Action due soon",
    actionOverdue: "Action overdue",
    takeAction: "Take action",

    startVehicleOwnershipTransfer: "Start a Vehicle Ownership transfer",
howItWorks: "How it works",
imBuyingVehicle: "I’m buying a vehicle",
imSellingVehicle: "I’m selling a vehicle",

verifyYourVehicle: "Verify your vehicle",
verifyVehicleDescription:
  "Enter the vehicle details used to verify access to the registered vehicle before starting the ownership transfer.",

vehicleRegistrationNumber: "Vehicle registration number",
buyerDestination: "Buyer destination",
selectBuyerLocation: "Select buyer location",
verifyVehicle: "Verify vehicle",

verifyRegisteredMobile: "Verify registered mobile number",
otpSentMessage:
  "An OTP has been sent to the mobile number registered with this vehicle.",
registeredMobile: "Registered mobile",
enterOtp: "Enter OTP",
verifyVehicleAccess: "Verify vehicle access",

registeredVehicleAccessVerified: "Registered vehicle access verified",
registeredMobileVerificationSuccess:
  "The registered mobile verification was successful. These are mock vehicle details for the TransferShield prototype.",

joinVehicleTransfer: "Join a vehicle transfer",
sellerAlreadyStartedTransfer:
  "Your seller has already started the transfer. Enter the TransferShield code they shared with you to join the same transaction workspace.",

transferCode: "Transfer code",
transferCodeDescription:
  "The transfer code is provided by the seller after they create the live transfer session.",

  // Vehicle compliance / readiness
transferReadiness: "Transfer readiness",
yourTransferRoute: "Your transfer route",
transferRouteDescription:
  "We checked the basic transfer route and mock vehicle requirements before starting the application.",
transferRoute: "Transfer route",
additionalRequirementsDetected: "Additional requirements detected",
checksToComplete: "Checks to complete",
transferCannotStartYet: "Transfer cannot start yet",
continueToTransferShieldWorkspace:
  "You can continue to the TransferShield workspace.",
resolveBlockerBeforeStarting:
  "Resolve the blocker before starting the transfer.",
startTransfer: "Start transfer",

vehicleComplianceCheck: "Vehicle compliance check",
vehicleComplianceDescription:
  "Check for outstanding vehicle issues before starting the ownership transfer.",
vehicleRecord: "Vehicle record",
checkCompliance: "Check compliance",
vehicleComplianceCleared: "Vehicle compliance cleared",
noOutstandingComplianceBlockers:
  "No outstanding compliance blockers were detected. This vehicle is ready to proceed.",

actionRequiredBeforeTransfer: "Action required before transfer",
recheck: "Re-check",
resolutionSubmitted: "Resolution submitted",


challan: "Challan",
amount: "Amount",
responsibility: "Responsibility",

howToResolve: "How to resolve",
openEChallan: "Open e-Challan",
paymentSubmitted: "Payment submitted",

financier: "Financier",
loanReference: "Loan reference",

clearanceSubmitted: "Clearance submitted",
transferLocked: "Transfer locked",
resolveAllComplianceBlockers:
  "Resolve all compliance blockers before continuing.",
remaining: "remaining",

challanResolution1: "Review the outstanding challan.",
challanResolution2:
  "Pay it through the official e-Challan service.",
challanResolution3:
  "Wait for the payment status to update.",
challanResolution4:
  "Re-check vehicle compliance in TransferShield.",

financierResolution1:
  "Obtain the loan closure confirmation or financier NOC.",
financierResolution2:
  "Complete the hypothecation termination process.",
financierResolution3:
  "Submit the required supporting documents, including Form 35 where applicable.",
financierResolution4:
  "Re-check vehicle compliance in TransferShield.",

resolutionRecordedMessage:
  "The resolution has been recorded. Re-check the vehicle to verify the latest compliance status.",
    
  },

  hi: {
    transferShield: "TransferShield",
    sharedWorkspace: "साझा कार्यक्षेत्र",
    progress: "हस्तांतरण की प्रगति",
    statutoryDeadline: "कानूनी समय-सीमा",
    actionRequired: "कार्रवाई आवश्यक",
    tasks: "कार्य",
    documents: "दस्तावेज़",
    payment: "भुगतान",
    finalReview: "अंतिम समीक्षा",
    timeline: "समयरेखा",

    inviteBuyer: "खरीदार को आमंत्रित करें",
    joinTransfer: "हस्तांतरण में शामिल हों",
    confirmDetails: "विवरण की पुष्टि करें",
    makePayment: "भुगतान करें",
    buyerDocuments: "खरीदार के दस्तावेज़ और ई-साइन",
    sellerDocuments: "विक्रेता के दस्तावेज़ और ई-साइन",
    reviewSubmission: "आवेदन की समीक्षा करें",
    submitToRto: "RTO को आवेदन भेजें",

    buyer: "खरीदार",
    seller: "विक्रेता",
    bothParties: "दोनों पक्ष",
    rto: "RTO",

    waitingOn: "प्रतीक्षा:",
    withinExpectedTime: "निर्धारित समय के भीतर",
    slaBreached: "समय-सीमा पार हो गई",
    actionDueSoon: "कार्रवाई जल्द आवश्यक है",
    actionOverdue: "कार्रवाई लंबित है",
    takeAction: "कार्रवाई करें",

    startVehicleOwnershipTransfer: "वाहन स्वामित्व हस्तांतरण शुरू करें",
howItWorks: "यह कैसे काम करता है",
imBuyingVehicle: "मैं वाहन खरीद रहा हूँ",
imSellingVehicle: "मैं वाहन बेच रहा हूँ",

verifyYourVehicle: "अपने वाहन को सत्यापित करें",
verifyVehicleDescription:
  "स्वामित्व हस्तांतरण शुरू करने से पहले पंजीकृत वाहन तक पहुंच सत्यापित करने के लिए वाहन का विवरण दर्ज करें।",

vehicleRegistrationNumber: "वाहन पंजीकरण संख्या",
buyerDestination: "खरीदार का गंतव्य",
selectBuyerLocation: "खरीदार का स्थान चुनें",
verifyVehicle: "वाहन सत्यापित करें",

verifyRegisteredMobile: "पंजीकृत मोबाइल नंबर सत्यापित करें",
otpSentMessage:
  "इस वाहन के साथ पंजीकृत मोबाइल नंबर पर एक OTP भेजा गया है।",
registeredMobile: "पंजीकृत मोबाइल",
enterOtp: "OTP दर्ज करें",
verifyVehicleAccess: "वाहन तक पहुंच सत्यापित करें",

registeredVehicleAccessVerified: "पंजीकृत वाहन तक पहुंच सत्यापित है",
registeredMobileVerificationSuccess:
  "पंजीकृत मोबाइल सत्यापन सफल रहा। ये TransferShield प्रोटोटाइप के लिए नकली वाहन विवरण हैं।",

joinVehicleTransfer: "वाहन हस्तांतरण में शामिल हों",
sellerAlreadyStartedTransfer:
  "आपके विक्रेता ने पहले ही हस्तांतरण शुरू कर दिया है। उसी लेन-देन कार्यक्षेत्र में शामिल होने के लिए उनके द्वारा साझा किया गया TransferShield कोड दर्ज करें।",

transferCode: "हस्तांतरण कोड",
transferCodeDescription:
  "हस्तांतरण कोड विक्रेता द्वारा लाइव हस्तांतरण सत्र बनाने के बाद प्रदान किया जाता है।",

  transferReadiness: "हस्तांतरण की तैयारी",
yourTransferRoute: "आपका हस्तांतरण मार्ग",
transferRouteDescription:
  "आवेदन शुरू करने से पहले हमने मूल हस्तांतरण प्रक्रिया और वाहन से संबंधित आवश्यकताओं की जाँच की।",
transferRoute: "हस्तांतरण मार्ग",
additionalRequirementsDetected: "अतिरिक्त आवश्यकताएँ मिलीं",
checksToComplete: "पूरी की जाने वाली जाँच",
transferCannotStartYet: "हस्तांतरण अभी शुरू नहीं किया जा सकता",
continueToTransferShieldWorkspace:
  "आप TransferShield कार्यक्षेत्र में आगे बढ़ सकते हैं।",
resolveBlockerBeforeStarting:
  "हस्तांतरण शुरू करने से पहले इस समस्या का समाधान करें।",
startTransfer: "हस्तांतरण शुरू करें",

vehicleComplianceCheck: "वाहन अनुपालन जाँच",
vehicleComplianceDescription:
  "स्वामित्व हस्तांतरण शुरू करने से पहले वाहन से जुड़ी लंबित समस्याओं की जाँच करें।",
vehicleRecord: "वाहन रिकॉर्ड",
checkCompliance: "अनुपालन जाँचें",
vehicleComplianceCleared: "वाहन अनुपालन स्पष्ट है",
noOutstandingComplianceBlockers:
  "कोई लंबित अनुपालन समस्या नहीं मिली। यह वाहन आगे बढ़ने के लिए तैयार है।",

actionRequiredBeforeTransfer: "हस्तांतरण से पहले कार्रवाई आवश्यक",
recheck: "दोबारा जाँचें",
resolutionSubmitted: "समाधान जमा किया गया",


challan: "चालान",
amount: "राशि",
responsibility: "जिम्मेदारी",

howToResolve: "समाधान कैसे करें",
openEChallan: "ई-चालान खोलें",
paymentSubmitted: "भुगतान जमा किया गया",

financier: "वित्तदाता",
loanReference: "ऋण संदर्भ",

clearanceSubmitted: "क्लीयरेंस जमा किया गया",
transferLocked: "हस्तांतरण लॉक है",
resolveAllComplianceBlockers:
  "आगे बढ़ने से पहले सभी अनुपालन समस्याओं का समाधान करें।",
remaining: "शेष",

challanResolution1: "लंबित चालान की समीक्षा करें।",
challanResolution2:
  "आधिकारिक ई-चालान सेवा के माध्यम से इसका भुगतान करें।",
challanResolution3:
  "भुगतान की स्थिति अपडेट होने की प्रतीक्षा करें।",
challanResolution4:
  "TransferShield में वाहन अनुपालन की दोबारा जाँच करें।",

financierResolution1:
  "ऋण बंद होने की पुष्टि या वित्तदाता से NOC प्राप्त करें।",
financierResolution2:
  "हाइपोथिकेशन समाप्त करने की प्रक्रिया पूरी करें।",
financierResolution3:
  "जहाँ लागू हो, Form 35 सहित आवश्यक सहायक दस्तावेज़ जमा करें।",
financierResolution4:
  "TransferShield में वाहन अनुपालन की दोबारा जाँच करें।",

resolutionRecordedMessage:
  "समाधान दर्ज कर लिया गया है। नवीनतम अनुपालन स्थिति सत्यापित करने के लिए वाहन की दोबारा जाँच करें।",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function t(
  language: AppLanguage,
  key: TranslationKey,
): string {
  return translations[language][key];
}