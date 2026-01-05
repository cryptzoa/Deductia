<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Services\ReverseGeocodingService;

class ProcessAttendanceAddress implements ShouldQueue
{
    use Queueable;

    protected $attendanceId;
    protected $lat;
    protected $lng;

    
    public function __construct($attendanceId, $lat, $lng)
    {
        $this->attendanceId = $attendanceId;
        $this->lat = $lat;
        $this->lng = $lng;
    }

    
    public function handle(ReverseGeocodingService $geoService): void
    {
        $attendance = \App\Models\Attendance::find($this->attendanceId);
        
        if ($attendance) {
            $address = $geoService->getAddress($this->lat, $this->lng);
            
            if ($address) {
                $attendance->update(['address' => $address]);
            }
        }
    }
}
