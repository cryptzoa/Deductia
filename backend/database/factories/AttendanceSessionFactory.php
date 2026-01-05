<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;


class AttendanceSessionFactory extends Factory
{
    
    public function definition(): array
    {
        return [
            'week_name' => 'Week ' . $this->faker->numberBetween(1, 16),
            'session_date' => $this->faker->date(),
            'attendance_open_at' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
