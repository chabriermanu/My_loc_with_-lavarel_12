import type { User } from './auth';
import type { PageProps } from './page'; // ← Importe depuis page.ts

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
    type: 'object' | 'service';
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
    comments?: Comment[];
    reviews?: ItemReview[];
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
    likes_count: number;
    is_liked: boolean;
}

export interface LaravelPagination<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

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

export interface PostFormData {
    name: string;
    description: string;
    type: 'object' | 'service';
    category_id: string;
    condition?: string;
    media_type?: string;
    value?: string;
    picture: File | null;
    video: File | null;
}

export interface CreateProps extends PageProps {
    categories: Category[];
    conditions: string[];
    mediaTypes: string[];
}

export interface EditProps extends CreateProps {
    item: Item;
}

export interface ShowProps extends PageProps {
    item: Item;
    isFavorited: boolean;
    hasCompletedLoan: boolean;
    userReview: ItemReview | null;
}

export interface ItemReview {
    id: number;
    item_id: number;
    user_id: number;
    loan_id: number;
    rating: number;
    comment?: string;
    created_at: string;
    user: User;
}
