/****************************************************************************
 * 🧠 Vector Engine V2 - محرك البحث الدلالي الذكي المتطور
 * ════════════════════════════════════════════════════════════════════════════
 * ✨ التحسينات الجوهرية:
 * - Re-ranking ذكي للنتائج
 * - استخراج كيانات تلقائي (Auto-NER)
 * - نظام تعلم من التفاعلات
 * - بحث متعدد الاستراتيجيات
 * - ثقة ديناميكية (لا عتبات ثابتة)
 ****************************************************************************/

import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

// إعدادات البيئة
env.allowLocalModels = false;
env.useBrowserCache = true;

class VectorEngineV2 {
    constructor() {
        this.extractor = null;
        this.databases = {
            activities: { vectors: [], metadata: [] },
            industrial: { vectors: [], metadata: [] },
            decision104: { vectors: [], metadata: [] }
        };
        this.isReady = false;
        
        // روابط البيانات
        this.urls = {
            activities: 'https://tareqessam.github.io/t/data/activity_vectors_v5.json',
            industrial: 'https://tareqessam.github.io/t/data/industrial_vectors_v5.json',
            decision104: 'https://tareqessam.github.io/t/data/decision104_vectors_v5.json'
        };
        
        // ═══════════ نظام التعلم ═══════════
        this.learningSystem = {
            successfulQueries: new Map(), // الاستعلامات الناجحة
            entityPatterns: new Map(),    // أنماط الكيانات المكتشفة
            confidenceHistory: [],        // تاريخ الثقة
            userFeedback: new Map()       // ملاحظات المستخدم
        };
        
        this.init();
    }
    
    async init() {
        console.log("🚀 تهيئة محرك البحث الذكي V2...");
        try {
            // تحميل النموذج الدلالي
            this.extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            console.log("✅ النموذج الدلالي جاهز");
            
            // تحميل قواعد البيانات
            await this.loadDatabases();
            
            this.isReady = true;
            console.log("✅ محرك البحث جاهز للعمل");
            
            window.dispatchEvent(new CustomEvent('vectorEngineReady'));
        } catch (error) {
            console.error("❌ فشل التهيئة:", error);
        }
    }
    
    async loadDatabases() {
        const tasks = Object.entries(this.urls).map(async ([key, url]) => {
            try {
                console.log(`⏳ تحميل ${key} من: ${url}`);
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`فشل التحميل: ${response.status} ${response.statusText}`);
                }
                
                const json = await response.json();
                let vectorArray = [];
                
                // 🔥 معالجة دقيقة للهيكل
                console.log(`🔍 فحص بنية ${key}:`, Object.keys(json));
                
                // هيكل v5-lean: { data: [{id, vectors: {primary}}] }
                if (json.data && Array.isArray(json.data)) {
                    vectorArray = json.data
                        .map(item => {
                            // التحقق من وجود المتجه
                            const vector = item.vectors?.primary || item.vector;
                            if (!vector) {
                                console.warn(`⚠️ عنصر بدون متجه: ${item.id}`);
                                return null;
                            }
                            return {
                                id: item.id,
                                vector: vector
                            };
                        })
                        .filter(item => item !== null);
                }
                // هيكل قديم: { vectors: [...] }
                else if (json.vectors && Array.isArray(json.vectors)) {
                    vectorArray = json.vectors.filter(item => item.vector);
                }
                // هيكل مباشر: [...{id, vector}]
                else if (Array.isArray(json)) {
                    vectorArray = json.filter(item => item.vector);
                }
                else {
                    console.error(`❌ بنية غير معروفة في ${key}:`, json);
                }
                
                this.databases[key].vectors = vectorArray;
                console.log(`✅ [${key}]: ${vectorArray.length} متجه تم تحميله`);
                
                if (vectorArray.length === 0) {
                    console.error(`❌ تحذير: ${key} فارغ! تحقق من ملف JSON`);
                }
            } catch (error) {
                console.error(`❌ خطأ حرج في تحميل ${key}:`, error);
                console.error(`   الرابط: ${url}`);
            }
        });
        
        await Promise.all(tasks);
        
        // تقرير نهائي
        console.log(`\n📊 ملخص التحميل:`);
        Object.entries(this.databases).forEach(([key, db]) => {
            const status = db.vectors.length > 0 ? '✅' : '❌';
            console.log(`   ${status} ${key}: ${db.vectors.length} متجه`);
        });
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🎯 البحث الذكي المتعدد الطبقات
     * ═══════════════════════════════════════════════════════════════
     */
    async intelligentSearch(query, options = {}) {
        const {
            limit = 10,
            minScore = 0.15,
            useReranking = true,
            useNER = true,
            useContext = true
        } = options;
        
        if (!this.isReady) {
            console.warn("⚠️ المحرك غير جاهز");
            return { activities: [], industrial: [], decision104: [] };
        }
        
        console.log(`\n${'═'.repeat(60)}`);
        console.log(`🔍 بحث ذكي: "${query}"`);
        console.log(`${'═'.repeat(60)}\n`);
        
        // ─────── الطبقة 1: استخراج الكيانات التلقائي ───────
        const entities = useNER ? await this.autoExtractEntities(query) : [];
        if (entities.length > 0) {
            console.log(`📌 كيانات مكتشفة:`, entities);
        }
        
        // ─────── الطبقة 2: البحث الدلالي الأساسي ───────
        const queryVector = await this.getVector(query);
        const baseResults = this.vectorSearch(queryVector, limit, minScore);
        
        // ─────── الطبقة 3: البحث المعزز بالكيانات ───────
        const entityResults = await this.entityEnhancedSearch(entities, limit);
        
        // ─────── الطبقة 4: دمج ذكي للنتائج ───────
        const mergedResults = this.intelligentMerge(baseResults, entityResults);
        
        // ─────── الطبقة 5: Re-ranking ذكي ───────
        const finalResults = useReranking 
            ? await this.rerank(mergedResults, query, entities)
            : mergedResults;
        
        // ─────── الطبقة 6: التعلم من الاستعلام ───────
        this.learnFromQuery(query, finalResults);
        
        return finalResults;
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🤖 استخراج الكيانات التلقائي (Auto-NER)
     * ═══════════════════════════════════════════════════════════════
     */
    async autoExtractEntities(text) {
        const entities = [];
        
        // استخراج الأرقام (مثل 104)
        const numbers = text.match(/\d+/g);
        if (numbers) {
            numbers.forEach(num => {
                if (num === '104') {
                    entities.push({ type: 'decision', value: num, text: 'قرار 104' });
                }
            });
        }
        
        // استخراج المحافظات (نمط ذكي)
        const governoratePatterns = [
            'القاهرة', 'الإسكندرية', 'الجيزة', 'القليوبية', 'الشرقية',
            'الدقهلية', 'البحيرة', 'المنوفية', 'الغربية', 'كفر الشيخ',
            'دمياط', 'بورسعيد', 'الإسماعيلية', 'السويس', 'شمال سيناء',
            'جنوب سيناء', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط',
            'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'البحر الأحمر', 'الوادي الجديد', 'مطروح'
        ];
        
        governoratePatterns.forEach(gov => {
            if (text.includes(gov)) {
                entities.push({ type: 'governorate', value: gov, text: gov });
            }
        });
        
        // استخراج أسماء مناطق معروفة (نمط ذكي)
        const knownAreas = [
            'العاشر من رمضان', 'السادات', 'برج العرب', 'زهراء المعادي',
            '6 أكتوبر', 'بدر', 'العبور', 'الشروق'
        ];
        
        knownAreas.forEach(area => {
            const normalized = text.replace(/\s+/g, ' ');
            if (normalized.includes(area) || area.includes(normalized.substring(0, 10))) {
                entities.push({ type: 'area', value: area, text: area });
            }
        });
        
        // استخراج أنشطة (بناءً على كلمات مفتاحية)
        const activityKeywords = {
            'مصنع': 'صناعي',
            'ورشة': 'صناعي',
            'مخبز': 'مخابز',
            'فندق': 'فنادق',
            'مطعم': 'مطاعم',
            'صيدلية': 'صيدليات',
            'عيادة': 'عيادات'
        };
        
        Object.entries(activityKeywords).forEach(([keyword, activity]) => {
            if (text.includes(keyword)) {
                entities.push({ type: 'activity', value: activity, text: keyword });
            }
        });
        
        return entities;
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🔍 البحث الدلالي الأساسي
     * ═══════════════════════════════════════════════════════════════
     */
    vectorSearch(queryVector, limit, minScore) {
        const results = {
            activities: [],
            industrial: [],
            decision104: []
        };
        
        for (const [key, db] of Object.entries(this.databases)) {
            if (!db.vectors || db.vectors.length === 0) continue;
            
            const scores = db.vectors.map(item => ({
                id: item.id,
                score: this.cosineSimilarity(queryVector, item.vector)
            }));
            
            results[key] = scores
                .filter(r => r.score > minScore)
                .sort((a, b) => b.score - a.score)
                .slice(0, limit);
        }
        
        return results;
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🎯 البحث المعزز بالكيانات
     * ═══════════════════════════════════════════════════════════════
     */
    async entityEnhancedSearch(entities, limit) {
        const results = {
            activities: [],
            industrial: [],
            decision104: []
        };
        
        for (const entity of entities) {
            const entityVector = await this.getVector(entity.text);
            const entityResults = this.vectorSearch(entityVector, limit, 0.2);
            
            // دمج مع نتائج موجودة
            for (const [key, items] of Object.entries(entityResults)) {
                items.forEach(item => {
                    const existing = results[key].find(r => r.id === item.id);
                    if (existing) {
                        // مكافأة النتائج المتكررة
                        existing.score = Math.min(1, existing.score + item.score * 0.3);
                        existing.entityMatch = true;
                    } else {
                        results[key].push({ ...item, entityMatch: true });
                    }
                });
            }
        }
        
        // ترتيب النتائج
        for (const key of Object.keys(results)) {
            results[key].sort((a, b) => b.score - a.score);
        }
        
        return results;
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🔗 الدمج الذكي للنتائج
     * ═══════════════════════════════════════════════════════════════
     */
    intelligentMerge(baseResults, entityResults) {
        const merged = {
            activities: [],
            industrial: [],
            decision104: []
        };
        
        for (const key of Object.keys(merged)) {
            const baseItems = baseResults[key] || [];
            const entityItems = entityResults[key] || [];
            
            const allItems = new Map();
            
            // إضافة النتائج الأساسية
            baseItems.forEach(item => {
                allItems.set(item.id, { ...item, baseScore: item.score });
            });
            
            // دمج نتائج الكيانات
            entityItems.forEach(item => {
                const existing = allItems.get(item.id);
                if (existing) {
                    // النتيجة موجودة في الاثنين - مكافأة
                    existing.score = Math.min(1, existing.baseScore + item.score * 0.4);
                    existing.entityBoost = true;
                } else {
                    allItems.set(item.id, { ...item, entityOnly: true });
                }
            });
            
            merged[key] = Array.from(allItems.values())
                .sort((a, b) => b.score - a.score);
        }
        
        return merged;
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🎖️ Re-ranking ذكي
     * ═══════════════════════════════════════════════════════════════
     */
    async rerank(results, originalQuery, entities) {
        // عوامل Re-ranking:
        // 1. مطابقة الكيانات (+0.2)
        // 2. تكرار النتيجة في استراتيجيات متعددة (+0.15)
        // 3. تاريخ النجاح السابق (+0.1)
        
        for (const [key, items] of Object.entries(results)) {
            items.forEach(item => {
                let boost = 0;
                
                // مكافأة مطابقة الكيانات
                if (item.entityMatch || item.entityBoost) {
                    boost += 0.2;
                }
                
                // مكافأة التاريخ الناجح
                const history = this.learningSystem.successfulQueries.get(item.id);
                if (history && history.count > 0) {
                    boost += Math.min(0.15, history.count * 0.03);
                }
                
                item.score = Math.min(1, item.score + boost);
                item.reranked = true;
            });
            
            items.sort((a, b) => b.score - a.score);
        }
        
        return results;
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 📚 التعلم من الاستعلام
     * ═══════════════════════════════════════════════════════════════
     */
    learnFromQuery(query, results) {
        // حفظ الاستعلام الناجح
        const topResults = [
            ...results.activities.slice(0, 1),
            ...results.industrial.slice(0, 1),
            ...results.decision104.slice(0, 1)
        ];
        
        topResults.forEach(result => {
            if (result.score > 0.5) {
                const existing = this.learningSystem.successfulQueries.get(result.id);
                if (existing) {
                    existing.count++;
                    existing.queries.push(query);
                } else {
                    this.learningSystem.successfulQueries.set(result.id, {
                        count: 1,
                        queries: [query]
                    });
                }
            }
        });
        
        // حفظ تاريخ الثقة
        this.learningSystem.confidenceHistory.push({
            query,
            timestamp: Date.now(),
            topScore: Math.max(
                ...topResults.map(r => r.score || 0)
            )
        });
        
        // تنظيف التاريخ (آخر 100 فقط)
        if (this.learningSystem.confidenceHistory.length > 100) {
            this.learningSystem.confidenceHistory.shift();
        }
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 📊 حساب الثقة الديناميكية
     * ═══════════════════════════════════════════════════════════════
     */
    getDynamicConfidenceThreshold(queryComplexity = 'medium') {
        // حساب المتوسط من التاريخ
        const avgConfidence = this.learningSystem.confidenceHistory.length > 0
            ? this.learningSystem.confidenceHistory.reduce((sum, h) => sum + h.topScore, 0) / 
              this.learningSystem.confidenceHistory.length
            : 0.4;
        
        // تعديل حسب التعقيد
        const complexityFactors = {
            simple: 0.8,   // أسئلة بسيطة - عتبة أقل
            medium: 1.0,   // متوسط
            complex: 1.2   // معقد - عتبة أعلى
        };
        
        const factor = complexityFactors[queryComplexity] || 1.0;
        return Math.max(0.2, Math.min(0.8, avgConfidence * factor));
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🔧 دوال مساعدة
     * ═══════════════════════════════════════════════════════════════
     */
    cosineSimilarity(vecA, vecB) {
        if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
        
        let dot = 0, normA = 0, normB = 0;
        for (let i = 0; i < vecA.length; i++) {
            dot += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        
        const denom = Math.sqrt(normA) * Math.sqrt(normB);
        return denom === 0 ? 0 : dot / denom;
    }
    
    async getVector(text) {
        const output = await this.extractor(text, { pooling: 'mean', normalize: true });
        return Array.from(output.data);
    }
    
    // دالة للتوافق مع الكود القديم
    async search(query, limit = 10) {
        return this.intelligentSearch(query, { limit });
    }
}

// التصدير
window.vEngine = new VectorEngineV2();
console.log('✅ Vector Engine V2 - جاهز');
