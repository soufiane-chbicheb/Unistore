<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Invitation;
use App\Events\UserInvited;
use App\Mail\RoleInvitationMail;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;

class RoleController extends Controller
{
    private const AVAILABLE_CLAIMS = [
        ['value' => 'manage-products', 'label' => 'Manage Products'],
        ['value' => 'manage-orders', 'label' => 'Manage Orders'],
        ['value' => 'manage-customers', 'label' => 'Manage Customers'],
        ['value' => 'view-reports', 'label' => 'View Reports'],
        ['value' => 'manage-settings', 'label' => 'Manage Settings'],
        ['value' => 'manage-roles', 'label' => 'Manage Roles'],
        ['value' => 'manage-banners', 'label' => 'Manage Banners'],
        ['value' => 'manage-collections', 'label' => 'Manage Collections'],
    ];

    public function index()
    {
        return Inertia::render('admin/pages/roles/RoleManager', [
            'roles' => Role::withCount('users')->get(),
            'availableClaims' => self::AVAILABLE_CLAIMS,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'claims' => 'nullable|array',
            'email' => 'nullable|email',
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'claims' => $validated['claims'] ?? [],
        ]);

        if (!empty($validated['email'])) {
            $invitation = Invitation::create([
                'email' => $validated['email'],
                'role_id' => $role->id,
                'token' => Str::random(40),
                'status' => 'pending',
                'expires_at' => now()->addDays(7),
            ]);
            
            event(new UserInvited($invitation));
        }

        return back()->with('success', 'Role created successfully.');
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'claims' => 'nullable|array',
        ]);

        $role->update([
            'name' => $validated['name'],
            'claims' => $validated['claims'] ?? [],
        ]);

        return back()->with('success', 'Role updated successfully.');
    }

    public function invite(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'role_id' => 'required|exists:roles,id',
        ]);

        $invitation = Invitation::create([
            'email' => $validated['email'],
            'role_id' => $validated['role_id'],
            'token' => Str::random(40),
            'status' => 'pending',
            'expires_at' => now()->addDays(7),
        ]);

        event(new UserInvited($invitation));

        return back()->with('success', 'Invitation sent successfully.');
    }

    public function destroy(Role $role)
    {
        // Prevent deleting core roles if needed, but for now just delete
        $role->delete();

        return back()->with('success', 'Role deleted successfully.');
    }

    public function assignRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role_id' => 'required|exists:roles,id',
        ]);

        $user->roles()->syncWithoutDetaching([$validated['role_id']]);

        return back()->with('success', 'Role assigned successfully.');
    }

    public function removeRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role_id' => 'required|exists:roles,id',
        ]);

        $user->roles()->detach($validated['role_id']);

        return back()->with('success', 'Role removed successfully.');
    }
}
