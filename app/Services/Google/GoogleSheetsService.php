<?php

namespace App\Services\Google;

use App\Exceptions\GoogleSheetsExceptions;
use App\Models\GoogleSheet;
use App\Models\Order;
use Google\Service\Sheets;
use Google\Service\Exception as GoogleServiceException;

class GoogleSheetsService
{
    protected $service;
    protected $client;
    protected $spreadSheetId;
    protected $spreadSheetName;

    public function __construct()
    {
        $this->client = app('googleApp');
        $this->service = new Sheets($this->client);
        $this->spreadSheetId = GoogleSheet::where('key', 'orders')->value('spreadsheet_id');
        $this->spreadSheetName = 'orders';
    }

    private function createOrderSheet($accessToken)
    {
        if (!$accessToken) {
            throw new GoogleSheetsExceptions(401, 'Access token is missing or null');
        }

        $this->client->setAccessToken($accessToken);
        $this->client->setScopes([Sheets::SPREADSHEETS]);

        try {
            $sheet = new Sheets\Spreadsheet([
                'properties' => [
                    'title' => $this->spreadSheetName
                ],
                'sheets' => [
                    [
                        'properties' => [
                            'title' => $this->spreadSheetName
                        ]
                    ]
                ]
            ]);

            $createdSheet = $this->service->spreadsheets->create($sheet);

            if (!$createdSheet || !isset($createdSheet->spreadsheetId)) {
                throw new GoogleSheetsExceptions(500, 'Invalid response from Google Sheets API');
            }

            $spreadSheetId = $createdSheet->spreadsheetId;
            $this->syncFirstTimeDataToSheet($spreadSheetId, $this->spreadSheetName);

            return $createdSheet;

        } catch (GoogleServiceException $e) {
            throw new GoogleSheetsExceptions(
                $e->getCode() ?: 500,
                'Google Sheets API Error: ' . $e->getMessage()
            );
        }
    }

    public function getOrCreateOrderSheet($accessToken = null)
    {
        $sheet = GoogleSheet::where('key', $this->spreadSheetName)->first();

        if (!$sheet) {
            if (!$accessToken) {
                throw new GoogleSheetsExceptions(401, 'Access token required to create new sheet');
            }

            $createdSheet = $this->createOrderSheet($accessToken);

            return GoogleSheet::create([
                'key' => $this->spreadSheetName,
                'spreadsheet_id' => $createdSheet->spreadsheetId,
                'spreadsheet_url' => $createdSheet->spreadsheetUrl,
            ]);
        }

        return $sheet;
    }


    public function getSpreadsheetsId(){
        return $this->spreadSheetId;
    }

    public function syncFirstTimeDataToSheet($spreadsheetId)
    {
        try {
            $this->writeOrderData($spreadsheetId);

            // Get sheet ID for making requests
            $spreadsheet = $this->service->spreadsheets->get($spreadsheetId);
            
            if (!$spreadsheet || !$spreadsheet->getSheets()) {
                throw new GoogleSheetsExceptions(404, 'Spreadsheet or sheets not found');
            }

            $sheetId = $spreadsheet->getSheets()[0]->getProperties()->sheetId;

            // Combine all formatting requests
            $requests = array_merge(
                $this->headerFormattingRequests($sheetId),
                $this->stylingSheetRequests($sheetId)
            );

            $batchUpdateRequest = new Sheets\BatchUpdateSpreadsheetRequest([
                'requests' => $requests
            ]);

            $this->service->spreadsheets->batchUpdate($spreadsheetId, $batchUpdateRequest);

        } catch (GoogleServiceException $e) {
            throw new GoogleSheetsExceptions(
                $e->getCode() ?: 500,
                'Failed to sync data to sheet: ' . $e->getMessage()
            );
        }
    }

    private function stylingSheetRequests($sheetId)
    {
        $requests = [];

        /* ============================================
         * Cell resize depends on content 
         * ============================================ */
        $requests[] = new Sheets\Request([
            'autoResizeDimensions' => [
                'dimensions' => [
                    'sheetId' => $sheetId,
                    'dimension' => 'COLUMNS',
                    'startIndex' => 0,
                    'endIndex' => 12  // Updated to include notes column
                ]
            ]
        ]);

        /* ============================================
         * Dropdown creation for status column
         * ============================================ */
        $requests[] = new Sheets\Request([
            'setDataValidation' => [
                'range' => [
                    'sheetId' => $sheetId,
                    'startRowIndex' => 1,
                    'endRowIndex' => 1000,
                    'startColumnIndex' => 9,
                    'endColumnIndex' => 10
                ],
                'rule' => [
                    'condition' => [
                        'type' => 'ONE_OF_LIST',
                        'values' => [
                            ['userEnteredValue' => 'pending'],
                            ['userEnteredValue' => 'confirmed'],
                            ['userEnteredValue' => 'out_for_delivery'],
                            ['userEnteredValue' => 'delivered'],
                            ['userEnteredValue' => 'delivery_failed'],
                            ['userEnteredValue' => 'returned'],
                            ['userEnteredValue' => 'canceled'],
                        ]
                    ],
                    'showCustomUi' => true,
                    'strict' => true
                ]
            ]
        ]);

        // Conditional formatting for different statuses
        $statusColors = [
            'delivered' => ['red' => 0.7, 'green' => 1.0, 'blue' => 0.7],
            'canceled' => ['red' => 1.0, 'green' => 0.7, 'blue' => 0.7],
            'pending' => ['red' => 1.0, 'green' => 1.0, 'blue' => 0.7],
            'confirmed' => ['red' => 1.0, 'green' => 0.9, 'blue' => 0.7],
            'out_for_delivery' => ['red' => 0.7, 'green' => 0.9, 'blue' => 1.0],
            'returned' => ['red' => 0.9, 'green' => 0.8, 'blue' => 1.0],
            'delivery_failed' => ['red' => 1.0, 'green' => 0.6, 'blue' => 0.6],
        ];

        foreach ($statusColors as $status => $color) {
            $requests[] = new Sheets\Request([
                'addConditionalFormatRule' => [
                    'rule' => [
                        'ranges' => [[
                            'sheetId' => $sheetId,
                            'startRowIndex' => 1,
                            'endRowIndex' => 1000,
                            'startColumnIndex' => 9,
                            'endColumnIndex' => 10
                        ]],
                        'booleanRule' => [
                            'condition' => [
                                'type' => 'TEXT_EQ',
                                'values' => [['userEnteredValue' => $status]]
                            ],
                            'format' => [
                                'backgroundColor' => $color
                            ]
                        ]
                    ]
                ]
            ]);
        }

        return $requests;
    }

    private function writeOrderData($spreadsheetId)
    {
        $orders = Order::with(['user', 'address'])
            ->whereNotIn('status', ['canceled', 'delivered'])
            ->orderBy('updated_at')
            ->get();

        $header = [
            [
                'Order ID', 'Customer Name', 'Phone Number', 'E-mail', 'City',
                'Postal Code', 'Address 1', 'Address 2', 'Total Price',
                'Status', 'Date', 'Notes'
            ]
        ];

        $rows = $header;
        foreach ($orders as $order) {
            $rows[] = $this->orderRowDataMaker($order);
        }

        try {
            $body = new Sheets\ValueRange(['values' => $rows]);

            $this->service->spreadsheets_values->update(
                $spreadsheetId,
                "{$this->spreadSheetName}!A1",
                $body,
                ['valueInputOption' => 'RAW']
            );

        } catch (GoogleServiceException $e) {
            throw new GoogleSheetsExceptions(
                $e->getCode() ?: 500,
                'Failed to write order data: ' . $e->getMessage()
            );
        }
    }

    private function headerFormattingRequests($sheetId)
    {
        $columnColors = [
            ['red' => 0.7, 'green' => 0.85, 'blue' => 1.0],   // Order ID
            ['red' => 0.7, 'green' => 1.0, 'blue' => 0.8],    // Customer Name
            ['red' => 0.85, 'green' => 1.0, 'blue' => 0.7],   // Phone Number
            ['red' => 1.0, 'green' => 0.95, 'blue' => 0.7],   // E-mail
            ['red' => 0.7, 'green' => 0.9, 'blue' => 1.0],    // City
            ['red' => 0.7, 'green' => 0.85, 'blue' => 1.0],   // Postal Code
            ['red' => 0.85, 'green' => 0.8, 'blue' => 1.0],   // Address 1
            ['red' => 0.8, 'green' => 0.7, 'blue' => 1.0],    // Address 2
            ['red' => 1.0, 'green' => 0.85, 'blue' => 0.7],   // Total Price
            ['red' => 1.0, 'green' => 0.8, 'blue' => 0.9],    // Status
            ['red' => 0.9, 'green' => 0.9, 'blue' => 0.95],   // Date
            ['red' => 0.95, 'green' => 0.95, 'blue' => 0.85], // Notes
        ];

        $requests = [];

        foreach ($columnColors as $columnIndex => $color) {
            $requests[] = new Sheets\Request([
                'repeatCell' => [
                    'range' => [
                        'sheetId' => $sheetId,
                        'startRowIndex' => 0,
                        'endRowIndex' => 1,
                        'startColumnIndex' => $columnIndex,
                        'endColumnIndex' => $columnIndex + 1
                    ],
                    'cell' => [
                        'userEnteredFormat' => [
                            'backgroundColor' => $color,
                            'textFormat' => [
                                'bold' => true,
                                'foregroundColor' => [
                                    'red' => 0.0,
                                    'green' => 0.0,
                                    'blue' => 0.0
                                ]
                            ],
                            'horizontalAlignment' => 'CENTER'
                        ]
                    ],
                    'fields' => 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
                ]
            ]);
        }

        return $requests;
    }

    private function orderRowDataMaker(Order $order)
    {
        return [
            '#' . ($order->order_number ?? ''),
            $order->address->full_name ?? '',
            $order->address->phone ?? '-',
            $order->address->email ?? '-',
            $order->address->city ?? '-',
            $order->address->postal_code ?? '-',
            $order->address->address_line1 ?? '-',
            $order->address->address_line2 ?? '',
            number_format($order->total_amount, 2),
            $order->status,
            $order->updated_at->format('M d, Y g:i A'),
            $order->notes ?? '',
        ];
    }

    // Methods for order observation
    public function appendOrder(Order $order)
    {
        if (!$this->spreadSheetId) {
            throw new GoogleSheetsExceptions(404, 'Spreadsheet ID not found. Please create a sheet first.');
        }

        $row = $this->orderRowDataMaker($order);

        try {
            $body = new Sheets\ValueRange(['values' => [$row]]);

            $this->service->spreadsheets_values->append(
                $this->spreadSheetId,
                "{$this->spreadSheetName}!A:Z",
                $body,
                ['valueInputOption' => 'RAW']
            );

        } catch (GoogleServiceException $e) {
            throw new GoogleSheetsExceptions(
                $e->getCode() ?: 500,
                'Failed to append order: ' . $e->getMessage()
            );
        }
    }

    public function updateOrder(Order $order)
    {
        if (!$this->spreadSheetId) {
            throw new GoogleSheetsExceptions(404, 'Spreadsheet ID not found');
        }

        try {
            // Get all data from sheet
            $range = "{$this->spreadSheetName}!A:A";
            $response = $this->service->spreadsheets_values->get($this->spreadSheetId, $range);
            $values = $response->getValues();

            if (empty($values)) {
                throw new GoogleSheetsExceptions(404, 'No data found in spreadsheet');
            }

            // Find the row with this order ID
            $orderNumber = '#' . $order->order_number;
            $rowIndex = null;

            foreach ($values as $index => $row) {
                if (isset($row[0]) && $row[0] === $orderNumber) {
                    $rowIndex = $index + 1; // +1 because sheets are 1-indexed
                    break;
                }
            }

            if (!$rowIndex) {
                throw new GoogleSheetsExceptions(404, "Order #{$order->order_number} not found in sheet");
            }

            // Update the row
            $updateRange = "{$this->spreadSheetName}!A{$rowIndex}:L{$rowIndex}";
            $body = new Sheets\ValueRange([
                'values' => [$this->orderRowDataMaker($order)]
            ]);

            $this->service->spreadsheets_values->update(
                $this->spreadSheetId,
                $updateRange,
                $body,
                ['valueInputOption' => 'RAW']
            );

        } catch (GoogleServiceException $e) {
            throw new GoogleSheetsExceptions(
                $e->getCode() ?: 500,
                'Failed to update order: ' . $e->getMessage()
            );
        }
    }

    public function deleteOrder(Order $order)
    {
        if (!$this->spreadSheetId) {
            throw new GoogleSheetsExceptions(404, 'Spreadsheet ID not found');
        }

        try {
            // Get all data from sheet
            $range = "{$this->spreadSheetName}!A:A";
            $response = $this->service->spreadsheets_values->get($this->spreadSheetId, $range);
            $values = $response->getValues();

            if (empty($values)) {
                throw new GoogleSheetsExceptions(404, 'No data found in spreadsheet');
            }

            // Find the row with this order ID
            $orderNumber = '#' . $order->order_number;
            $rowIndex = null;

            foreach ($values as $index => $row) {
                if (isset($row[0]) && $row[0] === $orderNumber) {
                    $rowIndex = $index; // 0-indexed for deletion
                    break;
                }
            }

            if ($rowIndex === null) {
                throw new GoogleSheetsExceptions(404, "Order #{$order->order_number} not found in sheet");
            }

            // Get the sheet ID
            $spreadsheet = $this->service->spreadsheets->get($this->spreadSheetId);
            
            if (!$spreadsheet || !$spreadsheet->getSheets()) {
                throw new GoogleSheetsExceptions(404, 'Sheet not found');
            }

            $sheetId = $spreadsheet->getSheets()[0]->getProperties()->sheetId;

            // Delete the row
            $requests = [
                new Sheets\Request([
                    'deleteDimension' => [
                        'range' => [
                            'sheetId' => $sheetId,
                            'dimension' => 'ROWS',
                            'startIndex' => $rowIndex,
                            'endIndex' => $rowIndex + 1
                        ]
                    ]
                ])
            ];

            $batchUpdateRequest = new Sheets\BatchUpdateSpreadsheetRequest([
                'requests' => $requests
            ]);

            $this->service->spreadsheets->batchUpdate($this->spreadSheetId, $batchUpdateRequest);

        } catch (GoogleServiceException $e) {
            throw new GoogleSheetsExceptions(
                $e->getCode() ?: 500,
                'Failed to delete order: ' . $e->getMessage()
            );
        }
    }
}