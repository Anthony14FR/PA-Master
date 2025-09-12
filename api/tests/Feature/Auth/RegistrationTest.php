<?php

test('new users can register', function () {
    $response = $this->post('/api/register', [
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'token',
            'user' => ['id', 'first_name', 'last_name', 'email'],
        ]);
});
