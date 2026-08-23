<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

use Illuminate\Support\Facades\DB;

$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$types = DB::table('home_layout_orcs')->distinct()->pluck('sortable_type');

echo "Distinct sortable_type values in home_layout_orcs:\n";
foreach ($types as $type) {
    echo "- $type\n";
}
