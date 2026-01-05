<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    
    public function run(): void
    {
        

        User::factory()->create([
            'name' => 'Admin Dosen',
            'email' => 'admin@classcompanion.com',
            'nim' => 'ccadmin',
            'password' => 'classc0mp4ni0n',
            'role' => 'dosen',
            'is_active' => true,
        ]);
    }
}
