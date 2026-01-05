<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class AttendanceSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'week_name',
        'session_date',
        'material_id',
        'attendance_open_at',
    ];

    protected function casts(): array
    {
        return [
            'session_date' => 'date',
            'attendance_open_at' => 'datetime',
        ];
    }

    
    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class);
    }

    
    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    
    public function isAttendanceOpen(): bool
    {
        if (!$this->attendance_open_at) {
            return false;
        }

        $openTime = Carbon::parse($this->attendance_open_at);
        $minutesPassed = now()->diffInMinutes($openTime, false);

        return $minutesPassed >= -15 && $minutesPassed <= 0;
    }

    
    public function getRemainingMinutesAttribute(): ?int
    {
        if (!$this->attendance_open_at) {
            return null;
        }

        $openTime = Carbon::parse($this->attendance_open_at);
        $minutesPassed = now()->diffInMinutes($openTime, false);
        $remaining = 15 + $minutesPassed;

        return max(0, $remaining);
    }
}
