export interface Recipe {
    _id: string;
    title: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    imageUrl?: string;
    creator: {
        _id: string;
        email: string;
        username: string;
        recipes: string[];
    };
    likes: string[];
    createdAt: string;
    updatedAt: string;
}