<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Project;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display tasks user has access to
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = Task::whereHas('project', function ($projectQuery) use ($user) {
            $projectQuery->where('created_by', $user->id)
                ->orWhereHas('users', function ($userQuery) use ($user) {
                    $userQuery->where('user_id', $user->id);
                });
        })->with(['assignedUser', 'project']);

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by project if provided
        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        // Filter by assigned user if provided
        if ($request->has('assigned_user_id')) {
            $query->where('assigned_user_id', $request->assigned_user_id);
        }

        $tasks = $query->orderBy('created_at', 'desc')->paginate(10);

        return TaskResource::collection($tasks);
    }

    /**
     * Store a newly created task
     */
    public function store(StoreTaskRequest $request)
    {
        $data = $request->validated();
        
        // Check if user can access the project
        $project = Project::findOrFail($data['project_id']);
        if (!$project->userCanAccess($request->user()->id)) {
            return response()->json(['message' => 'Unauthorized to create tasks in this project'], 403);
        }

        $task = Task::create($data);

        return new TaskResource($task->load(['assignedUser', 'project']));
    }

    /**
     * Display the specified task
     */
    public function show(Request $request, Task $task)
    {
        // Check if user can access this task's project
        if (!$task->project->userCanAccess($request->user()->id)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return new TaskResource($task->load(['assignedUser', 'project']));
    }

    /**
     * Update the specified task
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        // Check if user can access this task's project
        if (!$task->project->userCanAccess($request->user()->id)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validated();
        $task->update($data);

        return new TaskResource($task->load(['assignedUser', 'project']));
    }

    /**
     * Remove the specified task
     */
    public function destroy(Request $request, Task $task)
    {
        // Check if user can access this task's project
        if (!$task->project->userCanAccess($request->user()->id)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->delete();
        return response()->noContent();
    }
}