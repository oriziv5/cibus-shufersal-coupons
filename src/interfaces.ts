export interface ICoupon {
    price: number; 
    link: string;
    hash: string;
    expire: string;
    id: string;
    barcode: string;
    modified?:Date;
    date:string;
    time:string;
    used: boolean;
    brand: Brand;
}

export type Brand = "שופרסל" | "Be" | "ויקטורי";