# seed_firestore.py
import os
from google.cloud import firestore

# --- CONFIGURATION ---
PROJECT_ID = "gms-agentspace" # <--- THAY ĐỔI TẠI ĐÂY

# --- INITIALIZE CLIENT ---
db = firestore.Client(project=PROJECT_ID)
products_collection_ref = db.collection("searchai-products")

# --- SAMPLE DATA ---
sample_products = [
    {
      "model": "LK-MD-01",
      "main_image_url": "gs://searchai-product-image-storage/lk-md-01.jpg", # <--- THAY ĐỔI BUCKET NAME
      "general_specification": "Đèn đường module công suất cao, chống nước IP66.",
      "tech_specs": {
        "wattage_watt": 150,
        "dimensions": "250x120x60mm",
        "weight_kg": 2.5,
        "lumen": 18000
      },
      "casing_wholesale_prices": { "material_A": 12.50, "material_B": 10.80 },
      "casing_price_currency": "CNY",
      "remarks": "Thích hợp cho đường cao tốc và khu đô thị.",
      "category_id": "den_duong_module",
      "category_name": "Đèn đường module"
    },
    {
      "model": "LK-FL-05",
      "main_image_url": "gs://searchai-product-image-storage/lk-fl-05.jpg", # <--- THAY ĐỔI BUCKET NAME
      "general_specification": "Đèn pha LED sân vườn, góc chiếu rộng.",
      "tech_specs": {
        "wattage_watt": 50,
        "dimensions": "150x100x40mm",
        "weight_kg": 0.8,
        "lumen": 5000
      },
      "casing_wholesale_prices": { "material_C": 4.50 },
      "casing_price_currency": "CNY",
      "remarks": "Có thể tùy chọn màu ánh sáng vàng hoặc trắng.",
      "category_id": "den_pha_led",
      "category_name": "Đèn pha LED"
    }
]

def seed_data():
    """Adds sample products to the Firestore collection."""
    print(f"Bắt đầu thêm dữ liệu mẫu vào collection '{products_collection_ref.id}'...")
    for product_data in sample_products:
        # Dùng .add() để Firestore tự động tạo Document ID
        doc_ref = products_collection_ref.add(product_data)
        print(f"  > Đã thêm sản phẩm {product_data['model']} với ID: {doc_ref[1].id}")
    print("Hoàn tất việc thêm dữ liệu mẫu!")

if __name__ == "__main__":
    seed_data()