<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use Illuminate\Http\Response;
use Illuminate\Http\Request;


class ProjectController extends Controller
{
    /**
     * Display projects user has access to
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Get projects user owns or is assigned to
        $projects = Project::where('created_by', $user->id)
            ->orWhereHas('users', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with(['owner', 'users', 'tasks'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return ProjectResource::collection($projects);
    }

    /**
     * Store a newly created project
     */
    public function store(StoreProjectRequest $request)
    {
        $data = $request->validated();
        $data['created_by'] = $request->user()->id;

        $project = Project::create($data);

        // Assign users to project if provided
        if (!empty($data['user_ids'])) {
            $project->users()->attach($data['user_ids']);
        }

        return new ProjectResource($project->load(['owner', 'users']));
    }

    /**
     * Display the specified project
     */
    public function show(Request $request, Project $project)
    {
        // Check if user can access this project
        if (!$project->userCanAccess($request->user()->id)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return new ProjectResource($project->load(['owner', 'users', 'tasks.assignedUser']));
    }

    /**
     * Update the specified project
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {
        // Check if user is owner
        if ($project->created_by !== $request->user()->id) {
            return response()->json(['message' => 'Only project owner can update'], 403);
        }

        $data = $request->validated();
        $project->update($data);

        // Update user assignments if provided
        if (array_key_exists('user_ids', $data)) {
            $project->users()->sync($data['user_ids']);
        }

        return new ProjectResource($project->load(['owner', 'users']));
    }

    /**
     * Remove the specified project
     */
    public function destroy(Request $request, Project $project)
    {
        // Check if user is owner
        if ($project->created_by !== $request->user()->id) {
            return response()->json(['message' => 'Only project owner can delete'], 403);
        }

        $project->delete();
        return response()->noContent();
    }

    /**
     * Assign users to project
     */
    public function assignUsers(Request $request, Project $project)
    {
        // Check if user is owner
        if ($project->created_by !== $request->user()->id) {
            return response()->json(['message' => 'Only project owner can assign users'], 403);
        }

        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id'
        ]);

        $project->users()->sync($request->user_ids);

        return new ProjectResource($project->load(['owner', 'users']));
    }
}