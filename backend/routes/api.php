<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SessionController;
use App\Http\Controllers\Api\AttendanceController;
use Illuminate\Support\Facades\Route;




Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [App\Http\Controllers\Api\PasswordResetController::class, 'sendResetLink']);
Route::post('/reset-password', [App\Http\Controllers\Api\PasswordResetController::class, 'reset']);


Route::middleware(['auth:sanctum', 'user.active'])->group(function () {
    
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    
    Route::get('/materials', [SessionController::class, 'materials']);

    
    Route::get('/sessions', [SessionController::class, 'sessions']);
    Route::get('/sessions/{session}', [SessionController::class, 'show']);

    
    Route::post('/sessions/{session}/attend', [AttendanceController::class, 'attend']);
    Route::get('/my-attendances', [AttendanceController::class, 'myAttendances']);
    Route::get('/attendance-settings', [AttendanceController::class, 'settings']);
});
