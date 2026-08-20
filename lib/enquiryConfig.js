// Server-side fallback until an administrator saves the official inbox.
export const defaultEnquiryRecipient =
  process.env.ENQUIRY_RECEIVER_EMAIL || "antony.s8637@gmail.com";
