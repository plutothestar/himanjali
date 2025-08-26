export interface Blog {
   _id?: string;
  contentType: string;
  title: string;
  author: string;
  publication_date: string;
  banner_image_url: string;
  content: string;
  tags: string[] | string; // Allow tags to be either an array of strings or a comma-separated string
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogMeta {
    title: string;
    url: string;
    date: string;
    author: string;
    image: string;
    comments: string;
}