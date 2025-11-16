<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::with('permissions')->get();

        return Inertia::render('Roles/Index', [
            'roles' => $roles
        ]);
    }

    public function create()
    {
        $permissions = Permission::all()->map(function ($permission) {
            return [
                'id' => (string) $permission->id, // Convertir a string para coincidir con el tipo
                'name' => $permission->name,
                'description' => $permission->description ?? null
            ];
        });

        return Inertia::render('Roles/Create', [
            'permissions' => $permissions
        ]);
    }


    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:roles,name',
            'permissions' => 'required|array|min:1', // Validar que se envíe un array con al menos un permiso
        ]);

        $role = Role::create(['name' => $request->name]);
        $role->syncPermissions($request->permissions);

        return redirect()->route('roles.index');
    }

    public function edit(Role $role)
    {
        return Inertia::render('Roles/Edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->map(function ($permission) {
                    return [
                        'id' => (string) $permission->id,
                        'name' => $permission->name,
                        'description' => $permission->description ?? null
                    ];
                })
            ],
            'permissions' => Permission::all()->map(function ($permission) {
                return [
                    'id' => (string) $permission->id,
                    'name' => $permission->name,
                    'description' => $permission->description ?? null
                ];
            })
        ]);

    }

    public function update(Request $request, Role $role)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|min:2|unique:roles,name,' . $role->id,
                'permissions' => 'required|array|min:1',
                'permissions.*' => 'exists:permissions,id'
            ]);

            Log::info('Received data for role update:', [
                'role_id' => $role->id,
                'name' => $validated['name'],
                'permissions' => $validated['permissions']
            ]);

            DB::beginTransaction();

            $role->update(['name' => $validated['name']]);

            // Obtener los permisos por ID y sincronizarlos
            $permissions = Permission::whereIn('id', $validated['permissions'])->get();
            $role->syncPermissions($permissions);

            DB::commit();

            return redirect()->route('roles.index');

        } catch (ValidationException $e) {
            DB::rollBack();
            Log::error('Validation error', ['errors' => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating role', ['error' => $e->getMessage()]);
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function destroy(string $id) {

       $role = Role::find($id);
       if ($role) {
           $role->delete();
           return to_route('roles.index')->with('success', 'Role deleted successfully.');
       }

       return to_route('roles.index')->with('error', 'Role not found.');
    }

}