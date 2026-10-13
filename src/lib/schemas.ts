import { z } from "zod";

export const enquiryTypes = ["General enquiry", "Apply for cover", "Claims", "Broker enquiry"] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.email("Please enter a valid email address").max(200),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  company: z.string().trim().max(150).optional().or(z.literal("")),
  enquiryType: z.enum(enquiryTypes),
  product: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Please tell us a little more").max(5000),
  // Honeypot: real visitors never see or fill this field.
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
