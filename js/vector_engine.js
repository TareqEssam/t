/****************************************************************************
 * 🧠 Vector Engine - محرك البحث الدلالي السحابي
 * يستهدف الملفات المرفوعة على GitHub وموديل Hugging Face
 ****************************************************************************/

import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

// إعدادات البيئة للعمل سحابياً 100%
env.allowLocalModels = false;
env.useBrowserCache = true;

class VectorEngine {
    constructor() {
        this.tokenizer = null;
        this.extractor = null;
        this.databases = {
            activities: null,
            industrial: null,
            decision104: null
        };
        this.isReady = false;
        
        // روابط الملفات على GitHub
        this.urls = {
            activities: 'https://tareqessam.github.io/t/data/activity_vectors_v5.json',
            industrial: 'https://tareqessam.github.io/t/data/industrial_vectors_v5.json',
            decision104: 'https://tareqessam.github.io/t/data/decision104_vectors_v5.json'
        };

        this.init();
    }

    async init() {
        console.log("🚀 جاري تهيئة محرك المتجهات السحابي...");
        try {
            // 1. تحميل موديل الذكاء الاصطناعي من Hugging Face
            this.extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            console.log("✅ تم تحميل موديل التشفير من Hugging Face");

            // 2. تحميل قواعد البيانات JSON بشكل متوازي لتوفير الوقت
            const loadTasks = Object.entries(this.urls).map(async ([key, url]) => {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Failed to load ${key}`);
                this.databases[key] = await response.json();
                console.log(`📦 تم تحميل قاعدة: ${key} (${(response.headers.get('content-length') / 1024).toFixed(1)} KB)`);
            });

            await Promise.all(loadTasks);
            this.isReady = true;
            console.log("🎯 محرك المتجهات جاهز للعمل بنسبة 100%");
            
            // إرسال حدث للنظام بأن المحرك جاهز
            window.dispatchEvent(new CustomEvent('vectorEngineReady'));

        } catch (error) {
            console.error("❌ فشل تهيئة المحرك:", error);
        }
    }

    // حساب التشابه الجيبي (Cosine Similarity)
    cosineSimilarity(vecA, vecB) {
        // فحص أمان: التأكد من أن المتجهات موجودة ولها نفس الطول
        if (!vecA || !vecB || vecA.length === 0 || vecA.length !== vecB.length) {
            return 0; 
        }
        
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        
        const denominator = Math.sqrt(normA) * Math.sqrt(normB);
        return denominator === 0 ? 0 : dotProduct / denominator;
    }

    async getVector(text) {
        const output = await this.extractor(text, { pooling: 'mean', normalize: true });
        return Array.from(output.data);
    }

    async search(query, limit = 5) {
        if (!this.isReady) return { error: "المحرك لا يزال قيد التحميل..." };

        const queryVector = await this.getVector(query);
        const results = {
            activities: [],
            industrial: [],
            decision104: []
        };

        // البحث في القواعد الثلاث
        for (const [key, db] of Object.entries(this.databases)) {
            if (!db || !db.data) continue;

            const scores = db.data
                .filter(item => item && item.vector) // إضافة هذا السطر لتصفية البيانات الناقصة
                .map(item => ({
                    ...item,
                    score: this.cosineSimilarity(queryVector, item.vector)
                }));

            // ترتيب حسب الأعلى تشابهاً وتصفية النتائج الضعيفة
            results[key] = scores
                .sort((a, b) => b.score - a.score)
                .slice(0, limit)
                .filter(r => r.score > 0.25); // عتبة القبول
        }

        return results;
    }
}

// تصدير نسخة واحدة ثابتة للنظام

window.vEngine = new VectorEngine();

