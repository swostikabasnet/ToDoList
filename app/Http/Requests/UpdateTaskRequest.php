<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|nullable',
            'assigned_user_id' => 'sometimes|exists:users,id|nullable',
            'status' => 'sometimes|in:Pending,In Progress,Completed',
            'priority' => 'sometimes|in:low,medium,high',
            'due_date' => 'sometimes|date|after:today|nullable'
        ];
    }
}