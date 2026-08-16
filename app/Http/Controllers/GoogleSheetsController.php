<?php

namespace App\Http\Controllers;

use App\Models\GoogleSheet;
use App\Services\Google\GoogleSheetsService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GoogleSheetsController extends Controller
{
    
    protected $service;
    public function __construct(GoogleSheetsService $service) {
        $this->service = $service ;
    }

    private function getOrCreateOrdersSheet(): GoogleSheet
    {
        // Check model works
        if (!class_exists(GoogleSheet::class)) {
            throw new \Exception('GoogleSheet model does not exist!');
        }

        if ($this->service === null) {
            throw new \Exception('$this->service is not initialized!');
        }

        // Search for the sheet
        $sheet = GoogleSheet::where('key', 'orders')->first();

        if (!$sheet) {
            // Create the sheet via Google API
            $spreadsheetId = $this->service->createOrderSheet('orders');

            // Insert into DB
            $sheet = GoogleSheet::create([
                'key' => 'orders',
                'spreadsheet_id' => $spreadsheetId,
                'spreadsheet_url' => "https://docs.google.com/spreadsheets/d/{$spreadsheetId}",
            ]);
        }

        return $sheet;
    }

    public function createOrderSheet(){
        try {
            $sheet = $this->getOrCreateOrdersSheet();
            return redirect()->back()->with('success', "Orders sheet created! <a href='{$sheet->spreadsheet_url}' target='_blank'>Open Sheet</a>");
        } catch (\Exception $e) {
            Log::error('Error creating or getting Google sheet', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return redirect()->back()->with('error', 'Failed to create sheet: ' . $e->getMessage());
        }
    }
}
