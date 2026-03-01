import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# -------------------------
# REPRODUCIBILITY
# -------------------------
np.random.seed(42)

# -------------------------
# BASIC SETUP
# -------------------------
start_date = datetime(2024, 1, 1)
days = 365

# Dish popularity (relative weights)
dishes = {
    "Biryani": 1.5,
    "Paneer Butter Masala": 1.2,
    "Dosa": 1.0,
    "Burger": 1.3,
    "Pizza": 1.4
}

# Dish prices (₹)
dish_price = {
    "Biryani": 250,
    "Paneer Butter Masala": 220,
    "Dosa": 120,
    "Burger": 150,
    "Pizza": 300
}

# Festival calendar
festivals = {
    "2024-03-25": "Holi",
    "2024-10-31": "Diwali"
}

data = []

# -------------------------
# DATA GENERATION
# -------------------------
for i in range(days):
    current_date = start_date + timedelta(days=i)
    date_str = current_date.strftime("%Y-%m-%d")

    # Day type
    is_weekend = current_date.weekday() >= 5
    day_type = "Weekend" if is_weekend else "Weekday"

    # Festival logic
    festival = festivals.get(date_str, "None")
    is_festival = 0 if festival == "None" else 1

    # Unexpected surge (5% chance)
    unexpected_surge = np.random.choice([0, 1], p=[0.95, 0.05])

    # Base customer count
    if day_type == "Weekend":
        customers = np.random.randint(100, 140)
    else:
        customers = np.random.randint(60, 90)

    # Festival impact
    if is_festival:
        customers = int(customers * 1.3)

    # Sudden surge impact
    if unexpected_surge:
        customers = int(customers * 1.4)

    # Dish-level calculations
    for dish, popularity in dishes.items():
        quantity_sold = int(customers * 0.15 * popularity)

        # Preparation buffer
        prep_quantity = int(quantity_sold * np.random.uniform(1.05, 1.2))
        waste = prep_quantity - quantity_sold

        # Business metrics
        revenue = quantity_sold * dish_price[dish]
        waste_cost = waste * dish_price[dish] * 0.4  # raw material cost

        data.append([
            date_str,
            day_type,
            festival,
            is_festival,
            unexpected_surge,
            customers,
            dish,
            quantity_sold,
            prep_quantity,
            waste,
            revenue,
            waste_cost
        ])

# -------------------------
# CREATE DATAFRAME
# -------------------------
columns = [
    "date",
    "day_type",
    "festival",
    "is_festival",
    "unexpected_surge",
    "customers",
    "dish",
    "quantity_sold",
    "prep_quantity",
    "waste",
    "revenue",
    "waste_cost"
]

df = pd.DataFrame(data, columns=columns)

# Save to CSV
df.to_csv("synthetic_restaurant_data.csv", index=False)

print("✅ Synthetic restaurant dataset generated successfully!")
print(f"📊 Total rows: {len(df)}")
