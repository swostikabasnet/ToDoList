<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\DashboardController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // User routes
    Route::apiResource('/users', UserController::class);
    
    // Project routes
    Route::apiResource('/projects', ProjectController::class);
    Route::post('/projects/{project}/assign-users', [ProjectController::class, 'assignUsers']);
    
    // Task routes
    Route::apiResource('/tasks', TaskController::class);

    Route::get('/dashboard-stats', [DashboardController::class, 'stats']);

});

// Public routes
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);