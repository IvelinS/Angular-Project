export interface Comment {
  _id: string;
  content: string;
  creator: {
    _id: string;
    username: string;
  };
  recipe: string;
  createdAt: Date;
}
