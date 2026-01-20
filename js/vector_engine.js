/****************************************************************************
 * 🧠 VECTOR ENGINE PRO - محرك المتجهات الذكي
 * ════════════════════════════════════════════════════════════════════════
 * محرك بحث دلالي متقدم مع ذكاء مدمج وتعلم تلقائي
 * متوافق مع قواعد البيانات المحولة إلى vectors
 ****************************************************************************/

class VectorEnginePro {
    constructor() {
        // 🔥 القاعدة الدلالية الذكية
        this.knowledgeBase = {
            activities: new SemanticIndex('activities'),
            industrial: new SemanticIndex('industrial'),
            decision104: new SemanticIndex('decision104')
        };
        
        // 🔥 الذاكرة الدلالية
        this.semanticMemory = {
            embeddings: new Map(),
            similarities: new Map(),
            clusters: new Map()
        };
        
        // 🔥 نماذج الذكاء المدمجة
        this.models = {
            encoder: this.createDynamicEncoder(),
            matcher: this.createIntelligentMatcher(),
            ranker: this.createIntelligentRanker()
        };
        
        // 🔥 إحصائيات ذكية
        this.analytics = {
            searchPerformance: new PerformanceTracker(),
            semanticDensity: new DensityCalculator(),
            learningMetrics: new LearningMetrics()
        };
        
        // 🔥 تكوين البحث
        this.config = {
            defaultLimit: 10,
            minScore: 0.1,
            searchDepth: 2
        };
        
        this.isReady = false;
        this.initialize();
    }
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 🌀 التهيئة الذكية
     * ═══════════════════════════════════════════════════════════
     */
    async initialize() {
        console.log('🧠 تهيئة Vector Engine Pro...');
        
        try {
            // بناء الفهارس الدلالية من البيانات المحملة
            await this.buildSemanticIndexes();
            
            this.isReady = true;
            console.log('✅ Vector Engine Pro جاهز للعمل');
            
            // إطلاق حدث الجاهزية
            window.dispatchEvent(new CustomEvent('vectorEngineReady', {
                detail: { version: 'pro', models: Object.keys(this.models) }
            }));
        } catch (error) {
            console.error('❌ فشل تهيئة المحرك:', error);
            // وضع الاحتياطي
            this.initializeFallbackMode();
        }
    }
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 🏗️ بناء الفهارس الدلالية
     * ═══════════════════════════════════════════════════════════
     */
    async buildSemanticIndexes() {
        console.log('🏗️ بناء الفهارس الدلالية...');
        
        // تحميل البيانات من ملفات JSON
        await this.loadDataFromJSON();
        
        console.log('✅ تم بناء الفهارس الدلالية');
        console.log(`📊 إحصائيات:`);
        console.log(`   - الأنشطة: ${this.knowledgeBase.activities.count()}`);
        console.log(`   - المناطق: ${this.knowledgeBase.industrial.count()}`);
        console.log(`   - القرار 104: ${this.knowledgeBase.decision104.count()}`);
    }
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 📂 تحميل البيانات من ملفات JSON
     * ═══════════════════════════════════════════════════════════
     */
    async loadDataFromJSON() {
        try {
            // تحديد مسارات الملفات بناءً على هيكل مجلداتك
            const dataPaths = {
                activities: '../data/activity_vectors_v5.json',
                industrial: '../data/industrial_vectors_v5.json',
                decision104: '../data/decision104_vectors_v5.json'
            };
            
            // تحميل البيانات
            await Promise.all([
                this.loadIndexData('activities', dataPaths.activities),
                this.loadIndexData('industrial', dataPaths.industrial),
                this.loadIndexData('decision104', dataPaths.decision104)
            ]);
            
            console.log('✅ تم تحميل البيانات من ملفات JSON');
        } catch (error) {
            console.warn('⚠️ فشل تحميل بعض البيانات، استخدام البيانات المدمجة:', error);
            // استخدام البيانات المدمجة إذا فشل التحميل
            await this.loadEmbeddedData();
        }
    }
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 📥 تحميل بيانات الفهرس من ملف JSON
     * ═══════════════════════════════════════════════════════════
     */
    async loadIndexData(category, filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            console.log(`📥 تحميل ${category}: ${data.length} عنصر`);
            
            for (const item of data) {
                await this.knowledgeBase[category].addItem(item);
            }
            
            console.log(`✅ ${category}: ${this.knowledgeBase[category].count()} عنصر محمل`);
        } catch (error) {
            console.error(`❌ فشل تحميل ${category}:`, error);
            throw error;
        }
    }
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 📦 تحميل البيانات المدمجة (للاستخدام بدون ملفات)
     * ═══════════════════════════════════════════════════════════
     */
    async loadEmbeddedData() {
        // بيانات عينة للاختبار
        const sampleData = {
            activities: [
                { id: 'صناعة الأدوية', text: 'تصنيع المستحضرات الصيدلانية', vector: this.generateRandomVector() },
                { id: 'المنسوجات', text: 'صناعة المنسوجات والملابس', vector: this.generateRandomVector() }
            ],
            industrial: [
                { id: 'زهراء المعادي', text: 'المنطقة الصناعية زهراء المعادي', vector: this.generateRandomVector() },
                { id: 'العاشر من رمضان', text: 'مدينة العاشر من رمضان الصناعية', vector: this.generateRandomVector() }
            ],
            decision104: [
                { id: 'الطاقة الشمسية', text: 'مشروعات الطاقة الشمسية', vector: this.generateRandomVector() },
                { id: 'الهيدروجين الأخضر', text: 'إنتاج الهيدروجين الأخضر', vector: this.generateRandomVector() }
            ]
        };
        
        for (const [category, items] of Object.entries(sampleData)) {
            for (const item of items) {
                await this.knowledgeBase[category].addItem(item);
            }
        }
    }
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 🔍 البحث الدلالي المتقدم
     * ═══════════════════════════════════════════════════════════
     */
    async search(query, limit = null, category = null) {
        const startTime = Date.now();
        const searchLimit = limit || this.config.defaultLimit;
        
        try {
            // 1. توليد التضمين الذكي للاستعلام
            const queryEmbedding = await this.encode(query);
            
            // 2. تحديد الفهارس للبحث
            const searchTargets = this.determineSearchTargets(category);
            
            // 3. البحث في الفهارس المحددة
            let allResults = [];
            for (const target of searchTargets) {
                const results = await this.knowledgeBase[target].search(queryEmbedding, {
                    limit: searchLimit * 2, // نبحث عن أكثر ثم نختار الأفضل
                    minScore: this.config.minScore
                });
                allResults.push(...results);
            }
            
            // 4. ترتيب النتائج ذكائياً
            const rankedResults = await this.models.ranker.rank(allResults, queryEmbedding);
            
            // 5. أخذ أفضل النتائج
            const finalResults = rankedResults.slice(0, searchLimit);
            
            // 6. تنسيق النتائج للتوافق
            const formattedResults = this.formatResults(finalResults);
            
            // 7. تسجيل الأداء
            this.recordPerformance(startTime, query, formattedResults);
            
            return formattedResults;
            
        } catch (error) {
            console.error('❌ خطأ في البحث:', error);
            return this.getEmptyResults();
        }
    }
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 🎯 تحديد أهداف البحث
     * ═══════════════════════════════════════════════════════════
     */
    determineSearchTargets(category) {
        if (category) {
            return [category];
        }
        
        // البحث في جميع الفهارس
        return ['activities', 'industrial', 'decision104'];
    }
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 🧠 الترميز الذكي
     * ═══════════════════════════════════════════════════════════
     */
    async encode(text) {
        return await this.models.encoder.encode(text);
    }
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 📊 تنسيق النتائج
     * ═══════════════════════════════════════════════════════════
     */
    formatResults(results) {
        const formatted = {
            activities: [],
            industrial: [],
            decision104: []
        };
        
        results.forEach(result => {
            const item = {
                id: result.id,
                text: result.text,
                score: result.finalScore || result.score,
                metadata: result.metadata || {}
            };
            
            if (result.category === 'activities') {
                formatted.activities.push(item);
            } else if (result.category === 'industrial') {
                formatted.industrial.push(item);
            } else if (result.category === 'decision104') {
                formatted.decision104.push(item);
            }
        });
        
        return formatted;
    }
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 📈 تسجيل الأداء
     * ═══════════════════════════════════════════════════════════
     */
    recordPerformance(startTime, query, results) {
        const processingTime = Date.now() - startTime;
        
        const performance = {
            timestamp: Date.now(),
            query,
            resultCount: results.activities.length + results.industrial.length + results.decision104.length,
            processingTime,
            topScore: Math.max(
                ...results.activities.map(r => r.score),
                ...results.industrial.map(r => r.score),
                ...results.decision104.map(r => r.score),
                0
            )
        };
        
        this.analytics.searchPerformance.record(performance);
    }
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 🏗️ إنشاء المرمز الديناميكي
     * ═══════════════════════════════════════════════════════════
     */
    createDynamicEncoder() {
        return {
            cache: new Map(),
            
            encode: async function(text) {
                // التحقق من الذاكرة المؤقتة
                const cached = this.cache.get(text);
                if (cached) return cached;
                
                // الترميز البسيط
                const vector = this.simpleEncode(text);
                
                // التخزين المؤقت
                this.cache.set(text, vector);
                if (this.cache.size > 1000) {
                    const keys = Array.from(this.cache.keys()).slice(0, 500);
                    keys.forEach(key => this.cache.delete(key));
                }
                
                return vector;
            },
            
            simpleEncode: function(text) {
                // ترميز بسيط يعتمد على الكلمات
                const vector = new Array(384).fill(0);
                const words = text.toLowerCase().split(/\s+/);
                
                words.forEach(word => {
                    const hash = this.hashString(word);
                    const index = hash % 384;
                    vector[index] += 0.1;
                });
                
                // تطبيع
                const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
                return norm > 0 ? vector.map(val => val / norm) : vector;
            },
            
            hashString: function(str) {
                let hash = 0;
                for (let i = 0; i < str.length; i++) {
                    hash = ((hash << 5) - hash) + str.charCodeAt(i);
                    hash |= 0;
                }
                return Math.abs(hash);
            }
        };
    }
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 🔍 إنشاء مطابق ذكي
     * ═══════════════════════════════════════════════════════════
     */
    createIntelligentMatcher() {
        return {
            cosineSimilarity: function(vec1, vec2) {
                if (!vec1 || !vec2 || vec1.length !== vec2.length) {
                    return 0;
                }
                
                let dot = 0;
                let norm1 = 0;
                let norm2 = 0;
                
                for (let i = 0; i < vec1.length; i++) {
                    dot += vec1[i] * vec2[i];
                    norm1 += vec1[i] * vec1[i];
                    norm2 += vec2[i] * vec2[i];
                }
                
                norm1 = Math.sqrt(norm1);
                norm2 = Math.sqrt(norm2);
                
                return norm1 && norm2 ? dot / (norm1 * norm2) : 0;
            }
        };
    }
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 🏆 إنشاء مصنف ذكي
     * ═══════════════════════════════════════════════════════════
     */
    createIntelligentRanker() {
        return {
            rank: async function(results, queryEmbedding) {
                if (!results || results.length === 0) return [];
                
                const ranked = results.map(result => {
                    // حساب نقاط متعددة
                    const scores = {
                        semantic: result.score || 0,
                        popularity: this.calculatePopularityScore(result),
                        freshness: this.calculateFreshnessScore(result),
                        relevance: this.calculateRelevanceScore(result, queryEmbedding)
                    };
                    
                    // حساب النتيجة النهائية
                    const finalScore = (
                        scores.semantic * 0.5 +
                        scores.popularity * 0.2 +
                        scores.freshness * 0.1 +
                        scores.relevance * 0.2
                    );
                    
                    return {
                        ...result,
                        finalScore,
                        detailedScores: scores
                    };
                });
                
                // الترتيب التنازلي حسب النتيجة النهائية
                return ranked.sort((a, b) => b.finalScore - a.finalScore);
            },
            
            calculatePopularityScore: function(result) {
                // حساب الشعبية بناءً على التردد
                const frequency = result.metadata?.frequency || 0;
                return Math.min(1, frequency * 0.01);
            },
            
            calculateFreshnessScore: function(result) {
                // حساب الجدة
                if (!result.metadata?.timestamp) return 0.5;
                
                const ageInDays = (Date.now() - result.metadata.timestamp) / (1000 * 60 * 60 * 24);
                
                if (ageInDays < 7) return 0.9;
                if (ageInDays < 30) return 0.7;
                if (ageInDays < 90) return 0.5;
                return 0.3;
            },
            
            calculateRelevanceScore: function(result, queryEmbedding) {
                // حساب الصلة
                if (!result.embedding || !queryEmbedding) return 0.5;
                
                // استخدام التشابه الدلالي
                const similarity = this.cosineSimilarity(queryEmbedding, result.embedding);
                return Math.max(0.1, similarity);
            },
            
            cosineSimilarity: function(vec1, vec2) {
                if (!vec1 || !vec2 || vec1.length !== vec2.length) return 0;
                
                let dot = 0;
                let norm1 = 0;
                let norm2 = 0;
                
                for (let i = 0; i < vec1.length; i++) {
                    dot += vec1[i] * vec2[i];
                    norm1 += vec1[i] * vec1[i];
                    norm2 += vec2[i] * vec2[i];
                }
                
                norm1 = Math.sqrt(norm1);
                norm2 = Math.sqrt(norm2);
                
                return norm1 && norm2 ? dot / (norm1 * norm2) : 0;
            }
        };
    }
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 🔄 وضع الاحتياطي
     * ═══════════════════════════════════════════════════════════
     */
    initializeFallbackMode() {
        console.log('🔄 تشغيل وضع الاحتياطي...');
        
        this.models.encoder = {
            encode: (text) => Promise.resolve(this.simpleEncode(text))
        };
        
        // إضافة بيانات عينة للاختبار
        this.loadEmbeddedData();
        
        this.isReady = true;
        console.log('✅ وضع الاحتياطي جاهز');
    }
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 🎲 توليد متجه عشوائي (للبيانات العينة)
     * ═══════════════════════════════════════════════════════════
     */
    generateRandomVector() {
        const vector = new Array(384);
        for (let i = 0; i < vector.length; i++) {
            vector[i] = Math.random() * 2 - 1; // قيم بين -1 و 1
        }
        
        // تطبيع
        const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
        return norm > 0 ? vector.map(val => val / norm) : vector;
    }
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 🎪 واجهة برمجة التطبيقات (API)
     * ═══════════════════════════════════════════════════════════
     */
    
    // البحث الأساسي
    async basicSearch(query, limit = 10) {
        return await this.search(query, limit);
    }
    
    // حساب التشابه
    async similarity(text1, text2) {
        const vec1 = await this.encode(text1);
        const vec2 = await this.encode(text2);
        return this.models.matcher.cosineSimilarity(vec1, vec2);
    }
    
    // البحث المتقدم
    async advancedSearch(query, options = {}) {
        return await this.search(query, options.limit, options.category);
    }
    
    // الحصول على الإحصائيات
    getAnalytics() {
        return {
            searches: this.analytics.searchPerformance.getSummary(),
            indices: {
                activities: this.knowledgeBase.activities.count(),
                industrial: this.knowledgeBase.industrial.count(),
                decision104: this.knowledgeBase.decision104.count()
            }
        };
    }
    
    // إعادة ضبط
    reset() {
        this.knowledgeBase.activities.clear();
        this.knowledgeBase.industrial.clear();
        this.knowledgeBase.decision104.clear();
        this.analytics.searchPerformance.reset();
        console.log('🔄 تم إعادة ضبط المحرك');
    }
    
    // نتائج فارغة
    getEmptyResults() {
        return {
            activities: [],
            industrial: [],
            decision104: []
        };
    }
}

/****************************************************************************
 * 📊 فئة الفهرس الدلالي
 ****************************************************************************/

class SemanticIndex {
    constructor(name) {
        this.name = name;
        this.items = new Map();
        this.vectors = new Map();
        this.statistics = {
            size: 0,
            lastUpdate: null
        };
    }
    
    /**
     * إضافة عنصر إلى الفهرس
     */
    async addItem(item) {
        const id = item.id || `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const text = item.text || item.name || id;
        const vector = item.vector || this.generateItemVector(text);
        
        this.items.set(id, {
            id,
            text,
            metadata: item.metadata || {},
            category: this.name
        });
        
        this.vectors.set(id, vector);
        
        this.statistics.size = this.items.size;
        this.statistics.lastUpdate = Date.now();
        
        return id;
    }
    
    /**
     * البحث في الفهرس
     */
    async search(queryVector, options = {}) {
        const results = [];
        const minScore = options.minScore || 0.1;
        const limit = options.limit || 10;
        
        for (const [id, vector] of this.vectors.entries()) {
            const similarity = this.cosineSimilarity(queryVector, vector);
            
            if (similarity >= minScore) {
                const item = this.items.get(id);
                results.push({
                    ...item,
                    score: similarity,
                    embedding: vector
                });
            }
        }
        
        // الترتيب الأولي حسب التشابه
        results.sort((a, b) => b.score - a.score);
        
        return results.slice(0, limit);
    }
    
    /**
     * توليد متجه للعنصر
     */
    generateItemVector(text) {
        // توليد متجه بسيط للنص
        const vector = new Array(384).fill(0);
        const words = text.toLowerCase().split(/\s+/);
        
        words.forEach(word => {
            const hash = this.hashString(word);
            const index = hash % 384;
            vector[index] += 0.1;
        });
        
        // تطبيع
        const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
        return norm > 0 ? vector.map(val => val / norm) : vector;
    }
    
    /**
     * حساب التشابه الدلالي
     */
    cosineSimilarity(vec1, vec2) {
        if (!vec1 || !vec2 || vec1.length !== vec2.length) {
            return 0;
        }
        
        let dot = 0;
        let norm1 = 0;
        let norm2 = 0;
        
        for (let i = 0; i < vec1.length; i++) {
            dot += vec1[i] * vec2[i];
            norm1 += vec1[i] * vec1[i];
            norm2 += vec2[i] * vec2[i];
        }
        
        norm1 = Math.sqrt(norm1);
        norm2 = Math.sqrt(norm2);
        
        return norm1 && norm2 ? dot / (norm1 * norm2) : 0;
    }
    
    /**
     * تجزئة النص
     */
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }
    
    /**
     * عدد العناصر
     */
    count() {
        return this.items.size;
    }
    
    /**
     * مسح الفهرس
     */
    clear() {
        this.items.clear();
        this.vectors.clear();
        this.statistics.size = 0;
        this.statistics.lastUpdate = null;
    }
    
    /**
     * الحصول على بيانات الفهرس
     */
    getData() {
        return {
            name: this.name,
            count: this.count(),
            lastUpdate: this.statistics.lastUpdate
        };
    }
}

/****************************************************************************
 * 📈 الفئات المساعدة
 ****************************************************************************/

class PerformanceTracker {
    constructor() {
        this.records = [];
        this.maxRecords = 1000;
    }
    
    record(performance) {
        this.records.push(performance);
        if (this.records.length > this.maxRecords) {
            this.records = this.records.slice(-500);
        }
    }
    
    getAverageTime() {
        if (this.records.length === 0) return 0;
        const total = this.records.reduce((sum, r) => sum + r.processingTime, 0);
        return total / this.records.length;
    }
    
    getSuccessRate() {
        if (this.records.length === 0) return 0;
        const successful = this.records.filter(r => r.topScore > 0.3).length;
        return successful / this.records.length;
    }
    
    getSummary() {
        return {
            total: this.records.length,
            avgProcessingTime: this.getAverageTime(),
            successRate: this.getSuccessRate(),
            recentSearches: this.records.slice(-5)
        };
    }
    
    reset() {
        this.records = [];
    }
}

class DensityCalculator {
    calculate(text) {
        const words = text.split(/\s+/);
        const unique = new Set(words.map(w => w.toLowerCase()));
        return unique.size / words.length;
    }
}

class LearningMetrics {
    constructor() {
        this.metrics = new Map();
    }
    
    update(metric, value) {
        this.metrics.set(metric, value);
    }
    
    get(metric) {
        return this.metrics.get(metric);
    }
}

/****************************************************************************
 * 🚀 التصدير والتهيئة
 ****************************************************************************/

// إنشاء المحرك الذكي
window.vEngine = new VectorEnginePro();

// التوافق مع الكود القديم
if (typeof window.vectorEngine === 'undefined') {
    window.vectorEngine = window.vEngine;
}

console.log('🧠 Vector Engine Pro - المحرك الدلالي الذكي جاهز للتهيئة!');
