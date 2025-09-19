<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'required|exists:projects,id',
            'assigned_user_id' => 'nullable|exists:users,id',
            'status' => 'sometimes|in:Pending,In Progress,Completed',
            'priority' => 'sometimes|in:low,medium,high',
            'due_date' => 'nullable|date|after:today'
        ];
    }
}