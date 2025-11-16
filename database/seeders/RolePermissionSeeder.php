<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Resetear roles y permisos
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Crear permisos
        Permission::create(['name' => 'view-users']);
        Permission::create(['name' => 'create-users']);
        Permission::create(['name' => 'edit-users']);
        Permission::create(['name' => 'delete-users']);

        Permission::create(['name' => 'view-posts']);
        Permission::create(['name' => 'create-posts']);
        Permission::create(['name' => 'edit-posts']);
        Permission::create(['name' => 'delete-posts']);

        // Crear roles y asignar permisos
        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        $supportRole = Role::create(['name' => 'support']);
        $supportRole->givePermissionTo(['view-users', 'view-posts', 'create-posts', 'edit-posts']);

        $userRole = Role::create(['name' => 'user']);
        $userRole->givePermissionTo(['view-posts']);

    }
}
