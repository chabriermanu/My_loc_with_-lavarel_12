<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            // ==========================================
            // 🏠 MAISON & BRICOLAGE - OBJETS
            // ==========================================
            [
                'name' => 'Outillage électroportatif',
                'icon' => '🔌',
                'description' => 'Perceuses, visseuses, meuleuses, scies électriques, ponceuses, décapeurs thermiques'
            ],
            [
                'name' => 'Outillage manuel',
                'icon' => '🔨',
                'description' => 'Marteaux, tournevis, clés, pinces, niveau à bulle, mètres, scies manuelles'
            ],
            [
                'name' => 'Échelles et échafaudages',
                'icon' => '🪜',
                'description' => 'Échelles simples, télescopiques, transformables, échafaudages roulants'
            ],
            [
                'name' => 'Matériel de peinture',
                'icon' => '🖌️',
                'description' => 'Pistolets à peinture, rouleaux, bâches, escabeaux, pinceaux professionnels'
            ],
            [
                'name' => 'Nettoyeurs haute pression',
                'icon' => '💦',
                'description' => 'Karcher, nettoyeurs thermiques et électriques, accessoires de nettoyage'
            ],
            [
                'name' => 'Aspirateurs professionnels',
                'icon' => '🌪️',
                'description' => 'Aspirateurs eau et poussière, aspirateurs de chantier'
            ],

            // ==========================================
            // 🌳 JARDIN & EXTÉRIEUR - OBJETS
            // ==========================================
            [
                'name' => 'Tondeuses',
                'icon' => '🚜',
                'description' => 'Tondeuses thermiques, électriques, autoportées, robots tondeuses'
            ],
            [
                'name' => 'Taille-haies et débroussailleuses',
                'icon' => '✂️',
                'description' => 'Taille-haies électriques et thermiques, débroussailleuses, coupe-bordures'
            ],
            [
                'name' => 'Tronçonneuses et élagueuses',
                'icon' => '🪚',
                'description' => 'Tronçonneuses thermiques et électriques, élagueuses sur perche'
            ],
            [
                'name' => 'Souffleurs et broyeurs',
                'icon' => '🍂',
                'description' => 'Souffleurs de feuilles, aspirateurs-souffleurs, broyeurs de végétaux'
            ],
            [
                'name' => 'Motoculteurs et scarificateurs',
                'icon' => '🚜',
                'description' => 'Motoculteurs, motobineuses, scarificateurs électriques et thermiques'
            ],
            [
                'name' => 'Outils de jardinage',
                'icon' => '🧑‍🌾',
                'description' => 'Bêches, râteaux, pelles, sécateurs, cisailles, arrosoirs'
            ],
            [
                'name' => 'Mobilier de jardin',
                'icon' => '🪑',
                'description' => 'Tables, chaises, parasols, salons de jardin, transats, hamacs'
            ],
            [
                'name' => 'Barbecues et planchas',
                'icon' => '🍖',
                'description' => 'Barbecues au charbon, gaz, électriques, planchas, accessoires'
            ],

            // ==========================================
            // 🚗 TRANSPORT & AUTOMOBILE - OBJETS
            // ==========================================
            [
                'name' => 'Remorques',
                'icon' => '🚛',
                'description' => 'Remorques bagagères, plateau, benne basculante, porte-voiture'
            ],
            [
                'name' => 'Porte-vélos et coffres de toit',
                'icon' => '🚴',
                'description' => 'Porte-vélos sur attelage, coffres de toit, barres de toit, porte-skis'
            ],
            [
                'name' => 'Vélos et trottinettes',
                'icon' => '🚲',
                'description' => 'Vélos électriques, VTT, vélos de ville, trottinettes électriques'
            ],
            [
                'name' => 'Équipement auto',
                'icon' => '🔧',
                'description' => 'Crics, chandelles, compresseurs, chargeurs de batterie, valises de diagnostic'
            ],

            // ==========================================
            // 🎉 ÉVÉNEMENTIEL - OBJETS
            // ==========================================
            [
                'name' => 'Sono et matériel audio',
                'icon' => '🔊',
                'description' => 'Enceintes amplifiées, micros, tables de mixage, éclairages DJ'
            ],
            [
                'name' => 'Tentes et barnums',
                'icon' => '⛺',
                'description' => 'Tentes de réception, barnums pliants, chapiteaux, structures gonflables'
            ],
            [
                'name' => 'Tables et chaises',
                'icon' => '🪑',
                'description' => 'Tables pliantes, chaises, mange-debout, nappes, housses de chaises'
            ],
            [
                'name' => 'Vaisselle et verrerie',
                'icon' => '🍽️',
                'description' => 'Assiettes, couverts, verres, plateaux de service, fontaines à boisson'
            ],
            [
                'name' => 'Décoration événementielle',
                'icon' => '🎈',
                'description' => 'Guirlandes lumineuses, arches florales, photobooth, panneaux déco'
            ],
            [
                'name' => 'Jeux et animations',
                'icon' => '🎪',
                'description' => 'Structures gonflables, jeux en bois géants, baby-foot, ping-pong'
            ],

            // ==========================================
            // 🎮 LOISIRS & SPORT - OBJETS
            // ==========================================
            [
                'name' => 'Matériel camping',
                'icon' => '🏕️',
                'description' => 'Tentes, sacs de couchage, réchauds, glacières, mobilier camping'
            ],
            [
                'name' => 'Sports nautiques',
                'icon' => '🏄',
                'description' => 'Paddle, kayak, bouées tractées, combinaisons, gilets de sauvetage'
            ],
            [
                'name' => 'Sports d\'hiver',
                'icon' => '⛷️',
                'description' => 'Skis, snowboards, luges, raquettes, casques, protections'
            ],
            [
                'name' => 'Équipement fitness',
                'icon' => '💪',
                'description' => 'Vélos d\'appartement, rameurs, tapis de course, poids, tapis de yoga'
            ],
            [
                'name' => 'Consoles et jeux vidéo',
                'icon' => '🎮',
                'description' => 'PlayStation, Xbox, Nintendo Switch, jeux, accessoires gaming'
            ],

            // ==========================================
            // 📸 MULTIMÉDIA - OBJETS
            // ==========================================
            [
                'name' => 'Matériel photo/vidéo',
                'icon' => '📸',
                'description' => 'Appareils photo, caméras, objectifs, trépieds, stabilisateurs, drones'
            ],
            [
                'name' => 'Projecteurs et écrans',
                'icon' => '📽️',
                'description' => 'Vidéoprojecteurs, écrans de projection, home cinéma, enceintes'
            ],
            [
                'name' => 'Matériel informatique',
                'icon' => '💻',
                'description' => 'Ordinateurs portables, tablettes, écrans, disques durs externes'
            ],

            // ==========================================
            // 👶 ENFANTS & BÉBÉS - OBJETS
            // ==========================================
            [
                'name' => 'Puériculture',
                'icon' => '👶',
                'description' => 'Poussettes, sièges auto, chaises hautes, lits parapluie, parcs bébé'
            ],
            [
                'name' => 'Jeux et jouets',
                'icon' => '🧸',
                'description' => 'Jouets d\'éveil, porteurs, draisiennes, jeux de société, peluches'
            ],

            // ==========================================
            // 🏗️ GROS MATÉRIEL - OBJETS
            // ==========================================
            [
                'name' => 'Engins de chantier',
                'icon' => '🚧',
                'description' => 'Mini-pelles, tractopelles, compacteurs, bétonneuses, élévateurs'
            ],
            [
                'name' => 'Groupes électrogènes',
                'icon' => '⚡',
                'description' => 'Générateurs électriques, onduleurs, groupes électrogènes de chantier'
            ],
            [
                'name' => 'Nettoyage industriel',
                'icon' => '🧹',
                'description' => 'Autolaveuses, monobrosse, injecteur-extracteur, aspirateurs industriels'
            ],

            // ==========================================
            // 🛠️ SERVICES MAISON & BRICOLAGE
            // ==========================================
            [
                'name' => 'Petits travaux de bricolage',
                'icon' => '🛠️',
                'description' => 'Montage de meubles, fixations murales, petites réparations, pose d\'étagères'
            ],
            [
                'name' => 'Peinture et décoration',
                'icon' => '🎨',
                'description' => 'Peinture intérieure/extérieure, pose de papier peint, rénovation sols'
            ],
            [
                'name' => 'Plomberie',
                'icon' => '🚰',
                'description' => 'Dépannage plomberie, installation sanitaires, détection fuites'
            ],
            [
                'name' => 'Électricité',
                'icon' => '💡',
                'description' => 'Installation prises, luminaires, petits dépannages électriques'
            ],
            [
                'name' => 'Menuiserie',
                'icon' => '🪵',
                'description' => 'Pose de portes, fenêtres, aménagement placard, fabrication sur mesure'
            ],

            // ==========================================
            // 🌿 SERVICES JARDIN & EXTÉRIEUR
            // ==========================================
            [
                'name' => 'Tonte et entretien pelouse',
                'icon' => '🌱',
                'description' => 'Tonte régulière, scarification, aération, fertilisation de gazon'
            ],
            [
                'name' => 'Taille de haies et arbustes',
                'icon' => '🌳',
                'description' => 'Taille de haies, arbustes, rosiers, topiaires, évacuation déchets verts'
            ],
            [
                'name' => 'Élagage et abattage',
                'icon' => '🪓',
                'description' => 'Élagage d\'arbres, abattage, dessouchage, évacuation bois'
            ],
            [
                'name' => 'Débroussaillage',
                'icon' => '🌾',
                'description' => 'Débroussaillage terrains, nettoyage espaces verts, évacuation végétaux'
            ],
            [
                'name' => 'Aménagement paysager',
                'icon' => '🏡',
                'description' => 'Création massifs, plantation, engazonnement, terrasses, allées'
            ],
            [
                'name' => 'Potager et jardinage',
                'icon' => '🥕',
                'description' => 'Création potager, entretien cultures, conseils jardinage bio'
            ],

            // ==========================================
            // 💻 SERVICES NUMÉRIQUES
            // ==========================================
            [
                'name' => 'Développement web',
                'icon' => '💻',
                'description' => 'Sites vitrines, e-commerce, applications web, React, Laravel, WordPress'
            ],
            [
                'name' => 'Développement mobile',
                'icon' => '📱',
                'description' => 'Applications iOS/Android, React Native, Flutter, maintenance apps'
            ],
            [
                'name' => 'Design graphique',
                'icon' => '🎨',
                'description' => 'Logos, identité visuelle, flyers, affiches, supports print/web'
            ],
            [
                'name' => 'Design UI/UX',
                'icon' => '🖼️',
                'description' => 'Maquettes web/mobile, wireframes, prototypes, tests utilisateurs'
            ],
            [
                'name' => 'Référencement SEO',
                'icon' => '🔍',
                'description' => 'Optimisation SEO, audit site, stratégie contenu, netlinking'
            ],
            [
                'name' => 'Marketing digital',
                'icon' => '📊',
                'description' => 'Community management, publicité Facebook/Google Ads, newsletters'
            ],
            [
                'name' => 'Rédaction web',
                'icon' => '✍️',
                'description' => 'Articles de blog, fiches produits, pages web, contenu SEO'
            ],
            [
                'name' => 'Photographie professionnelle',
                'icon' => '📷',
                'description' => 'Photos produits, portraits, événements, reportages, retouches'
            ],
            [
                'name' => 'Montage vidéo',
                'icon' => '🎬',
                'description' => 'Montage vidéos, motion design, habillage, post-production'
            ],

            // ==========================================
            // 🖥️ SERVICES INFORMATIQUES
            // ==========================================
            [
                'name' => 'Dépannage informatique',
                'icon' => '🖥️',
                'description' => 'Réparation PC/Mac, virus, problèmes logiciels, récupération données'
            ],
            [
                'name' => 'Installation et configuration',
                'icon' => '⚙️',
                'description' => 'Installation logiciels, configuration réseaux, sauvegarde données'
            ],
            [
                'name' => 'Formation informatique',
                'icon' => '🎓',
                'description' => 'Formations bureautique, internet, réseaux sociaux, logiciels métiers'
            ],
            [
                'name' => 'Assistance à distance',
                'icon' => '🌐',
                'description' => 'Support technique à distance, aide logiciels, télémaintenance'
            ],

            // ==========================================
            // 🎓 SERVICES COURS & FORMATION
            // ==========================================
            [
                'name' => 'Soutien scolaire',
                'icon' => '📚',
                'description' => 'Cours particuliers maths, français, anglais, physique, aide aux devoirs'
            ],
            [
                'name' => 'Cours de langues',
                'icon' => '🌍',
                'description' => 'Anglais, espagnol, allemand, italien, préparation examens'
            ],
            [
                'name' => 'Cours de musique',
                'icon' => '🎵',
                'description' => 'Piano, guitare, chant, solfège, batterie, violon, cours tous niveaux'
            ],
            [
                'name' => 'Cours de sport',
                'icon' => '🏃',
                'description' => 'Coaching sportif, yoga, pilates, fitness, préparation physique'
            ],

            // ==========================================
            // 🏡 SERVICES À LA PERSONNE
            // ==========================================
            [
                'name' => 'Ménage et repassage',
                'icon' => '🧹',
                'description' => 'Ménage régulier, grand nettoyage, repassage, vitres'
            ],
            [
                'name' => 'Garde d\'enfants',
                'icon' => '👶',
                'description' => 'Baby-sitting occasionnel ou régulier, garde périscolaire'
            ],
            [
                'name' => 'Aide aux personnes âgées',
                'icon' => '👴',
                'description' => 'Accompagnement courses, rendez-vous, présence, aide quotidienne'
            ],
            [
                'name' => 'Garde d\'animaux',
                'icon' => '🐕',
                'description' => 'Dog sitting, cat sitting, promenades chiens, pension animaux'
            ],
            [
                'name' => 'Coursier et livraison',
                'icon' => '📦',
                'description' => 'Courses alimentaires, colis, documents, petits déménagements'
            ],

            // ==========================================
            // 🎨 SERVICES ARTISTIQUES
            // ==========================================
            [
                'name' => 'Animation événements',
                'icon' => '🎭',
                'description' => 'DJ, magiciens, clowns, maquillage enfants, spectacles'
            ],
            [
                'name' => 'Musiciens professionnels',
                'icon' => '🎸',
                'description' => 'Groupes musicaux, DJ, pianistes, chanteurs pour mariages, événements'
            ],
            [
                'name' => 'Photographe événementiel',
                'icon' => '📸',
                'description' => 'Mariages, baptêmes, anniversaires, reportages familiaux'
            ],

            // ==========================================
            // 🚗 SERVICES AUTOMOBILE
            // ==========================================
            [
                'name' => 'Mécanique automobile',
                'icon' => '🔧',
                'description' => 'Entretien, révisions, diagnostic, réparations, vidange'
            ],
            [
                'name' => 'Esthétique automobile',
                'icon' => '🚗',
                'description' => 'Nettoyage intérieur/extérieur, polissage, rénovation phares'
            ],
            [
                'name' => 'Dépannage remorquage',
                'icon' => '🚨',
                'description' => 'Dépannage batterie, crevaison, remorquage, assistance routière'
            ],

            // ==========================================
            // 🍽️ SERVICES TRAITEUR & CUISINE
            // ==========================================
            [
                'name' => 'Traiteur événementiel',
                'icon' => '🍽️',
                'description' => 'Buffets, cocktails, repas assis, mariages, anniversaires'
            ],
            [
                'name' => 'Chef à domicile',
                'icon' => '👨‍🍳',
                'description' => 'Repas à domicile, dîners privés, cours de cuisine'
            ],
            [
                'name' => 'Pâtisserie sur commande',
                'icon' => '🎂',
                'description' => 'Gâteaux personnalisés, wedding cakes, cupcakes, macarons'
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
