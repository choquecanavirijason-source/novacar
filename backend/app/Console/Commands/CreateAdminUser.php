<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CreateAdminUser extends Command
{
    protected $signature = 'admin:create {email} {--name=} {--password=}';

    protected $description = 'Crea o promueve un usuario a rol admin (uso interactivo, sin credenciales fijas)';

    public function handle(): int
    {
        $email = $this->argument('email');
        $password = $this->option('password') ?: $this->secret('Contraseña (mín. 8 caracteres)');
        $name = $this->option('name') ?: $this->ask('Nombre', 'Administrador');

        $validator = Validator::make(
            ['email' => $email, 'password' => $password, 'name' => $name],
            [
                'email' => ['required', 'email'],
                'password' => ['required', 'string', 'min:8'],
                'name' => ['required', 'string', 'max:255'],
            ]
        );

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }

            return self::FAILURE;
        }

        $user = User::where('email', $email)->first();

        if ($user) {
            $user->update(['role' => 'admin']);
            $this->info("Usuario existente {$email} promovido a admin.");

            return self::SUCCESS;
        }

        User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'admin',
        ]);

        $this->info("Admin {$email} creado correctamente.");

        return self::SUCCESS;
    }
}
