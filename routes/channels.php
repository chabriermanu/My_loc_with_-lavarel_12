<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('loan.{loanId}', function ($user, $loanId) {
    \Log::info('🔥 Channel Loan auth', [
        'user_id' => $user->id,
        'loan_id' => $loanId,
    ]);

    $loan = \App\Models\Loan::find($loanId);

    if (!$loan) {
        return false;
    }

    // L'user doit être owner OU borrower
    $hasAccess = $loan->owner_id === $user->id || $loan->borrower_id === $user->id;

    return $hasAccess ? ['id' => $user->id, 'name' => $user->name] : false;
});
