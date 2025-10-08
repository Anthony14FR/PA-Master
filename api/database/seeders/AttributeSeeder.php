<?php

namespace Database\Seeders;

use App\Models\AnimalType;
use App\Models\AttributeAnimalType;
use App\Models\AttributeDefinition;
use App\Models\AttributeOption;
use Illuminate\Database\Seeder;

class AttributeSeeder extends Seeder
{
    private array $animalTypes;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->loadAnimalTypes();

        $dogId = $this->animalTypes['dog'];
        $catId = $this->animalTypes['cat'];
        $smallMammalId = $this->animalTypes['small_mammal'];
        $birdId = $this->animalTypes['bird'];
        $fishId = $this->animalTypes['fish'];
        $reptileId = $this->animalTypes['reptile'];
        $amphibianId = $this->animalTypes['amphibian'];
        $invertebrateId = $this->animalTypes['invertebrate'];

        // ========== COMMON ATTRIBUTES (Dogs & Cats) ==========
        $this->createAttribute('energy_level', 'Niveau d\'énergie', 'text', true, [$dogId, $catId], [
            ['value' => 'low', 'label' => 'Faible'],
            ['value' => 'medium', 'label' => 'Moyen'],
            ['value' => 'high', 'label' => 'Élevé'],
        ]);

        $this->createAttribute('potty_trained', 'Propreté (chien)', 'text', true, [$dogId], [
            ['value' => 'trained', 'label' => 'Propre'],
            ['value' => 'learning', 'label' => 'En apprentissage'],
            ['value' => 'to_determine', 'label' => 'À déterminer'],
        ]);

        $this->createAttribute('litter_trained', 'Propreté (chat)', 'text', true, [$catId], [
            ['value' => 'trained', 'label' => 'Propre'],
            ['value' => 'learning', 'label' => 'En apprentissage'],
            ['value' => 'to_determine', 'label' => 'À déterminer'],
        ]);

        $this->createAttribute('friendly_with_kids', 'Amical avec enfants', 'text', true, [$dogId, $catId, $smallMammalId, $birdId], [
            ['value' => 'yes', 'label' => 'Oui'],
            ['value' => 'no', 'label' => 'Non'],
            ['value' => 'unknown', 'label' => 'Inconnu'],
        ]);

        $this->createAttribute('friendly_with_dogs', 'Amical avec chiens', 'text', true, [$dogId, $catId], [
            ['value' => 'yes', 'label' => 'Oui'],
            ['value' => 'no', 'label' => 'Non'],
            ['value' => 'unknown', 'label' => 'Inconnu'],
        ]);

        $this->createAttribute('friendly_with_cats', 'Amical avec chats', 'text', true, [$dogId, $catId], [
            ['value' => 'yes', 'label' => 'Oui'],
            ['value' => 'no', 'label' => 'Non'],
            ['value' => 'unknown', 'label' => 'Inconnu'],
        ]);

        $this->createAttribute('potty_break', 'Fréquence pause pipi', 'text', true, [$dogId], [
            ['value' => '2h', 'label' => 'Toutes les 2h'],
            ['value' => '4h', 'label' => 'Toutes les 4h'],
            ['value' => '6h_plus', 'label' => '6h+'],
        ]);

        $this->createAttribute('meal_schedule', 'Horaires repas', 'text', true, [$dogId, $catId, $smallMammalId, $birdId], [
            ['value' => 'morning', 'label' => 'Matin'],
            ['value' => 'evening', 'label' => 'Soir'],
            ['value' => 'morning_evening', 'label' => 'Matin + Soir'],
            ['value' => 'free_feeding', 'label' => 'Libre-service'],
        ]);

        $this->createAttribute('can_be_left_alone', 'Peut être laissé seul', 'text', true, [$dogId, $catId], [
            ['value' => '1h', 'label' => '1h max'],
            ['value' => '4h', 'label' => '4h'],
            ['value' => '8h_plus', 'label' => '8h+'],
            ['value' => 'never', 'label' => 'Jamais'],
        ]);

        $this->createAttribute('medications', 'Médicaments', 'text', false, [$dogId, $catId]);

        // ========== CAT-SPECIFIC ATTRIBUTES ==========
        $this->createAttribute('indoor_outdoor', 'Intérieur/Extérieur', 'text', true, [$catId], [
            ['value' => 'indoor_only', 'label' => 'Intérieur uniquement'],
            ['value' => 'outdoor_access', 'label' => 'Accès extérieur'],
            ['value' => 'outdoor', 'label' => 'Extérieur'],
        ]);

        $this->createAttribute('declawed', 'Griffes retirées', 'boolean', false, [$catId]);

        // ========== SMALL MAMMALS ATTRIBUTES ==========
        $this->createAttribute('cage_type', 'Type de cage', 'text', true, [$smallMammalId, $birdId], [
            ['value' => 'small', 'label' => 'Petite'],
            ['value' => 'medium', 'label' => 'Moyenne'],
            ['value' => 'large', 'label' => 'Grande'],
            ['value' => 'enclosure', 'label' => 'Enclos'],
            ['value' => 'aviary', 'label' => 'Volière'],
        ]);

        $this->createAttribute('is_nocturnal', 'Nocturne', 'boolean', false, [$smallMammalId]);

        $this->createAttribute('can_be_handled', 'Peut être manipulé', 'text', true, [$smallMammalId], [
            ['value' => 'yes_easily', 'label' => 'Oui facilement'],
            ['value' => 'yes_with_care', 'label' => 'Oui avec précaution'],
            ['value' => 'no_fearful', 'label' => 'Non/craintif'],
        ]);

        $this->createAttribute('bites_scratches', 'Mord/griffe', 'text', true, [$smallMammalId], [
            ['value' => 'never', 'label' => 'Jamais'],
            ['value' => 'rarely', 'label' => 'Rarement'],
            ['value' => 'often', 'label' => 'Souvent'],
        ]);

        $this->createAttribute('friendly_with_same_species', 'Amical avec congénères', 'text', true, [$smallMammalId], [
            ['value' => 'yes', 'label' => 'Oui'],
            ['value' => 'no', 'label' => 'Non'],
            ['value' => 'unknown', 'label' => 'Inconnu'],
        ]);

        $this->createAttribute('diet_specifics', 'Régime alimentaire spécifique', 'text', false, [$smallMammalId, $birdId, $fishId]);

        // ========== BIRD ATTRIBUTES ==========
        $this->createAttribute('bird_species', 'Espèce', 'text', false, [$birdId]);

        $this->createAttribute('can_fly', 'Peut voler', 'text', true, [$birdId], [
            ['value' => 'yes', 'label' => 'Oui'],
            ['value' => 'no_clipped', 'label' => 'Non - ailes coupées'],
            ['value' => 'limited', 'label' => 'Vol limité'],
        ]);

        $this->createAttribute('wings_clipped', 'Ailes coupées', 'boolean', false, [$birdId]);

        $this->createAttribute('noise_level', 'Niveau sonore', 'text', true, [$birdId], [
            ['value' => 'quiet', 'label' => 'Silencieux'],
            ['value' => 'moderate', 'label' => 'Modéré'],
            ['value' => 'loud', 'label' => 'Bruyant'],
            ['value' => 'very_loud', 'label' => 'Très bruyant'],
        ]);

        $this->createAttribute('can_talk', 'Peut parler', 'boolean', false, [$birdId]);

        $this->createAttribute('friendly_with_other_birds', 'Amical avec autres oiseaux', 'text', true, [$birdId], [
            ['value' => 'yes', 'label' => 'Oui'],
            ['value' => 'no', 'label' => 'Non'],
            ['value' => 'unknown', 'label' => 'Inconnu'],
        ]);

        // ========== FISH ATTRIBUTES ==========
        $this->createAttribute('water_type', 'Type d\'eau', 'text', true, [$fishId], [
            ['value' => 'freshwater', 'label' => 'Eau douce'],
            ['value' => 'saltwater', 'label' => 'Eau salée'],
            ['value' => 'brackish', 'label' => 'Eau saumâtre'],
        ]);

        $this->createAttribute('tank_size_liters', 'Taille aquarium (litres)', 'integer', false, [$fishId]);

        $this->createAttribute('water_temperature', 'Température de l\'eau (°C)', 'decimal', false, [$fishId]);

        $this->createAttribute('compatible_with_other_fish', 'Compatible avec autres poissons', 'text', true, [$fishId], [
            ['value' => 'yes', 'label' => 'Oui'],
            ['value' => 'certain_types', 'label' => 'Certains types'],
            ['value' => 'no_aggressive', 'label' => 'Non - agressif'],
        ]);

        $this->createAttribute('equipment_needed', 'Équipement nécessaire', 'text', false, [$fishId]);

        $this->createAttribute('feeding_frequency', 'Fréquence repas', 'text', true, [$fishId, $reptileId, $amphibianId, $invertebrateId], [
            ['value' => 'once_daily', 'label' => '1x/jour'],
            ['value' => 'twice_daily', 'label' => '2x/jour'],
            ['value' => 'every_2_days', 'label' => 'Tous les 2 jours'],
            ['value' => 'twice_weekly', 'label' => '2-3x/semaine'],
            ['value' => 'weekly', 'label' => '1x/semaine'],
            ['value' => 'biweekly', 'label' => '1x/2 semaines'],
        ]);

        // ========== REPTILE ATTRIBUTES ==========
        $this->createAttribute('reptile_species', 'Espèce', 'text', false, [$reptileId]);

        $this->createAttribute('terrarium_type', 'Type de terrarium', 'text', true, [$reptileId], [
            ['value' => 'desert', 'label' => 'Désertique'],
            ['value' => 'tropical', 'label' => 'Tropical'],
            ['value' => 'aqua_terrarium', 'label' => 'Aqua-terrarium'],
        ]);

        $this->createAttribute('temperature_range', 'Plage de température', 'text', false, [$reptileId, $amphibianId, $invertebrateId]);

        $this->createAttribute('humidity_level', 'Niveau d\'humidité', 'text', true, [$reptileId, $amphibianId, $invertebrateId], [
            ['value' => 'low', 'label' => 'Faible (30-40%)'],
            ['value' => 'medium', 'label' => 'Moyen (50-60%)'],
            ['value' => 'high', 'label' => 'Élevé (70-80%)'],
        ]);

        $this->createAttribute('is_venomous', 'Venimeux', 'boolean', false, [$reptileId, $invertebrateId]);

        $this->createAttribute('diet_type', 'Type d\'alimentation', 'text', true, [$reptileId, $amphibianId, $invertebrateId], [
            ['value' => 'insects', 'label' => 'Insectes'],
            ['value' => 'rodents', 'label' => 'Rongeurs'],
            ['value' => 'vegetarian', 'label' => 'Végétarien'],
            ['value' => 'omnivore', 'label' => 'Omnivore'],
            ['value' => 'carnivore', 'label' => 'Carnivore'],
            ['value' => 'worms', 'label' => 'Vers'],
            ['value' => 'detritivore', 'label' => 'Détritivore'],
        ]);

        $this->createAttribute('requires_live_food', 'Nécessite nourriture vivante', 'boolean', false, [$reptileId, $amphibianId, $invertebrateId]);

        $this->createAttribute('uv_light_needed', 'Lampe UV nécessaire', 'boolean', false, [$reptileId]);

        // ========== AMPHIBIAN ATTRIBUTES ==========
        $this->createAttribute('amphibian_species', 'Espèce', 'text', false, [$amphibianId]);

        $this->createAttribute('habitat_type', 'Type d\'habitat', 'text', true, [$amphibianId, $invertebrateId], [
            ['value' => 'aquatic', 'label' => 'Aquatique'],
            ['value' => 'semi_aquatic', 'label' => 'Semi-aquatique'],
            ['value' => 'terrestrial', 'label' => 'Terrestre'],
            ['value' => 'dry_terrarium', 'label' => 'Terrarium sec'],
            ['value' => 'humid_terrarium', 'label' => 'Terrarium humide'],
            ['value' => 'aquarium', 'label' => 'Aquarium'],
        ]);

        $this->createAttribute('is_aquatic', 'Aquatique', 'boolean', false, [$amphibianId]);

        $this->createAttribute('water_quality_requirements', 'Exigences qualité eau', 'text', false, [$amphibianId]);

        // ========== INVERTEBRATE ATTRIBUTES ==========
        $this->createAttribute('invertebrate_species', 'Espèce', 'text', false, [$invertebrateId]);

        $this->createAttribute('molting_frequency', 'Fréquence de mue', 'text', true, [$invertebrateId], [
            ['value' => 'never', 'label' => 'Jamais'],
            ['value' => 'annual', 'label' => 'Annuelle'],
            ['value' => 'monthly', 'label' => 'Mensuelle'],
            ['value' => 'weekly', 'label' => 'Hebdomadaire'],
        ]);
    }

    private function loadAnimalTypes(): void
    {
        $types = AnimalType::whereIn('code', [
            'dog',
            'cat',
            'small_mammal',
            'bird',
            'fish',
            'reptile',
            'amphibian',
            'invertebrate',
        ])->pluck('id', 'code')->toArray();

        if (count($types) !== 8) {
            throw new \RuntimeException('Missing animal types. Run AnimalTypeSeeder first.');
        }

        $this->animalTypes = $types;
    }

    /**
     * Helper to create attribute with options
     */
    private function createAttribute(string $code, string $label, string $valueType, bool $hasPredefinedOptions, array $animalTypeIds, array $options = []): void
    {
        $attribute = AttributeDefinition::firstOrCreate(
            ['code' => $code],
            [
                'label' => $label,
                'value_type' => $valueType,
                'has_predefined_options' => $hasPredefinedOptions,
                'is_required' => false,
                'validation_rules' => null,
            ]
        );

        foreach ($animalTypeIds as $animalTypeId) {
            AttributeAnimalType::firstOrCreate([
                'attribute_definition_id' => $attribute->id,
                'animal_type_id' => $animalTypeId,
            ]);
        }

        if ($hasPredefinedOptions && ! empty($options)) {
            foreach ($options as $index => $option) {
                AttributeOption::firstOrCreate(
                    [
                        'attribute_definition_id' => $attribute->id,
                        'value' => $option['value'],
                    ],
                    [
                        'label' => $option['label'],
                        'sort_order' => $index,
                    ]
                );
            }
        }
    }
}
