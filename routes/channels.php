<?php

use Illuminate\Support\Facades\Broadcast;

\Log::info('🔥 CHANNELS.PHP IS LOADED');

// ⭐ TEST : Retourner directement sans passer par Broadcast
if (request()->input('channel_name') === 'private-loan.26') {
    \Log::info('🔥 DIRECT TEST FOR LOAN 26');
    return response()->json([
        'auth' => 'fake-auth-string',
        'channel_data' => json_encode(['user_id' => 1])
    ]);
}

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    \Log::info('🔥 Channel User auth', ['user_id' => $user->id, 'id' => $id]);
    return (int) $user->id === (int) $id;
});

Broadcast::channel('loan.{loanId}', function ($user, $loanId) {
    \Log::info('🔥 Channel Loan auth CALLED!', [
        'user_id' => $user->id,
        'loan_id' => $loanId,
    ]);

    return ['id' => $user->id, 'name' => $user->name];
});
