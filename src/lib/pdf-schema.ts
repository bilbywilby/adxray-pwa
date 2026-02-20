import { z } from 'zod';
export const InsuranceClaimSchema = z.object({
  policyNumber: z.string().describe("The unique identifier for the insurance policy"),
  applicantName: z.string().describe("Full name of the person or entity claiming"),
  claimDate: z.string().describe("The date the claim was filed or loss occurred"),
  lossDescription: z.string().describe("A concise summary of what happened"),
  estimatedValue: z.string().describe("The monetary amount requested or estimated"),
  metadata: z.object({
    anomalies: z.array(z.string()).describe("Any inconsistencies or red flags found in the text"),
    reliabilityScore: z.number().describe("0-100 score of document authenticity"),
    toneDetected: z.string().describe("Emotional sentiment detected in loss description")
  }).optional()
});
export const validationRules = "Document must contain identifiable policy numbers and coherent narratives to pass X-RAY verification.";
export const getExtractionPrompt = () => {
  return `EXTRACT THE FOLLOWING FIELDS INTO A JSON OBJECT FROM THE DOCUMENT TEXT PROVIDED. 
  REQUIRED FIELDS:
  - policyNumber: ID found in headers/tables.
  - applicantName: Primary individual or entity.
  - claimDate: ISO or text date of filing/loss.
  - lossDescription: Summarize the event with a cynical detective tone.
  - estimatedValue: Currency amount.
  - metadata: A sub-object containing:
    - anomalies: Array of strings identifying "Red Flags" or strange phrasing.
    - reliabilityScore: Number 0-100.
    - toneDetected: Short description of the writer's emotional state.
  IF A FIELD IS MISSING, RETURN "NOT_DETECTED".
  TONE: Harsh, analytical, field-manual expert. No pleasantries.`;
};