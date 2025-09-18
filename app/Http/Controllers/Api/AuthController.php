<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;

class AuthController extends Controller
{
    public function signup(SignupRequest $request)
    {
        // Validate the request data
        $data = $request->validated();
        /** @var \App\Models\User $user */
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);
        
        // Generate a new API token for the user
        $token=$user -> createToken('main')-> plainTextToken;
        // Return the token in the response
        return response(compact('user','token'));
    }

    public function login(LoginRequest $request)
    {
        // Validate the request data
        $credentials=$request->validated();
        if(!Auth::attempt($credentials)){
            return response(['message' => 'Provided email address or password is incorrect', 422]);
        }
        /** @var User $user */
        $user=Auth::user();
        $token=$user->createToken('main')->plainTextToken;
        return response(compact('user','token'));
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();

        return response('', 204);
    }
}
