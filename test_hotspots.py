import pandas as pd

# Load hotspots
hotspots_df = pd.read_csv('data/hotspots_identified.csv')
print(f"✓ Loaded {len(hotspots_df)} hotspots")

# Test the conversion logic
for idx, row in hotspots_df.head(3).iterrows():
    total_capital_str = str(row['Total_Capital']).replace(',', '.')
    pct_capital_str = str(row['Pct_Total_Capital']).replace(',', '.')
    
    try:
        capital_float = float(total_capital_str)
        pct_float = float(pct_capital_str)
        print(f"✓ Row {idx}: Capital={capital_float}, Pct={pct_float}")
    except Exception as e:
        print(f"✗ Row {idx} error: {e}")
