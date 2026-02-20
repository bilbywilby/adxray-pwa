import { z } from 'zod';
export const InsuranceClaimSchema = z.object({
  policyNumber: z.string().describe("The unique identifier for the insurance policy"),
  applicantName: z.string().describe("Full name of the person or entity claiming"),
  claimDate: z.string().describe("The date the claim was filed or loss occurred"),
  lossDescription: z.string().describe("A concise summary of what happened"),
  estimatedValue: z.string().describe("The monetary amount requested or estimated"),
  metadata: z.record(z.string(), z.any()).optional().describe("Any additional key-value pairs of interest")
});
export type InsuranceClaim = z.infer<typeof InsuranceClaimSchema>;
export const getExtractionPrompt = () => {
  return `EXTRACT THE FOLLOWING FIELDS INTO A JSON OBJECT FROM THE DOCUMENT TEXT PROVIDED:
  - policyNumber (string)
  - applicantName (string)
  - claimDate (string)
  - lossDescription (string)
  - estimatedValue (string)
  - metadata (object for extra info)
  USE A CYNICAL, ANALYTICAL TONE IN DESCRIPTIONS.`;
};