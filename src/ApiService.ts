// src/ApiService.ts
import type { Message } from './SearchApp';

// THAY THẾ BẰNG URL CLOUD RUN CỦA BẠN
const API_BASE_URL = (window as any).VITE_API_BASE_URL;

/**
 * Gửi yêu cầu tìm kiếm bằng hình ảnh.
 * @param file - File ảnh người dùng đã chọn.
 * @returns - Dữ liệu kết quả tìm kiếm.
 */
export async function searchByImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/visual-search`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Gửi yêu cầu tìm kiếm bằng văn bản.
 * @param query - Chuỗi truy vấn của người dùng.
 */
export async function searchByText(query: string) {
    const response = await fetch(`${API_BASE_URL}/api/text-search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
}


/**
 * Gửi một câu hỏi chat follow-up.
 * @param productId - ID của sản phẩm đang được hỏi.
 * @param question - Câu hỏi của người dùng.
 * @returns - Câu trả lời từ AI.
 */
export async function postChatMessage(productId: string, question: string, history: Message[]) {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, question, history }),
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
}