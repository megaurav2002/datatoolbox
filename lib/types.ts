export type ToolKind = "standard" | "ai";
export type ToolCategorySlug =
  | "csv-tools"
  | "json-tools"
  | "text-tools"
  | "developer-tools"
  | "spreadsheet-tools";

export type ToolDefinition = {
  slug: string;
  title: string;
  shortDescription: string;
  tags: string[];
  intro: string;
  howToUse: string[];
  exampleInput: string;
  exampleOutput: string;
  whyUseful: string;
  commonMistakes?: string[];
  faq: Array<{ question: string; answer: string }>;
  related: string[];
  kind: ToolKind;
  categories: ToolCategorySlug[];
  createdAt: string;
  outputFileName?: string;
  outputMimeType?: string;
};

export type TransformResult = {
  output: string;
  downloadFileName?: string;
  downloadMimeType?: string;
};
