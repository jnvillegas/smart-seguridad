<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->get();
        return Inertia::render('Users/Index', [
            'users' => $users
        ]);
    }

    public function create()
    {
        return Inertia::render('Users/Create', [
            'roles' => Role::pluck('name', 'id')
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|min:2',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
            'role' => 'required|string',
            'status' => 'required|in:active,inactive',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'status' => $request->status,
        ]);

        $user->syncRoles($request->role);

        

        return redirect()->route('users.index');

    }

    public function edit(User $user)
    {
        $user = User::find($user->id);
        return Inertia::render('Users/Edit', [
            'user' => $user,
            'roles' => Role::pluck('name', 'id')
        ]);
    }

    public function update(Request $request, User $user)
    {
       $request->validate([
        'name' => 'required|string|min:2',
        'email' => 'required|email|unique:users,email,' . $user->id,
        'role' => 'required|string',
        'status' => 'required|in:active,inactive',
    ]);

    $user->update($request->except('role'));
    $user->syncRoles($request->role);
       
    return redirect()->route('users.index')
        ->with('message', 'User updated successfully');
    }

    public function show(User $user)
{
    return Inertia::render('Users/Show', [
        'user' => $user
    ]);
}

    public function destroy(User $user)
    {
try {
        // Prevent self-deletion
        if (auth()->id() === $user->id) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();
        
        return redirect()->route('users.index')
            ->with('message', 'User deleted successfully');
            
    } catch (\Exception $e) {
        return back()->with('error', 'Error deleting user');
    }
    }

}
