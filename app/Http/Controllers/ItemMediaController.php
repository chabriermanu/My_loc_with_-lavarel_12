<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\ItemMedia;
use App\Services\SecureFileUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ItemMediaController extends Controller
{
    /**
     * Injection du service d'upload sécurisé
     */
    public function __construct(
        private SecureFileUploadService $fileUploadService
    ) {}

    /**
     * Upload sécurisé de médias additionnels
     * 🛡️ SÉCURISÉ avec validation magic bytes
     */
    public function store(Request $request, Item $item)
    {
        // Vérification propriétaire
        if ($item->user_id !== Auth::id()) {
            abort(403, 'Action non autorisée');
        }

        // Validation basique du type de fichier
        $request->validate([
            'media' => 'required|file',
        ]);

        try {
            $file = $request->file('media');
            $mime = $file->getMimeType();

            // Déterminer si c'est une image ou vidéo
            $isImage = str_starts_with($mime, 'image/');
            $isVideo = str_starts_with($mime, 'video/');

            if (!$isImage && !$isVideo) {
                return back()->withErrors([
                    'media' => 'Le fichier doit être une image ou une vidéo.'
                ]);
            }

            // 🛡️ Upload sécurisé selon le type
            if ($isImage) {
                $mediaPath = $this->fileUploadService->uploadImage($file);
                $mediaType = 'image';
            } else {
                $mediaPath = $this->fileUploadService->uploadVideo($file);
                $mediaType = 'video';
            }

            // Récupérer l'ordre max actuel
            $lastOrder = $item->media()->max('order') ?? 0;

            // Créer le média
            ItemMedia::create([
                'item_id' => $item->id,
                'media_path' => $mediaPath,
                'media_type' => $mediaType,
                'order' => $lastOrder + 1,
            ]);

            return redirect()->route('items.show', $item->id)
                ->with('success', 'Média ajouté avec succès !');
        } catch (\InvalidArgumentException $e) {
            // Erreur de validation du fichier
            return back()->withErrors([
                'media' => $e->getMessage()
            ]);
        } catch (\Exception $e) {
            return back()->withErrors([
                'media' => 'Erreur lors de l\'upload du média.'
            ]);
        }
    }

    /**
     * Suppression sécurisée d'un média
     * 🛡️ SÉCURISÉ avec SecureFileUploadService
     */
    public function destroy(ItemMedia $itemMedia)
    {
        // Vérification propriétaire
        if ($itemMedia->item->user_id !== Auth::id()) {
            abort(403, 'Action non autorisée');
        }

        // 🛡️ Suppression sécurisée du fichier
        $this->fileUploadService->deleteFile($itemMedia->media_path);

        // Suppression du média en DB
        $itemMedia->delete();

        return redirect()->route('items.show', $itemMedia->item_id)
            ->with('success', 'Média supprimé avec succès !');
    }

    /**
     * 🛡️ Afficher un média additionnel de manière sécurisée
     */
    public function showFile(ItemMedia $itemMedia)
    {
        if (!$itemMedia->media_path) {
            abort(404, 'Fichier non trouvé');
        }

        $path = storage_path('app/' . $itemMedia->media_path);

        if (!file_exists($path)) {
            abort(404, 'Fichier non trouvé');
        }

        // Retourner le fichier avec les bons headers
        return response()->file($path, [
            'Content-Type' => mime_content_type($path),
            'Cache-Control' => 'public, max-age=31536000',
        ]);
    }
}
