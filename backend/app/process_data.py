# process_data.py

import json
from google.cloud import firestore
import vertexai
from vertexai.vision_models import Image, MultiModalEmbeddingModel
from vertexai.language_models import TextEmbeddingModel

# --- CONFIGURATION ---
PROJECT_ID = "gms-agentspace"  # <--- THAY ĐỔI TẠI ĐÂY
LOCATION = "us-central1" # <--- THAY ĐỔI TẠI ĐÂY
FIRESTORE_COLLECTION = "searchai-products"

IMAGE_EMBEDDINGS_OUTPUT_FILE = "image_embeddings.jsonl" # Sử dụng .jsonl cho chuẩn
TEXT_EMBEDDINGS_OUTPUT_FILE = "text_embeddings.jsonl"

# --- INITIALIZE VERTEX AI ---
vertexai.init(project=PROJECT_ID, location=LOCATION)

firestore_client = firestore.Client(project=PROJECT_ID)
vision_model = MultiModalEmbeddingModel.from_pretrained("multimodalembedding")
text_model = TextEmbeddingModel.from_pretrained("textembedding-gecko@003")

def generate_image_embeddings():
    """
    Tải sản phẩm từ Firestore, tạo vector embedding cho ảnh,
    và lưu vào file JSONL.
    """
    products_ref = firestore_client.collection(FIRESTORE_COLLECTION)
    all_products = products_ref.stream()

    embeddings_list = []
    print("Bắt đầu tạo vector embedding cho hình ảnh...")

    for product in all_products:
        product_data = product.to_dict()
        product_id = product.id
        # Sử dụng trường 'main_image_url' đã được cập nhật
        image_url = product_data.get("main_image_url")

        if not image_url or not image_url.startswith("gs://"):
            print(f"Bỏ qua sản phẩm {product_id}: 'main_image_url' không hợp lệ hoặc thiếu.")
            continue

        try:
            model_name = product_data.get('model', 'N/A')
            print(f"Đang xử lý ảnh cho sản phẩm: {product_id} (Model: {model_name})")
            
            image = Image.load_from_gcs(gcs_uri=image_url)
            embeddings = vision_model.get_embeddings(image=image, dimension=1408) #
            
            embeddings_list.append({
                "id": product_id,
                "embedding": embeddings.image_embedding
            })
        except Exception as e:
            print(f"Lỗi khi xử lý sản phẩm {product_id}: {e}")

    with open(IMAGE_EMBEDDINGS_OUTPUT_FILE, "w") as f:
        for item in embeddings_list:
            f.write(json.dumps(item) + "\n")
    
    print(f"\nHoàn tất! Đã tạo {len(embeddings_list)} vector embedding hình ảnh.")
    print(f"Kết quả được lưu tại: {IMAGE_EMBEDDINGS_OUTPUT_FILE}")


def generate_text_embeddings():
    """
    Tải sản phẩm từ Firestore, tổng hợp thông tin thành văn bản,
    tạo vector embedding cho văn bản đó, và lưu vào file JSONL.
    """
    products_ref = firestore_client.collection(FIRESTORE_COLLECTION)
    all_products = products_ref.stream()

    embeddings_list = []
    print("\nBắt đầu tạo vector embedding cho văn bản...")

    for product in all_products:
        product_data = product.to_dict()
        product_id = product.id
        
        try:
            model_name = product_data.get('model', 'N/A')
            print(f"Đang xử lý văn bản cho sản phẩm: {product_id} (Model: {model_name})")

            # Tổng hợp thông tin thành một đoạn văn bản mô tả duy nhất
            tech_specs_str = ", ".join([f"{k}: {v}" for k, v in product_data.get("tech_specs", {}).items()])
            
            # Văn bản này sẽ được AI dùng để tìm kiếm và trả lời câu hỏi
            synthesized_text = (
                f"Mã model: {product_data.get('model', '')}. "
                f"Loại sản phẩm: {product_data.get('category_name', '')}. "
                f"Thông số chung: {product_data.get('general_specification', '')}. "
                f"Thông số kỹ thuật chi tiết: {tech_specs_str}. "
                f"Ghi chú: {product_data.get('remarks', '')}"
            )
            
            embeddings = text_model.get_embeddings([synthesized_text])
            
            embeddings_list.append({
                "id": product_id,
                "embedding": embeddings[0].values
            })
        except Exception as e:
            print(f"Lỗi khi xử lý sản phẩm {product_id}: {e}")

    with open(TEXT_EMBEDDINGS_OUTPUT_FILE, "w") as f:
        for item in embeddings_list:
            f.write(json.dumps(item) + "\n")

    print(f"\nHoàn tất! Đã tạo {len(embeddings_list)} vector embedding văn bản.")
    print(f"Kết quả được lưu tại: {TEXT_EMBEDDINGS_OUTPUT_FILE}")


if __name__ == "__main__":
    generate_image_embeddings()
    generate_text_embeddings()