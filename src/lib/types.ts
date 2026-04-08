export interface Chapter {
  slug: string;
  number: number;
  title: string;
  subtitle?: string;
  component: string;
  content: string;
}

export interface BookMeta {
  title: string;
  author: string;
  blurb: string;
  chapterOrder: string[];
}
