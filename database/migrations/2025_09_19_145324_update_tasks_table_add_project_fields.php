<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->text('description')->nullable()->after('name');
            $table->unsignedBigInteger('project_id')->nullable()->after('assigned_user_id');
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium')->after('status');
            $table->datetime('due_date')->nullable()->after('priority');

            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
            $table->dropColumn(['description', 'project_id', 'priority', 'due_date']);
        });
    }
};