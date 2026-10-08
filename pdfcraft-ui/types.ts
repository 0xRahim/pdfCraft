export type TemplateStatus = "active" | "draft" | "archived";

export interface Template {
  id: string;
  title: string;
  description?: string;
  variables: string[];
  status: TemplateStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateWithHtml extends Template {
  html: string;
}
