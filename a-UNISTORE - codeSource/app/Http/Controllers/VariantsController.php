<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VariantsController extends Controller
{
    //

    public function colors() {
        return Inertia::render('admin/pages/variants/ManageColors') ;
    }


    public function sizes() {
        return Inertia::render('admin/pages/variants/ManageSizes') ;
    }
}
