import { router, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';

import { Item } from '@/types/model';
import { Card, CardContent, CardFooter, CardHeader} from '../ui/card';
import { Edit, Eye, Heart, Trash, MessageCircle  } from 'lucide-react';
import { Button } from '../ui/button';

interface ItemCardProps {
    item: Item;              
    showActions?: boolean;
}
export default function ItemCard({ item, showActions = false }: ItemCardProps){

    const { auth } = usePage().props as any;
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [isFavorited, setIsFavorited] = useState(false);

    const handleDelete = (itemId: number) => {

        if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {

            setDeletingId(itemId);
            router.delete(`/items/${itemId}`, {
                onSuccess: () => {
                   
                    setDeletingId(null); 
                },
                onError: () => {
                    setDeletingId(null); 
                    alert("Une erreur est survenue lors de la suppression de l'article.")
                }
            })
        }
    };
    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        router.post(`/items/${item.id}/favorite`);  // ← Bon chemin !
        setIsFavorited(!isFavorited);
    };
      
    const handleLike = (itemId: number) => {
        router.post(
            '/like.toggle', 
           {
                model_type: 'App\\Models\\Item', 
                model_id: itemId, 
            }, 
            { 
                preserveScroll: true, 
                preserveState: true, 
            } 
        );
    };

    const canEditItem = (item: Item) => {
        return auth.user?.id === item.user_id;
    };

  return (
    <div>
      
    </div>
  )
}
