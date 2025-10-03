<?php

namespace App\Filament\Resources\Products\Pages;

use App\Enum\ProductVariationTypeEnum;
use App\Filament\Resources\Products\ProductResource;
use Filament\Actions\DeleteAction;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Resources\Pages\EditRecord;
use Filament\Schemas\Schema;
use BackedEnum;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;

class ProductVariationTypes extends EditRecord
{
    protected static string | BackedEnum | null $navigationIcon = 'heroicon-m-numbered-list';

    protected static ?string $title = 'Variation Types';
    
    protected static ?string $navigationLabel = 'Variation Types'; 

    protected static string $resource = ProductResource::class;

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Repeater::make('variationTypes')
                    ->relationship()
                    ->collapsible()
                    ->defaultItems(1)
                    ->addActionLabel('Add new variation type')
                    ->columns(2)
                    ->columnSpan(2)
                    ->hiddenLabel()
                    ->schema([
                        TextInput::make('name')
                            ->required(),
                        Select::make('type')
                            ->options(ProductVariationTypeEnum::labels())
                            ->required(),
                        Repeater::make('options')
                            ->relationship()
                            ->collapsible()
                            ->schema([
                                TextInput::make('name')
                                    ->columnSpan(2)
                                    ->required(),
                                SpatieMediaLibraryFileUpload::make('images')
                                    ->image()
                                    ->multiple()
                                    ->openable()
                                    ->panelLayout('grid')
                                    ->collection('images')
                                    ->reorderable()
                                    ->appendFiles()
                                    ->preserveFilenames()
                                    ->columnSpan(3)
                            ])
                            ->columnSpan(2),
                    ])
            ]);
    }

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

}
