<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    /**
     * Projects owned by this user
     */
    public function ownedProjects()
    {
        return $this->hasMany(Project::class, 'created_by');
    }

    /**
     * Projects assigned to this user
     */
    public function projects()
    {
        return $this->belongsToMany(Project::class)
                ->withPivot('role')
                ->withTimestamps();
    }

    /**
     * Tasks assigned to this user
     */
    public function tasks()
    {
        return $this->hasMany(Task::class, 'assigned_user_id');
    }
}
