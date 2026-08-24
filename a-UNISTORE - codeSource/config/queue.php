<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Queue Connection
    |--------------------------------------------------------------------------
    */

    'default' => env('QUEUE_CONNECTION', 'sync'),

    /*
    |--------------------------------------------------------------------------
    | Queue Connections
    |--------------------------------------------------------------------------
    */

    'connections' => [

        // ✅ sync — exécute le job immédiatement, pas de queue
        'sync' => [
            'driver' => 'sync',
        ],

        // ✅ database — stocke les jobs dans une table SQL
        'database' => [
            'driver'       => 'database',
            'connection'   => env('DB_QUEUE_CONNECTION'),
            'table'        => env('DB_QUEUE_TABLE', 'jobs'),
            'queue'        => env('DB_QUEUE', 'default'),
            'retry_after'  => env('DB_QUEUE_RETRY_AFTER', 90),
            'after_commit' => false,
        ],

        // ✅ redis — le plus rapide, pour la production
        'redis' => [
            'driver'       => 'redis',
            'connection'   => env('REDIS_QUEUE_CONNECTION', 'default'),
            'queue'        => env('REDIS_QUEUE', 'default'),
            'retry_after'  => env('REDIS_QUEUE_RETRY_AFTER', 90),
            'block_for'    => null,
            'after_commit' => false,
        ],

        // ✅ sqs — Amazon SQS pour AWS
        'sqs' => [
            'driver'  => 'sqs',
            'key'     => env('AWS_ACCESS_KEY_ID'),
            'secret'  => env('AWS_SECRET_ACCESS_KEY'),
            'prefix'  => env('SQS_PREFIX', 'https://sqs.us-east-1.amazonaws.com/your-account-id'),
            'queue'   => env('SQS_QUEUE', 'default'),
            'suffix'  => env('SQS_SUFFIX'),
            'region'  => env('AWS_DEFAULT_REGION', 'us-east-1'),
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Job Batching
    |--------------------------------------------------------------------------
    */

    'batching' => [
        'database' => env('DB_CONNECTION', 'sqlite'),
        'table'    => 'job_batches',
    ],

    /*
    |--------------------------------------------------------------------------
    | Failed Queue Jobs
    |--------------------------------------------------------------------------
    */

    'failed' => [
        'driver'   => env('QUEUE_FAILED_DRIVER', 'database-uuids'),
        'database' => env('DB_CONNECTION', 'sqlite'),
        'table'    => 'failed_jobs',
    ],

];