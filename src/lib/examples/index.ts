export { loadExample } from "./loadExample";

export const EXAMPLES = {
  "hr-onboarding": "HR Onboarding",
} as const;

export type ExampleId = keyof typeof EXAMPLES;
