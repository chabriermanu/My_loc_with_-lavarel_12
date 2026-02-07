<?php

namespace App\Providers;

use App\Models\Category;
use App\Models\Favorite;
use App\Models\ItemMedia;
use App\Models\ItemReview;
use App\Models\Loan;
use App\Models\Message;
use App\Models\UserReview;
use App\Policies\CategoryPolicy;
use App\Policies\FavoritePolicy;
use App\Policies\ItemMediaPolicy;
use App\Policies\ItemReviewPolicy;
use App\Policies\LoanPolicy;
use App\Policies\MessagePolicy;
use App\Policies\UserReviewPolicy;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configurePolicies();
    }

    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(
            fn(): ?Password => app()->isProduction()
                ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
                : null
        );
    }

    /**
     * Configure model policies
     */
    protected function configurePolicies(): void
    {
        Gate::policy(Loan::class, LoanPolicy::class);
        Gate::policy(Message::class, MessagePolicy::class);
        // Nouvelles Policies (sécurité)
        Gate::policy(Favorite::class, FavoritePolicy::class);
        Gate::policy(ItemMedia::class, ItemMediaPolicy::class);
        Gate::policy(ItemReview::class, ItemReviewPolicy::class);
        Gate::policy(UserReview::class, UserReviewPolicy::class);
        Gate::policy(Category::class, CategoryPolicy::class);
    }
}
