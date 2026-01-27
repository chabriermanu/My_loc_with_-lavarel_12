<?php

namespace App\Http\Controllers;

use App\Models\Like;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LikeController extends Controller
{
    public function toggle(Request $request)
    {
        $request->validate([
            'model_type' => 'required|string',
            'model_id'   => 'required|integer',
        ]);

        // Exemple : App\Models\Item ou App\Models\Comment
        $modelClass = $request->model_type;

        // On récupère l’instance (Item ou Comment)
      
        $model = $modelClass::findOrFail($request->model_id);

        // Vérifier si l'utilisateur a déjà liké
    
        $existingLike = $model->likes()
       
            ->where('user_id', Auth::id())
            ->first();

        if ($existingLike) {
            // Unlike
            $existingLike->delete();
        } else {
            // Like
            $model->likes()->create([
                'user_id' =>Auth::id(),
            ]);
        }

        return back();
    }
}
