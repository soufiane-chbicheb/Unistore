<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    //


    public function index($tenant) {
        return Inertia::render('admin/pages/admins/AdminsList', [
            'admins' => User::with('roles')->get(),
            'roles' => Role::all(),
        ]);
    }

    public function store_user($tenant, Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role_ids' => 'nullable|array',
            'role_ids.*' => 'exists:roles,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'store_id' => session('store_id'),
        ]);

        if (!empty($validated['role_ids'])) {
            $user->roles()->sync($validated['role_ids']);
        }

        return back()->with('success', 'Admin created successfully.');
    }

    public function update_user($tenant, Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'role_ids' => 'nullable|array',
            'role_ids.*' => 'exists:roles,id',
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        if (!empty($validated['password'])) {
            $user->update(['password' => bcrypt($validated['password'])]);
        }

        $user->roles()->sync($validated['role_ids'] ?? []);

        return back()->with('success', 'Admin updated successfully.');
    }

    public function destroy_user($tenant, User $user)
    {
        $user->delete();
        return back()->with('success', 'Admin removed successfully.');
    }


    
}
