<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SecureFileUploadService
{
    /**
     * MIME types autorisés avec leurs magic bytes (signature)
     */
    private const ALLOWED_IMAGE_TYPES = [
        'image/jpeg' => ['FFD8FF'],
        'image/jpg'  => ['FFD8FF'],
        'image/png'  => ['89504E47'],
        'image/webp' => ['52494646'],
    ];

    /**
     * MIME types vidéo autorisés avec leurs magic bytes
     */
    private const ALLOWED_VIDEO_TYPES = [
        'video/mp4'        => ['00000018', '00000020'],  // ftyp
        'video/quicktime'  => ['00000014', '00000018'],  // mov
        'video/x-msvideo'  => ['52494646'],              // avi (RIFF)
        'video/x-ms-wmv'   => ['3026B275'],              // wmv
    ];

    /**
     * Taille max par type (en bytes)
     */
    private const MAX_IMAGE_SIZE = 10485760;  // 10MB
    private const MAX_VIDEO_SIZE = 1073741824; // 1GB

    /**
     * Dimensions min/max
     */
    private const MIN_WIDTH = 200;
    private const MIN_HEIGHT = 200;
    private const MAX_WIDTH = 4000;
    private const MAX_HEIGHT = 4000;

    /**
     * Upload sécurisé d'une image
     * 
     * @param UploadedFile $file
     * @return string Le chemin du fichier stocké
     * @throws \InvalidArgumentException Si le fichier n'est pas valide
     */
    public function uploadImage(UploadedFile $file): string
    {
        // 1. Vérifier le MIME type déclaré
        $this->validateMimeType($file, self::ALLOWED_IMAGE_TYPES);

        // 2. Vérifier les magic bytes (signature réelle du fichier)
        $this->validateMagicBytes($file, self::ALLOWED_IMAGE_TYPES);

        // 3. Vérifier la taille
        $this->validateSize($file, self::MAX_IMAGE_SIZE);

        // 4. Vérifier les dimensions
        $this->validateImageDimensions($file);

        // 5. Générer un nom sécurisé
        $filename = $this->generateSecureFilename($file);

        // 6. Stocker dans un dossier PRIVÉ (hors public/)
        $path = $file->storeAs('private/items', $filename, 'local');

        return $path;
    }

    /**
     * Upload sécurisé d'une vidéo
     * 
     * @param UploadedFile $file
     * @return string Le chemin du fichier stocké
     * @throws \InvalidArgumentException Si le fichier n'est pas valide
     */
    public function uploadVideo(UploadedFile $file): string
    {
        // 1. Vérifier le MIME type déclaré
        $this->validateMimeType($file, self::ALLOWED_VIDEO_TYPES);

        // 2. Vérifier les magic bytes (signature réelle du fichier)
        $this->validateMagicBytes($file, self::ALLOWED_VIDEO_TYPES);

        // 3. Vérifier la taille
        $this->validateSize($file, self::MAX_VIDEO_SIZE);

        // 4. Générer un nom sécurisé
        $filename = $this->generateSecureFilename($file);

        // 5. Stocker dans un dossier PRIVÉ
        $path = $file->storeAs('private/videos', $filename, 'local');

        return $path;
    }

    /**
     * Validation du MIME type déclaré par le navigateur
     */
    private function validateMimeType(UploadedFile $file, array $allowedTypes): void
    {
        $mime = $file->getMimeType();

        if (!array_key_exists($mime, $allowedTypes)) {
            throw new \InvalidArgumentException(
                "Type de fichier non autorisé."
            );
        }
    }

    /**
     * Validation des magic bytes (signature réelle du fichier)
     * C'est ici qu'on empêche un malware.php renommé en malware.jpg
     */
    private function validateMagicBytes(UploadedFile $file, array $allowedTypes): void
    {
        // Lire les premiers bytes du fichier
        $handle = fopen($file->getRealPath(), 'rb');
        $bytes = bin2hex(fread($handle, 8));
        fclose($handle);

        $mime = $file->getMimeType();
        $allowedSignatures = $allowedTypes[$mime];

        $isValid = false;
        foreach ($allowedSignatures as $signature) {
            if (str_starts_with(strtoupper($bytes), strtoupper($signature))) {
                $isValid = true;
                break;
            }
        }

        if (!$isValid) {
            throw new \InvalidArgumentException(
                "Le fichier n'est pas valide (signature incorrecte)"
            );
        }
    }

    /**
     * Validation de la taille du fichier
     */
    private function validateSize(UploadedFile $file, int $maxSize): void
    {
        if ($file->getSize() > $maxSize) {
            $maxMB = round($maxSize / 1048576, 2);
            throw new \InvalidArgumentException(
                "Le fichier ne peut pas dépasser {$maxMB}MB"
            );
        }
    }

    /**
     * Validation des dimensions de l'image
     */
    private function validateImageDimensions(UploadedFile $file): void
    {
        $imageSize = getimagesize($file->getRealPath());

        if ($imageSize === false) {
            throw new \InvalidArgumentException(
                "Le fichier n'est pas une image valide"
            );
        }

        [$width, $height] = $imageSize;

        if ($width < self::MIN_WIDTH || $height < self::MIN_HEIGHT) {
            throw new \InvalidArgumentException(
                "L'image doit faire au moins " . self::MIN_WIDTH . "x" . self::MIN_HEIGHT . " pixels"
            );
        }

        if ($width > self::MAX_WIDTH || $height > self::MAX_HEIGHT) {
            throw new \InvalidArgumentException(
                "L'image ne peut pas dépasser " . self::MAX_WIDTH . "x" . self::MAX_HEIGHT . " pixels"
            );
        }
    }

    /**
     * Génération d'un nom de fichier totalement aléatoire et sécurisé
     * Utilise UUID pour éviter les collisions et empêcher la prédiction
     */
    private function generateSecureFilename(UploadedFile $file): string
    {
        $extension = strtolower($file->getClientOriginalExtension());

        // Whitelist stricte des extensions autorisées
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];

        if (!in_array($extension, $allowedExtensions)) {
            $extension = 'jpg'; // Fallback sécurisé
        }

        // UUID v4 aléatoire (impossible à deviner)
        return Str::uuid() . '.' . $extension;
        // Exemple: 550e8400-e29b-41d4-a716-446655440000.jpg
    }

    /**
     * Supprimer un fichier de manière sécurisée
     * 
     * @param string|null $path
     * @return bool
     */
    public function deleteFile(?string $path): bool
    {
        if (!$path) {
            return false;
        }

        if (Storage::exists($path)) {
            return Storage::delete($path);
        }

        return false;
    }
}
