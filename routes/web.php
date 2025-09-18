<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| These routes are loaded by the RouteServiceProvider within a group
| which contains the "web" middleware group. Now you're using them
| for API-style auth with session or token support.
|
*/

// Optional: default welcome page
Route::get('/', function () {
    return view('welcome');
});

// Auth routes
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// Protected route to fetch user info
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});