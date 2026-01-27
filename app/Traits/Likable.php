<?php

namespace App\Traits;

use App\Models\Like;

trait Likable
{
    public function likes()
    {
        return $this->morphMany(Like::class, 'likeable');
    }
    
}
