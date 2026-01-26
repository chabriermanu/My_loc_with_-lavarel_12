<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\UpdateCommentRequest;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCommentRequest $request)
    {
        Comment::create([

            'item_id' => $request->item_id,
            'user_id' => Auth::id(),
            'parent_id' => $request->parent_id, // null si commentaire principal
            'content' => $request->content,
        ]);
        return redirect()->route('items.show', $request->item_id)
            ->with('success', 'Commentaire ajouté avec succès !');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCommentRequest $request, Comment $comment)
    {
        if ($comment->user_id !== Auth::id()) {
            abort(403, 'Action non autorisée');
        }

        $comment->update([
            'content' => $request->content
        ]);
        return redirect()->route('items.show', $comment->item_id)
            ->with('success', 'Commentaire modifié avec succès !');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comment $comment)
    {
        if ($comment->user_id !== Auth::id()) {
            abort(403, 'Action non autorisée');
        }
        $comment->delete();

        return redirect()->route('items.show', $comment->item_id)->with('success', 'Commentaire supprimé avec succès !');
    }
}
