<?php

namespace Database\Seeders;

use App\Models\AnimalType;
use App\Models\AttributeDefinition;
use App\Models\AttributeOption;
use App\Models\Pet;
use App\Models\PetAttribute;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PetSeeder extends Seeder
{
    private array $animalTypes;

    private int $userId;

    private array $attributeCache = [];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->loadDependencies();

        $dogId = $this->animalTypes['dog'];
        $catId = $this->animalTypes['cat'];
        $birdId = $this->animalTypes['bird'];
        $fishId = $this->animalTypes['fish'];
        $smallMammalId = $this->animalTypes['small_mammal'];

        // === PET 1: Rex - Chien énergique ===
        $rexId = DB::table('pets')->insertGetId([
            'user_id' => $this->userId,
            'animal_type_id' => $dogId,
            'name' => 'Rex',
            'breed' => 'Labrador Retriever',
            'birth_date' => '2020-05-15',
            'sex' => 'male',
            'weight' => 32.5,
            'is_sterilized' => true,
            'has_microchip' => true,
            'microchip_number' => '250269801234567',
            'adoption_date' => '2020-08-20',
            'about' => 'Chien très joueur et affectueux, adore les enfants et les longues promenades.',
            'health_notes' => 'Vaccination à jour, traitement anti-puces mensuel',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->addPetAttribute($rexId, 'energy_level', 'high');
        $this->addPetAttribute($rexId, 'potty_trained', 'trained');
        $this->addPetAttribute($rexId, 'friendly_with_kids', 'yes');
        $this->addPetAttribute($rexId, 'friendly_with_dogs', 'yes');
        $this->addPetAttribute($rexId, 'friendly_with_cats', 'unknown');
        $this->addPetAttribute($rexId, 'potty_break', '4h');
        $this->addPetAttribute($rexId, 'meal_schedule', 'morning_evening');
        $this->addPetAttribute($rexId, 'can_be_left_alone', '4h');

        // === PET 2: Minou - Chat d'intérieur ===
        $minouId = DB::table('pets')->insertGetId([
            'user_id' => $this->userId,
            'animal_type_id' => $catId,
            'name' => 'Minou',
            'breed' => 'Européen',
            'birth_date' => '2019-03-10',
            'sex' => 'female',
            'weight' => 4.2,
            'is_sterilized' => true,
            'has_microchip' => true,
            'microchip_number' => '250269801234568',
            'adoption_date' => '2019-06-15',
            'about' => 'Chatte calme et indépendante, préfère les endroits tranquilles.',
            'health_notes' => 'Allergique aux crevettes, vaccination à jour',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->addPetAttribute($minouId, 'energy_level', 'low');
        $this->addPetAttribute($minouId, 'litter_trained', 'trained');
        $this->addPetAttribute($minouId, 'friendly_with_kids', 'no');
        $this->addPetAttribute($minouId, 'friendly_with_dogs', 'no');
        $this->addPetAttribute($minouId, 'friendly_with_cats', 'yes');
        $this->addPetAttribute($minouId, 'meal_schedule', 'morning_evening');
        $this->addPetAttribute($minouId, 'can_be_left_alone', '8h_plus');
        $this->addPetAttribute($minouId, 'indoor_outdoor', 'indoor_only');
        $this->addPetAttributeBoolean($minouId, 'declawed', false);

        // === PET 3: Kiwi - Perruche bavarde ===
        $kiwiId = DB::table('pets')->insertGetId([
            'user_id' => $this->userId,
            'animal_type_id' => $birdId,
            'name' => 'Kiwi',
            'breed' => 'Perruche ondulée',
            'birth_date' => '2022-01-20',
            'sex' => 'male',
            'weight' => 0.04,
            'is_sterilized' => null,
            'has_microchip' => false,
            'adoption_date' => '2022-03-05',
            'about' => 'Perruche très sociable qui aime chanter et siffler.',
            'health_notes' => 'En bonne santé, vétérinaire aviaire consulté tous les 6 mois',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->addPetAttributeText($kiwiId, 'bird_species', 'Perruche ondulée');
        $this->addPetAttribute($kiwiId, 'can_fly', 'yes');
        $this->addPetAttributeBoolean($kiwiId, 'wings_clipped', false);
        $this->addPetAttribute($kiwiId, 'cage_type', 'medium');
        $this->addPetAttribute($kiwiId, 'noise_level', 'moderate');
        $this->addPetAttributeBoolean($kiwiId, 'can_talk', true);
        $this->addPetAttribute($kiwiId, 'friendly_with_kids', 'yes');
        $this->addPetAttribute($kiwiId, 'friendly_with_other_birds', 'yes');
        $this->addPetAttribute($kiwiId, 'meal_schedule', 'morning');
        $this->addPetAttributeText($kiwiId, 'diet_specifics', 'Mélange de graines, fruits frais (pomme, carotte)');

        // === PET 4: Bulle - Poisson rouge ===
        $bulleId = DB::table('pets')->insertGetId([
            'user_id' => $this->userId,
            'animal_type_id' => $fishId,
            'name' => 'Bulle',
            'breed' => 'Poisson rouge commun',
            'birth_date' => '2023-06-01',
            'sex' => 'unknown',
            'weight' => 0.05,
            'is_sterilized' => null,
            'has_microchip' => false,
            'adoption_date' => '2023-07-10',
            'about' => 'Poisson rouge actif et curieux.',
            'health_notes' => 'Aucun problème de santé',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->addPetAttribute($bulleId, 'water_type', 'freshwater');
        $this->addPetAttributeInteger($bulleId, 'tank_size_liters', 50);
        $this->addPetAttributeDecimal($bulleId, 'water_temperature', 20.0);
        $this->addPetAttribute($bulleId, 'compatible_with_other_fish', 'yes');
        $this->addPetAttributeText($bulleId, 'equipment_needed', 'Filtre, oxygénateur, éclairage');
        $this->addPetAttribute($bulleId, 'feeding_frequency', 'twice_daily');
        $this->addPetAttributeText($bulleId, 'diet_specifics', 'Granulés pour poissons rouges, légumes blanchis occasionnellement');

        // === PET 5: Caramel - Lapin nain ===
        $caramelId = DB::table('pets')->insertGetId([
            'user_id' => $this->userId,
            'animal_type_id' => $smallMammalId,
            'name' => 'Caramel',
            'breed' => 'Lapin nain bélier',
            'birth_date' => '2021-09-15',
            'sex' => 'female',
            'weight' => 1.8,
            'is_sterilized' => true,
            'has_microchip' => false,
            'adoption_date' => '2021-11-20',
            'about' => 'Lapine très douce et câline, adore se faire caresser.',
            'health_notes' => 'Dents contrôlées régulièrement par vétérinaire',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->addPetAttribute($caramelId, 'cage_type', 'enclosure');
        $this->addPetAttributeBoolean($caramelId, 'is_nocturnal', false);
        $this->addPetAttribute($caramelId, 'can_be_handled', 'yes_easily');
        $this->addPetAttribute($caramelId, 'bites_scratches', 'never');
        $this->addPetAttribute($caramelId, 'friendly_with_kids', 'yes');
        $this->addPetAttribute($caramelId, 'friendly_with_same_species', 'yes');
        $this->addPetAttribute($caramelId, 'meal_schedule', 'morning_evening');
        $this->addPetAttributeText($caramelId, 'diet_specifics', 'Foin à volonté, granulés, légumes frais (carottes, brocoli)');

        // === PET 6: Max - Chien âgé avec médicaments ===
        $maxId = DB::table('pets')->insertGetId([
            'user_id' => $this->userId,
            'animal_type_id' => $dogId,
            'name' => 'Max',
            'breed' => 'Berger Allemand',
            'birth_date' => '2015-02-10',
            'sex' => 'male',
            'weight' => 38.0,
            'is_sterilized' => true,
            'has_microchip' => true,
            'microchip_number' => '250269801234569',
            'adoption_date' => '2015-04-15',
            'about' => 'Chien calme et obéissant, excellent gardien.',
            'health_notes' => 'Arthrose au niveau des hanches, traitement quotidien',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->addPetAttribute($maxId, 'energy_level', 'low');
        $this->addPetAttribute($maxId, 'potty_trained', 'trained');
        $this->addPetAttribute($maxId, 'friendly_with_kids', 'yes');
        $this->addPetAttribute($maxId, 'friendly_with_dogs', 'yes');
        $this->addPetAttribute($maxId, 'friendly_with_cats', 'yes');
        $this->addPetAttribute($maxId, 'potty_break', '6h_plus');
        $this->addPetAttribute($maxId, 'meal_schedule', 'morning_evening');
        $this->addPetAttribute($maxId, 'can_be_left_alone', '8h_plus');
        $this->addPetAttributeText($maxId, 'medications', 'Anti-inflammatoires (1 comprimé matin), glucosamine (1 gélule soir)');

        // === PET 7: Luna - Chatte d'extérieur ===
        $lunaId = DB::table('pets')->insertGetId([
            'user_id' => $this->userId,
            'animal_type_id' => $catId,
            'name' => 'Luna',
            'breed' => 'Maine Coon',
            'birth_date' => '2021-07-22',
            'sex' => 'female',
            'weight' => 6.5,
            'is_sterilized' => true,
            'has_microchip' => true,
            'microchip_number' => '250269801234570',
            'adoption_date' => '2021-09-30',
            'about' => 'Grande chatte très active qui aime explorer l\'extérieur.',
            'health_notes' => 'Vaccination complète incluant rage, vermifugée régulièrement',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->addPetAttribute($lunaId, 'energy_level', 'high');
        $this->addPetAttribute($lunaId, 'litter_trained', 'trained');
        $this->addPetAttribute($lunaId, 'friendly_with_kids', 'yes');
        $this->addPetAttribute($lunaId, 'friendly_with_dogs', 'unknown');
        $this->addPetAttribute($lunaId, 'friendly_with_cats', 'no');
        $this->addPetAttribute($lunaId, 'meal_schedule', 'morning_evening');
        $this->addPetAttribute($lunaId, 'can_be_left_alone', '8h_plus');
        $this->addPetAttribute($lunaId, 'indoor_outdoor', 'outdoor_access');
        $this->addPetAttributeBoolean($lunaId, 'declawed', false);

        // === PET 8: Nemo - Poisson tropical ===
        $nemoId = DB::table('pets')->insertGetId([
            'user_id' => $this->userId,
            'animal_type_id' => $fishId,
            'name' => 'Nemo',
            'breed' => 'Poisson-clown',
            'birth_date' => '2023-03-15',
            'sex' => 'unknown',
            'weight' => 0.02,
            'is_sterilized' => null,
            'has_microchip' => false,
            'adoption_date' => '2023-05-01',
            'about' => 'Petit poisson-clown orange et blanc très photogénique.',
            'health_notes' => 'Sensible à la qualité de l\'eau',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->addPetAttribute($nemoId, 'water_type', 'saltwater');
        $this->addPetAttributeInteger($nemoId, 'tank_size_liters', 100);
        $this->addPetAttributeDecimal($nemoId, 'water_temperature', 26.0);
        $this->addPetAttribute($nemoId, 'compatible_with_other_fish', 'certain_types');
        $this->addPetAttributeText($nemoId, 'equipment_needed', 'Filtre puissant, chauffage, écumeur, éclairage LED, pierres vivantes');
        $this->addPetAttribute($nemoId, 'feeding_frequency', 'twice_daily');
        $this->addPetAttributeText($nemoId, 'diet_specifics', 'Granulés pour poissons marins, artémias congelées, algues nori');
    }

    private function loadDependencies(): void
    {
        $this->userId = User::where('email', 'user@orus.com')->value('id');
        if (! $this->userId) {
            throw new \RuntimeException('User with email user@orus.com not found. Run UsersSeeder first.');
        }

        $types = AnimalType::whereIn('code', ['dog', 'cat', 'bird', 'fish', 'small_mammal'])
            ->pluck('id', 'code')->toArray();

        if (count($types) !== 5) {
            throw new \RuntimeException('Missing animal types. Run AnimalTypeSeeder first.');
        }

        $this->animalTypes = $types;
    }

    private function getAttributeId(string $code): ?int
    {
        if (! isset($this->attributeCache[$code])) {
            $this->attributeCache[$code] = AttributeDefinition::where('code', $code)->value('id');
        }

        return $this->attributeCache[$code];
    }

    /**
     * Helper to add pet attribute with predefined option
     */
    private function addPetAttribute(int $petId, string $attributeCode, string $optionValue): void
    {
        $attributeId = $this->getAttributeId($attributeCode);
        if (! $attributeId) {
            return;
        }

        $optionId = AttributeOption::where('attribute_definition_id', $attributeId)
            ->where('value', $optionValue)
            ->value('id');

        if ($optionId) {
            PetAttribute::firstOrCreate([
                'pet_id' => $petId,
                'attribute_definition_id' => $attributeId,
            ], [
                'attribute_option_id' => $optionId,
            ]);
        }
    }

    /**
     * Helper to add pet attribute with text value
     */
    private function addPetAttributeText(int $petId, string $attributeCode, string $textValue): void
    {
        $attributeId = $this->getAttributeId($attributeCode);
        if (! $attributeId) {
            return;
        }

        PetAttribute::firstOrCreate([
            'pet_id' => $petId,
            'attribute_definition_id' => $attributeId,
        ], [
            'value_text' => $textValue,
        ]);
    }

    /**
     * Helper to add pet attribute with integer value
     */
    private function addPetAttributeInteger(int $petId, string $attributeCode, int $intValue): void
    {
        $attributeId = $this->getAttributeId($attributeCode);
        if (! $attributeId) {
            return;
        }

        PetAttribute::firstOrCreate([
            'pet_id' => $petId,
            'attribute_definition_id' => $attributeId,
        ], [
            'value_integer' => $intValue,
        ]);
    }

    /**
     * Helper to add pet attribute with decimal value
     */
    private function addPetAttributeDecimal(int $petId, string $attributeCode, float $decimalValue): void
    {
        $attributeId = $this->getAttributeId($attributeCode);
        if (! $attributeId) {
            return;
        }

        PetAttribute::firstOrCreate([
            'pet_id' => $petId,
            'attribute_definition_id' => $attributeId,
        ], [
            'value_decimal' => $decimalValue,
        ]);
    }

    /**
     * Helper to add pet attribute with boolean value
     */
    private function addPetAttributeBoolean(int $petId, string $attributeCode, bool $boolValue): void
    {
        $attributeId = $this->getAttributeId($attributeCode);
        if (! $attributeId) {
            return;
        }

        PetAttribute::firstOrCreate([
            'pet_id' => $petId,
            'attribute_definition_id' => $attributeId,
        ], [
            'value_boolean' => $boolValue,
        ]);
    }
}
