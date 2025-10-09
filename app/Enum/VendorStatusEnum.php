<?php

namespace App\Enum;

enum VendorStatusEnum : string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';
}
