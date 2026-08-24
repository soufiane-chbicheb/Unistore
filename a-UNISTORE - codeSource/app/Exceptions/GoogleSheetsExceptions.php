<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class GoogleSheetsExceptions extends Exception
{
    /**
     * Create a new class instance.
     */
    private $messages = [
            401 => 'Authentication failed. Please reconnect your Google account.',
            403 => 'Permission denied or quota exceeded.',
            404 => 'Resource not found.',
            429 => 'Rate limit exceeded. Please try again later.',
    ];
    private $statusCode ;

    public function __construct(int $statusCode, string $customMessage)
    {
        $message = $customMessage ?? ($this->messages[$statusCode] ?? 'Google Sheets API error occurred.');
        parent::__construct($message , $statusCode) ;
    }

 
    public function render(): JsonResponse
    {
        return response()->json([
            'error' => $this->getMessage(),
            'code' => $this->statusCode
        ], $this->statusCode);
    }

    // What gets LOGGED for developers
    public function report(): void
    {
        Log::error('Google Sheets API Error', [
            'status_code' => $this->statusCode,
            'message' => $this->getMessage(),
        ]);
    }
}
