import csv
import os
import random
import math

DESTINATIONS = {
    "Goa": {"base_dist": 600, "hotel_tier": 1.1, "activity_avg": 900},
    "Manali": {"base_dist": 800, "hotel_tier": 1.0, "activity_avg": 850},
    "Kerala": {"base_dist": 1000, "hotel_tier": 1.15, "activity_avg": 800},
    "Jaipur": {"base_dist": 400, "hotel_tier": 1.0, "activity_avg": 700},
    "Ladakh": {"base_dist": 1200, "hotel_tier": 1.3, "activity_avg": 1400},
    "Varanasi": {"base_dist": 700, "hotel_tier": 0.85, "activity_avg": 500},
    "Andaman": {"base_dist": 1600, "hotel_tier": 1.35, "activity_avg": 1600},
    "Udaipur": {"base_dist": 500, "hotel_tier": 1.2, "activity_avg": 950},
    "Rishikesh": {"base_dist": 350, "hotel_tier": 0.9, "activity_avg": 1100},
    "Bali": {"base_dist": 3500, "hotel_tier": 1.4, "activity_avg": 1800},
    "Dubai": {"base_dist": 2800, "hotel_tier": 1.8, "activity_avg": 2500},
    "Paris": {"base_dist": 7000, "hotel_tier": 2.5, "activity_avg": 3500},
    "Singapore": {"base_dist": 3800, "hotel_tier": 2.1, "activity_avg": 2800},
}

HOTEL_BASE = {
    1: 1200,
    2: 2400,
    3: 4200,
    4: 8500,
    5: 18000,
}

TRANSPORT_BASE = {
    "Flight": 4500,
    "Train": 1200,
    "Bus": 800,
    "Car": 1800,
}

SEASONS = {
    "Peak": 1.3,
    "Shoulder": 1.0,
    "Off-Peak": 0.8,
}

FOOD_PREF = {
    "Vegetarian": 750,
    "Non-Veg": 1100,
    "Fine Dining": 2800,
    "Street Food": 500,
}

TRAVEL_STYLES = {
    "Budget": 0.85,
    "Moderate": 1.0,
    "Luxury": 1.45,
}

def generate_data(num_samples=6000, output_path=None):
    if output_path is None:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        output_path = os.path.join(base_dir, "travel_budget_dataset.csv")
        
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    random.seed(42)

    headers = [
        "destination",
        "duration_days",
        "travelers",
        "hotel_rating",
        "transportation",
        "season",
        "activities_count",
        "food_preference",
        "travel_style",
        "total_budget"
    ]

    records = []
    dest_names = list(DESTINATIONS.keys())

    for _ in range(num_samples):
        dest = random.choice(dest_names)
        dest_meta = DESTINATIONS[dest]

        duration = random.randint(2, 14)
        travelers = random.randint(1, 8)
        hotel_rating = random.choice([1, 2, 3, 4, 5])
        
        if dest_meta["base_dist"] > 2000:
            transport = "Flight"
        else:
            transport = random.choices(["Flight", "Train", "Bus", "Car"], weights=[0.45, 0.3, 0.15, 0.1])[0]

        season = random.choice(list(SEASONS.keys()))
        activities_count = random.randint(1, duration * 3)
        food_pref = random.choice(list(FOOD_PREF.keys()))
        travel_style = random.choice(list(TRAVEL_STYLES.keys()))

        # Calculate cost
        rooms = math.ceil(travelers / 2)
        nights = max(1, duration - 1)
        
        base_t = TRANSPORT_BASE[transport]
        if transport == "Flight" and dest_meta["base_dist"] > 2000:
            base_t = base_t * (dest_meta["base_dist"] / 1000) * 1.8
        transport_cost = base_t * 2 * travelers

        hotel_nightly = HOTEL_BASE[hotel_rating] * dest_meta["hotel_tier"] * SEASONS[season]
        hotel_total = hotel_nightly * nights * rooms

        food_daily = FOOD_PREF[food_pref]
        food_total = food_daily * duration * travelers

        activity_unit = dest_meta["activity_avg"]
        activities_total = activities_count * activity_unit * travelers

        misc_cost = (400 * duration * travelers)

        subtotal = (transport_cost + hotel_total + food_total + activities_total + misc_cost)
        total = subtotal * TRAVEL_STYLES[travel_style]

        noise = random.uniform(0.94, 1.06)
        final_budget = round(total * noise, -1)

        records.append([
            dest,
            duration,
            travelers,
            hotel_rating,
            transport,
            season,
            activities_count,
            food_pref,
            travel_style,
            int(final_budget)
        ])

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(records)

    print(f"Generated {len(records)} realistic travel budget records in {output_path}")

if __name__ == "__main__":
    generate_data()
