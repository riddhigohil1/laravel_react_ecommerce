<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{

    protected $fillable = [
        'name',
        'email',
        'store_name',
        'store_address',
        'user_id',
    ];
}
