<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use Illuminate\Support\Str;

use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Outillage électroportatif',
                'description' => 'Perceuses, visseuses, scies électriques, ponceuses...',
                'color' => '#3B82F6',
                'icon' => '🔌',
            ],
            [
                'name' => 'Petit outillage manuel',
                'description' => 'Marteaux, tournevis, clés, pinces...',
                'color' => '#10B981',
                'icon' => '🔧',
            ],
            [
                'name' => 'Gros outillage',
                'description' => 'Établis, compresseurs, nettoyeurs haute pression...',
                'color' => '#F59E0B',
                'icon' => '⚙️',
            ],
            [
                'name' => 'Équipement léger',
                'description' => 'Échelles, escabeaux, chariots légers...',
                'color' => '#8B5CF6',
                'icon' => '🪜',
            ],
            [
                'name' => 'Matériel intermédiaire',
                'description' => 'Bétonnières, échafaudages, diables...',
                'color' => '#EC4899',
                'icon' => '🏗️',
            ],
            [
                'name' => 'Petit matériel',
                'description' => 'Câbles, rallonges, petits accessoires...',
                'color' => '#06B6D4',
                'icon' => '🔗',
            ],
            [
                'name' => 'Équipement moyen',
                'description' => 'Nacelles, mini-excavateurs, engins légers...',
                'color' => '#84CC16',
                'icon' => '🚜',
            ],
            [
                'name' => 'Gros équipement',
                'description' => 'Pelleteuses, bulldozers, engins de chantier...',
                'color' => '#EF4444',
                'icon' => '🏗️',
            ],
            [
                'name' => 'Petit électroménager',
                'description' => 'Grille-pain, cafetières, mixeurs, robots...',
                'color' => '#A855F7',
                'icon' => '☕',
            ],
            [
                'name' => 'Cuisine & Réception Gros matériel',
                'description' => 'Fours professionnels, frigos, lave-vaisselle...',
                'color' => '#14B8A6',
                'icon' => '🍽️',
            ],
            [
                'name' => 'Multimédia Matériel standard',
                'description' => 'Enceintes, casques, webcams, microphones...',
                'color' => '#6366F1',
                'icon' => '🎧',
            ],
            [
                'name' => 'Multimédia Matériel pro',
                'description' => 'Caméras, stabilisateurs, éclairages professionnels...',
                'color' => '#F97316',
                'icon' => '🎥',
            ],
            [
                'name' => 'Multimédia Accessoires',
                'description' => 'Câbles HDMI, adaptateurs, supports...',
                'color' => '#64748B',
                'icon' => '🔌',
            ],
            [
                'name' => 'Transport Remorques',
                'description' => 'Remorques bagagères, porte-vélos, porte-motos...',
                'color' => '#0EA5E9',
                'icon' => '🚛',
            ],
            [
                'name' => 'Bébé & Enfant Équipement léger',
                'description' => 'Poussettes, sièges auto, chaises hautes...',
                'color' => '#FB923C',
                'icon' => '👶',
            ],
            [
                'name' => 'Bébé & Enfant Équipement complet',
                'description' => 'Lits bébé, parcs, baignoires, transats...',
                'color' => '#F472B6',
                'icon' => '🍼',
            ],
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'description' => $category['description'],
                'color' => $category['color'],
                'icon' => $category['icon'],
            ]);
        }
    }
}
