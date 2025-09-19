<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Project;
use App\Models\Task;


class DashboardController extends Controller
{
    public function stats()
{
    return response()->json([
        'total_users' => User::count(),
        'total_projects' => Project::count(),
        'total_tasks' => Task::count(),
        'tasks_per_project' => Project::withCount('tasks')->get(['id', 'name', 'tasks_count']),
    ]);
}
}
