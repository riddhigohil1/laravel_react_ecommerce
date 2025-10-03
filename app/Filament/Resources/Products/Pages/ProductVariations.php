<?php

namespace App\Filament\Resources\Products\Pages;

use App\Filament\Resources\Products\ProductResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
use Filament\Schemas\Schema;
use BackedEnum;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Illuminate\Database\Eloquent\Model;

class ProductVariations extends EditRecord
{
    protected static string | BackedEnum | null $navigationIcon = 'heroicon-o-clipboard-document-list';

    protected static ?string $title = 'Variations';
    
    protected static ?string $navigationLabel = 'Variations'; 

    protected static string $resource = ProductResource::class;

    public function form(Schema $schema): Schema
    {
        $types = $this->record->variationTypes;
        $fields = [];

        foreach($types as $type)
        {
            $fields[] = Hidden::make('variation_type_'.($type->id).'.id');
            $fields[] = TextInput::make('variation_type_'.($type->id).'.name')
                        ->label($type->name)->readOnly();
        }

        return $schema
            ->components([
                Repeater::make('variations')
                    ->collapsible()
                    ->addable(false)
                    ->hiddenLabel()
                    ->defaultItems(1)
                    ->schema([
                        Section::make()
                            ->schema($fields)
                            ->columns(3)
                            ->columnSpan('full'),
                        TextInput::make('quantity')
                            ->label('Quantity')
                            ->numeric(),
                        TextInput::make('price')
                            ->label('Price')
                            ->numeric(),
                    ])
                    ->columns(2)
                    ->columnSpan(2)

            ]);
    }

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $variations = $this->record->variations->toArray();

        $data['variations'] = $this->mergeCartesianWithExisting($this->record->variationTypes, $variations);
        return $data;
    }

    private function mergeCartesianWithExisting($variationTypes, $existingData) : array
    {
        $defaultQuntity = $this->record->quantity;
        $defaultPrice = $this->record->price;
        $cartesianProduct = $this->cartesianProduct($variationTypes, $defaultQuntity, $defaultPrice);

        $mergedResult = [];

        foreach($cartesianProduct as $product){
            $optionIds = collect($product)
                            ->filter(fn($value, $key) => str_starts_with($key, 'variation_type_'))
                            ->map(fn($option) => $option['id'])
                            ->values()
                            ->toArray();

            $match = array_filter($existingData, function($existingOption) use ($optionIds){
                return $existingOption['variation_type_option_ids'] === $optionIds;
            });
            
            if(!empty($match))
            {
                $existingEntry = reset($match);
                $product['id']=$existingEntry['id'];
                $product['quantity'] = $existingEntry['quantity'];
                $product['price'] = $existingEntry['price'];
            }
            else{
                $product['quantity'] = $defaultQuntity;
                $product['price'] = $defaultPrice;
            }

            $mergedResult[] = $product;
        }

        return $mergedResult;
    }

    private function cartesianProduct($variationTypes, $defaultQuntity = null, $defaultPrice = null): array
    {
        $result = [[]];

        foreach($variationTypes as $index => $variationType)
        {
            $temp = [];

            foreach($variationType->options as $option)
            {
                foreach($result as $combination)
                {
                    $newCombination = $combination + [
                        'variation_type_'.($variationType->id) => [
                            'id'=>$option->id,
                            'name'=>$option->name,
                            'type'=>$variationType->name,
                        ],
                    ];

                    $temp[] = $newCombination;
                }
            }
            
            $result = $temp;
        }

        foreach($result as &$combination)
        {
            if(count($combination) === count($variationTypes))
            {
                $combination['quantity'] = $defaultQuntity;
                $combination['price'] = $defaultPrice;
            }
        }

        return $result;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        $formattedData = [];

        foreach($data['variations'] as $option)
        {
            $variationTypeOptionIds = [];

            foreach($this->record->variationTypes as $i => $variationType)
            {
                if(isset($option['variation_type_'.($variationType->id)]['id']))
                    $variationTypeOptionIds[] = $option['variation_type_'.($variationType->id)]['id'];
            }

            $quantity = $option['quantity'];
            $price = $option['price'];

            if(isset($option['id']))
            {
                $formattedData[] = [
                'id'=> $option['id'],
                'variation_type_option_ids' => $variationTypeOptionIds,
                'quantity' => $quantity,
                'price'=>$price,
                ];
            }
            else{
                $formattedData[] = [
                'variation_type_option_ids' => $variationTypeOptionIds,
                'quantity' => $quantity,
                'price'=>$price,
                ];
            }
            
        }

        $data['variations'] = $formattedData;

        return $data;
    }

    protected function handleRecordUpdate(Model $record, array $data): Model
    {
        $variations = $data['variations'];
        unset($data['variations']);

        $variations = collect($variations)->map(function ($variation){

            if(isset($variation['id']))
            {
                $varArr = [ 
                    'id'=>$variation['id'],
                    'variation_type_option_ids' => json_encode($variation['variation_type_option_ids']),
                    'quantity'=>$variation['quantity'],
                    'price'=>$variation['price']
                ];
            }
            else{
                $varArr = [ 
                    'variation_type_option_ids' => json_encode($variation['variation_type_option_ids']),
                    'quantity'=>$variation['quantity'],
                    'price'=>$variation['price']
                ];
            }
            return $varArr;
        })
        ->toArray();

        $record->variations()->upsert($variations, ['id'], ['variation_type_option_ids', 'quantity', 'price']);

        return $record;
    }
}
