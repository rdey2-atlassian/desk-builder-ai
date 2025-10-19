// Adapter configuration requirements by vendor
export const ADAPTER_REQUIRED_KEYS: Record<string, string[]> = {
  okta: ["baseUrl", "token"],
  workday: ["tenant", "username", "password"],
  intune: ["tenantId", "clientId", "clientSecret"],
  docusign: ["accountId", "apiKey"],
  custom: [],
};

export function getRequiredKeysForVendor(vendor: string): string[] {
  return ADAPTER_REQUIRED_KEYS[vendor] || [];
}

export function validateAdapterConfig(vendor: string, config: Record<string, string>): string[] {
  const requiredKeys = getRequiredKeysForVendor(vendor);
  const missingKeys: string[] = [];
  
  for (const key of requiredKeys) {
    if (!config[key] || config[key].trim() === "") {
      missingKeys.push(key);
    }
  }
  
  return missingKeys;
}
