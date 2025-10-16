<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VendorUserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */

    
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id ,
            'name' => $this->name,
            'email' => $this->email,
            'store_name' => $this->store_name,
            'store_address' => $this->store_address,
        ];
    }
}
