<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\ItemMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ItemMediaController extends Controller
{
    public function store(Request $request, Item $item)
    {
        $request->validate([
            'media' => 'required|file|mimes:jpg,jpeg,png,mp4,mov,avi|max:10240',
        ]);

        if ($item->user_id !== Auth::id()) {
            abort(403);
        }

        try {
            $mediaPath = $request->file('media')->store('items/media', 'public');
        } catch (\Exception $e) {
            return back()->withErrors(['media' => 'Erreur lors de l’upload.']);
        }

        $mime = $request->file('media')->getMimeType();
        $mediaType = str_starts_with($mime, 'image/') ? 'image' : 'video';

        $lastOrder = $item->media()->max('order') ?? 0;

        ItemMedia::create([
            'item_id' => $item->id,
            'media_path' => $mediaPath,
            'media_type' => $mediaType,
            'order' => $lastOrder + 1,
        ]);

        return redirect()->route('items.show', $item->id)
            ->with('success', 'Média ajouté avec succès !');
    }

    public function destroy(ItemMedia $itemMedia)
    {
        if ($itemMedia->item->user_id !== Auth::id()) {
            abort(403);
        }

        Storage::disk('public')->delete($itemMedia->media_path);
        $itemMedia->delete();

        return redirect()->route('items.show', $itemMedia->item_id)
            ->with('success', 'Média supprimé avec succès !');
    }
}
