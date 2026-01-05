<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        Schema::create('attendance_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('week_name');  
            $table->date('session_date');
            $table->foreignId('material_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamp('attendance_open_at')->nullable();
            $table->timestamps();
        });
    }

    
    public function down(): void
    {
        Schema::dropIfExists('attendance_sessions');
    }
};
