<?php

namespace App\Observers;

use App\Models\Models\Treasury\CurrentAccountMovement;

class CurrentAccountMovementObserver
{
    /**
     * Handle the CurrentAccountMovement "created" event.
     */
    public function created(CurrentAccountMovement $currentAccountMovement): void
    {
        //
    }

    /**
     * Handle the CurrentAccountMovement "updated" event.
     */
    public function updated(CurrentAccountMovement $currentAccountMovement): void
    {
        //
    }

    /**
     * Handle the CurrentAccountMovement "deleted" event.
     */
    public function deleted(CurrentAccountMovement $currentAccountMovement): void
    {
        //
    }

    /**
     * Handle the CurrentAccountMovement "restored" event.
     */
    public function restored(CurrentAccountMovement $currentAccountMovement): void
    {
        //
    }

    /**
     * Handle the CurrentAccountMovement "force deleted" event.
     */
    public function forceDeleted(CurrentAccountMovement $currentAccountMovement): void
    {
        //
    }
}
