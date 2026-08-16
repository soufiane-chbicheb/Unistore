<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessageController extends Controller
{
   public function index() {
        return Inertia::render("admin/pages/Messages/MessageManager") ; 
    }
}
