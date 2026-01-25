<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    /** @use HasFactory<\Database\Factories\CategoryFactory> */
    use HasFactory;

    //  * Les champs qu'on peut remplir en masse / Liste des colonnes qu'on peut remplir 

    protected $fillable = [

        'name',
        'slug',
        'description',
        'icon',
        'points',
        'color'


    ];

    // Conversion automatique des type / Convertit automatiquement points en entier (au lieu de string)

    protected $casts = [

        'points' => 'integer',

    ];

    // Une catégorie a plusieurs items

    public function items(): HasMany
    {
        return $this->hasMany(Item::class);
    }
}
