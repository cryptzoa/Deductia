<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable implements FilamentUser
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'nim',
        'password',
        'role',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    
    public function canAccessPanel(Panel $panel): bool
    {
        return $this->role === 'dosen';
    }

    
    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    
    public function scopeMahasiswa($query)
    {
        return $query->where('role', 'mahasiswa');
    }

    
    public function scopePending($query)
    {
        return $query->where('is_active', false);
    }
}
