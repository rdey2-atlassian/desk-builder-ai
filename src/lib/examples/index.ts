export { loadExample } from "./loadExample";

export const EXAMPLES = {
  "hr-onboarding": "HR Onboarding (Basic)",
  "hr-onboarding-v1": "HR Onboarding Pack v1",
  "facilities-wo": "Facilities Work Order Pack",
} as const;

export type ExampleId = keyof typeof EXAMPLES;
