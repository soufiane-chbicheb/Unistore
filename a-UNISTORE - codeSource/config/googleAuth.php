<?php

return [
    'redirect_uri' => env('GOOGLE_REDIRECT_URI', 'http://lvh.me:8000/auth/google/callback') ,
    'oauth_auth_credentials_path' => storage_path('app/google/googleAuth-credentials.json'),
];