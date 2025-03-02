export interface IProduct {
    _id: string;
    title: string;
    tags?: string[];
    user: string;
    price: number;
    imageUrl?: string;
    description?: string;
}