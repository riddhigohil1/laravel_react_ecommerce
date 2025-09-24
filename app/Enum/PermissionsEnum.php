<?php

namespace App\Enum;

enum PermissionsEnum : string
{
    case ApproveVendors = 'ApproveVendors';
    case buyProducts = 'BuyProducts';
    case sellProducts = 'SellProducts';
}
