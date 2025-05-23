export const privacyFocusedSettings = {
  dataRetention: {
    participantData: 90, // days
    activityLogs: 30, // days
    analyticsData: 365, // days
  },
  encryption: {
    enabled: true,
    algorithm: "AES-256",
    keyRotation: 30, // days
  },
  anonymization: {
    enabled: true,
    participantIds: true,
    ipAddresses: true,
    userAgents: false,
  },
  compliance: {
    gdpr: true,
    ccpa: true,
    hipaa: false,
  },
  sharing: {
    analytics: false,
    thirdParty: false,
    marketing: false,
  },
  cookies: {
    essential: true,
    analytics: false,
    marketing: false,
    preferences: true,
  },
  notifications: {
    dataProcessing: true,
    securityUpdates: true,
    policyChanges: true,
  },
}

export type PrivacyFocusedSettings = typeof privacyFocusedSettings
