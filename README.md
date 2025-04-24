# 📘 Dokumentasi API - RAG Endpoint

## 🔹 1. `POST /api/rag/ingest`

Mengunggah dan meng-*ingest* dokumen `.txt` ke dalam sistem untuk digunakan sebagai referensi jawaban.

### 🔸 Form Data:

| Field | Tipe      | Wajib | Keterangan         |
|-------|-----------|-------|--------------------|
| file  | File (.txt) | ❌ (Opsional) | Dokumen teks yang ingin diunggah |

### 🔸 Contoh cURL:
```bash
curl -X POST http://localhost:3000/api/ingest -F "file=@./sample.txt"
```

### 🔸 Response:
```json
{
  "status": "ok",
  "inserted": 1,
  "ingested": 3,
  "files": ["ai.txt", "blockchain.txt", "sample.txt"]
}
```

---

## 🔹 2. `POST /api/rag/retrieve`

Mengambil konteks dari dokumen yang paling relevan dengan pertanyaan yang diberikan.

### 🔸 Request Body (JSON):

| Field    | Tipe   | Wajib | Keterangan                         |
|----------|--------|-------|------------------------------------|
| question | string | ✅    | Pertanyaan yang ingin dijawab     |

### 🔸 Contoh:
```json
{
  "question": "Apa itu Blockchain?"
}
```

### 🔸 Response:
```json
{
  "context": ["Blockchain adalah sebuah konsep ledger virtual..."],
  "matched": ["blockchain.txt"]
}
```

---

## 🔹 3. `POST /api/rag/generate`

Menghasilkan jawaban berbasis dokumen yang relevan terhadap pertanyaan.

### 🔸 Request Body (JSON):

| Field    | Tipe   | Wajib | Keterangan                         |
|----------|--------|-------|------------------------------------|
| question | string | ✅    | Pertanyaan yang ingin dijawab     |

### 🔸 Contoh:
```json
{
  "question": "Jelaskan konsep blockchain"
}
```

### 🔸 Response:
```json
{
  "answer": "Blockchain adalah teknologi penyimpanan data terdistribusi...",
  "context": ["blockchain.txt"]
}
```

---

## ⚠️ Catatan

- File yang diterima hanya **`.txt`**
- Pertanyaan tanpa dokumen akan menampilkan error atau respons fallback
- Semua data dokumen hanya disimpan di memori sementara (non-persistent)
