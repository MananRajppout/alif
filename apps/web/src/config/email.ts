type EmailTemplateType = {
  subject: string;
  message: string;
};

export const emailTemplates: Record<string, EmailTemplateType> = {
  COMPANY_PUBLISHED: {
    subject: "Company is published",
    message: "Congrats..!! Your company is published",
  },
  COMPANY_DRAFTED: {
    subject: "Your Company is in Draft",
    message: "Congrats..!! Your Company is in Draft",
  },
  COMPANY_APPROVED: {
    subject: "Your Company is Approved",
    message: "Congrats..!! Your Company is Approved",
  },
  COMPANY_REJECTED: {
    subject: "Your Company is Rejected",
    message: "Congrats..!! Your Company is Rejected",
  },
  COMPANY_EXPIRED: {
    subject: "Your Company is Expired",
    message: "Congrats..!! Your Company is Expired",
  },
  COMPANY_ACTIVATED: {
    subject: "Your Company is Activated",
    message: "Congrats..!! Your Company is Activated",
  },
  COMPANY_DELETED: {
    subject: "Your Company is Deleted",
    message: "Your Company is Deleted",
  },

  // ALl Resume Email Templates
  RESUME_PUBLISHED: {
    subject: "Your Resume is Live",
    message: "Congrats..!! Your Resume is published",
  },
  RESUME_DRAFTED: {
    subject: "Your Resume is in Draft",
    message: "Congrats..!! Your Resume is in Draft",
  },
  RESUME_APPROVED: {
    subject: "Your Resume is Approved",
    message: "Congrats..!! Your Resume is Approved",
  },
  RESUME_REJECTED: {
    subject: "Your Resume is Rejected",
    message: "Congrats..!! Your Resume is Rejected",
  },
  RESUME_EXPIRED: {
    subject: "Your Resume is Expired",
    message: "Congrats..!! Your Resume is Expired",
  },

  RESUME_ACTIVATED: {
    subject: "Your Resume is Activated",
    message: "Congrats..!! Your Resume is Activated",
  },
  RESUME_DELETED: {
    subject: "Your Resume is Deleted",
    message: "Your Resume is Deleted",
  },

  // All Jobs Email Templates
  JOB_PUBLISHED: {
    subject: "Your Job is Live",
    message: "Congrats..!! Your Job is published",
  },
  JOB_APPLIED: {
    subject: "Job is Applied",
    message: "Congrats..!! Your have applied a Job",
  },
  JOB_APPROVED: {
    subject: "Your Job is Approved",
    message: "Congrats..!! Your Job is Approved",
  },
  JOB_FEATURED: {
    subject: "Your Job is Featured",
    message: "Congrats..!! Your Job is Featured",
  },
  JOB_NON_FEATURED: {
    subject: "Your Job is Non Featured",
    message: "Congrats..!! Your Job is Non Featured",
  },
  JOB_REJECTED: {
    subject: "Your Job is Rejected",
    message: "Congrats..!! Your Job is Rejected",
  },
  JOB_EXPIRED: {
    subject: "Your Job is Expired",
    message: "Congrats..!! Your Job is Expired",
  },
  JOB_ACTIVATED: {
    subject: "Your Job is Activated",
    message: "Congrats..!! Your Job is Activated",
  },
  JOB_DELETED: {
    subject: "Your Job is Deleted",
    message: "Your Job is Deleted",
  },
  JOB_DRAFTED: {
    subject: "Your Job is in Draft",
    message: "Congrats..!! Your Job is in Draft",
  },

  CONFIRMATION_EMAIL: {
    subject: "Confirm your email",
    message: "Please click this link to confirm your email:",
  },
  RESET_PASSWORD: {
    subject: "Reset your password",
    message: "Please click this link to reset your password:",
  },

  // Add other email templates as needed
};
