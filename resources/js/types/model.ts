export interface User {
    id: number;
    name: string;
    email: string;
    first_name?: string;
    last_name?: string;
    avatar?: string;
    phone?: string;
    bio?: string;
    rating?: number;
    total_ratings?: number;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    points?: number;
    color?: string;
    items_count?: number;
}

export interface Item {
    id: number;
    name: string;
    slug: string;
    description: string;
    picture?: string;
    video?: string;
    media_type: 'image' | 'video' | 'both';
    user_id: number;
    category_id: number;
    condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
    value?: number;
    is_available: boolean;
    rating?: number;
    total_ratings?: number;
    views_count: number;
    favorites_count: number;
    category: Category;
    owner: User;
    created_at: string;
    likes_count: number;
    comments_count: number;
    is_liked: boolean;
    is_favorited: boolean;
}

export interface Loan {
    id: number;
    item_id: number;
    owner_id: number;
    borrower_id: number;
    start_date: string;
    end_date: string;
    status:
        | 'pending'
        | 'approved'
        | 'in_progress'
        | 'completed'
        | 'cancelled'
        | 'overdue';
    returned_at?: string;
    notes?: string;
    item: Item;
    owner: User;
    borrower: User;
}

export interface Comment {
    id: number;
    item_id: number;
    user_id: number;
    parent_id?: number;
    content: string;
    created_at: string;
    user: User;
    replies?: Comment[];
}

// Type pour Laravel paginate() - format simple
export interface LaravelPagination<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

// Type pour Inertia paginator - format avec meta et links
export type PaginatedData<T> = {
    data: T[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
    };
};
