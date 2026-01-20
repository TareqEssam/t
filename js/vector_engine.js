/****************************************************************************
 * 🧠 Vector Engine - محرك البحث الدلالي السحابي (نسخة الإصلاح النهائي)
 * يتوافق مع هيكلية بيانات v5-lean (data -> vectors -> primary)
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
            activities: { vectors: [] },
            industrial: { vectors: [] },
            decision104: { vectors: [] }
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
        console.log("🚀 جاري تهيئة محرك المتجهات والتحقق من بنية البيانات...");
        try {
            // 1. تحميل موديل الذكاء الاصطناعي من Hugging Face
            this.extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            console.log("✅ تم تحميل موديل التشفير بنجاح");

            // 2. تحميل وقراءه قواعد البيانات ومعالجة هيكلية v5-lean
            const loadTasks = Object.entries(this.urls).map(async ([key, url]) => {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`فشل تحميل قاعدة: ${key}`);
                
                const json = await response.json();
                let vectorArray = [];

                // 🔥 الإصلاح الشامل: يدعم جميع الهياكل
if (json.data && Array.isArray(json.data)) {
    vectorArray = json.data.map(item => {
        let vector = null;
        
        // 1. أولاً: الهيكل الجديد (vectors.primary)
        if (item.vectors && item.vectors.primary) {
            vector = item.vectors.primary;
        }
        // 2. ثانياً: الهيكل المباشر (vector) - هذا ما تحتاجه ملفاتك
        else if (item.vector) {
            vector = item.vector;
        }
        // 3. ثالثاً: دعم الهياكل الأخرى
        else if (item.embedding) {
            vector = item.embedding;
        }
        
        return vector ? { id: item.id, vector } : null;
    }).filter(item => item !== null && item.vector !== null);
    
    console.log(`✅ قاعدة [${key}]: تم استخراج ${vectorArray.length} متجهة (الهيكل: ${vectorArray.length > 0 ? 'مباشر' : 'فارغ'})`);
}

                this.databases[key].vectors = vectorArray;
                console.log(`📦 قاعدة [${key}]: تم استخراج ${vectorArray.length} متجهة بنجاح.`);
            });

            await Promise.all(loadTasks);
            this.isReady = true;
            console.log("🎯 نظام البحث الدلالي جاهز تماماً للعمل.");
            
            // إرسال حدث للنظام بأن المحرك جاهز
            window.dispatchEvent(new CustomEvent('vectorEngineReady'));

        } catch (error) {
            console.error("❌ فشل تهيئة المحرك أو قراءة البيانات:", error);
        }
    }

    // حساب التشابه الجيبي (Cosine Similarity) بدقة عالية
    cosineSimilarity(vecA, vecB) {
        if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
        
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

    // تحويل النص المدخل إلى متجه رقمي
    async getVector(text) {
        const output = await this.extractor(text, { pooling: 'mean', normalize: true });
        return Array.from(output.data);
    }

    async search(query, limit = 10) {
        if (!this.isReady) {
            console.warn("⚠️ المحرك لم ينتهِ من تحميل البيانات بعد.");
            return { activities: [], industrial: [], decision104: [] };
        }

        const queryVector = await this.getVector(query);
        const results = {
            activities: [],
            industrial: [],
            decision104: []
        };

        // البحث في القواعد الثلاث
        for (const [key, db] of Object.entries(this.databases)) {
            if (!db.vectors || db.vectors.length === 0) continue;

            const scores = db.vectors.map(item => ({
                id: item.id,
                score: this.cosineSimilarity(queryVector, item.vector)
            }));

            // ترتيب حسب الأعلى تشابهاً وتصفية النتائج الضعيفة جداً
            results[key] = scores
                .sort((a, b) => b.score - a.score)
                .slice(0, limit)
                .filter(r => r.score > 0.15); // عتبة قبول مرنة للبحث الوصفي
        }

        return results;
    }
}

// تصدير النسخة للمجال العام لضمان عمل app.js و neural_search
window.vEngine = new VectorEngine();

