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
    async loadDataFromJSON() {
    console.log('📦 جاري تحميل البيانات...');
    
    // أولاً: محاولة استخدام البيانات من المتغيرات العالمية
    await this.loadFromGlobalVariables();
    
    // إذا لم توجد بيانات كافية، استخدم البيانات المدمجة
    const totalItems = 
        this.knowledgeBase.activities.count() + 
        this.knowledgeBase.industrial.count() + 
        this.knowledgeBase.decision104.count();
    
    if (totalItems < 10) { // إذا كانت البيانات قليلة
        console.log('📋 البيانات غير كافية، استخدام البيانات المدمجة...');
        await this.loadEmbeddedData();
    }
    
    console.log(`✅ تم تحميل ${totalItems} عنصر`);
},

async loadFromGlobalVariables() {
    console.log('🔍 البحث عن البيانات في الذاكرة...');
    
    // قائمة المصادر المحتملة للبيانات
    const dataSources = [
        // المتجهات المحولة
        { 
            var: 'activityVectors', 
            target: 'activities',
            check: () => window.activityVectors && Array.isArray(window.activityVectors)
        },
        { 
            var: 'industrialVectors', 
            target: 'industrial',
            check: () => window.industrialVectors && Array.isArray(window.industrialVectors)
        },
        { 
            var: 'decision104Vectors', 
            target: 'decision104',
            check: () => window.decision104Vectors && Array.isArray(window.decision104Vectors)
        },
        
        // قواعد البيانات الأصلية
        { 
            var: 'masterActivityDB', 
            target: 'activities',
            check: () => window.masterActivityDB && Array.isArray(window.masterActivityDB),
            transform: (item) => ({
                id: item.value || item.text || `act_${Date.now()}`,
                text: item.text || item.value || 'نشاط غير معروف',
                metadata: item
            })
        },
        { 
            var: 'industrialAreasData', 
            target: 'industrial',
            check: () => window.industrialAreasData && Array.isArray(window.industrialAreasData),
            transform: (item) => ({
                id: item.name || `area_${Date.now()}`,
                text: item.name || 'منطقة غير معروفة',
                metadata: item
            })
        },
        { 
            var: 'sectorAData', 
            target: 'decision104',
            check: () => window.sectorAData && typeof window.sectorAData === 'object',
            transform: (item) => {
                // معالجة خاصة للقرار 104
                if (typeof item === 'string') {
                    return {
                        id: `104_${item.substring(0, 20).replace(/\s+/g, '_')}`,
                        text: item,
                        metadata: { type: 'decision104' }
                    };
                }
                return null;
            }
        }
    ];
    
    let loadedCount = 0;
    
    for (const source of dataSources) {
        if (source.check()) {
            console.log(`   📥 تحميل ${source.var} إلى ${source.target}...`);
            const dataArray = window[source.var];
            
            if (Array.isArray(dataArray)) {
                for (const item of dataArray) {
                    try {
                        const processedItem = source.transform ? source.transform(item) : item;
                        if (processedItem) {
                            await this.knowledgeBase[source.target].addItem(processedItem);
                            loadedCount++;
                        }
                    } catch (error) {
                        console.warn(`⚠️ خطأ في معالجة ${source.var}:`, error);
                    }
                }
            } else if (typeof dataArray === 'object') {
                // معالجة الكائنات (مثل sectorAData)
                for (const [key, value] of Object.entries(dataArray)) {
                    if (Array.isArray(value)) {
                        for (const item of value) {
                            const processedItem = source.transform ? source.transform(item) : {
                                id: `104_${key}_${item.substring(0, 20).replace(/\s+/g, '_')}`,
                                text: item,
                                metadata: { category: key, type: 'decision104' }
                            };
                            if (processedItem) {
                                await this.knowledgeBase[source.target].addItem(processedItem);
                                loadedCount++;
                            }
                        }
                    }
                }
            }
        }
    }
    
    if (loadedCount > 0) {
        console.log(`✅ تم تحميل ${loadedCount} عنصر من الذاكرة`);
    } else {
        console.log('ℹ️ لم توجد بيانات في الذاكرة');
    }
    
    return loadedCount;
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

// في نهاية ملف vector_engine.js، أضف:
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM محمل، تهيئة المحرك...');
    window.vEngine = window.vEngine || new VectorEnginePro();
});

// أو مباشرة بعد تعريف الكلاس
window.vEngine = new VectorEnginePro();

// أضف حدثاً عند الجاهزية
window.dispatchEvent(new CustomEvent('vectorEngineReady', {
    detail: { 
        timestamp: Date.now(),
        version: 'pro'
    }
}));


/****************************************************************************
 * 🔬 تشخيص النظام - إصدار احترافي
 ****************************************************************************/

class SystemDiagnostic {
    constructor() {
        this.results = {};
        this.run();
    }
    
    async run() {
        console.log('🔬 === بدء التشخيص الشامل للنظام ===');
        
        await this.checkFilePaths();
        await this.checkDataVariables();
        await this.checkEngineStatus();
        await this.checkNetworkAccess();
        await this.checkDirectoryStructure();
        
        this.generateReport();
    }
    
    async checkFilePaths() {
        console.log('📁 التحقق من مسارات الملفات...');
        
        const testPaths = [
            './data/activity_vectors_v5.json',
            '../data/activity_vectors_v5.json',
            'data/activity_vectors_v5.json',
            '/data/activity_vectors_v5.json'
        ];
        
        this.results.paths = {};
        
        for (const path of testPaths) {
            try {
                const response = await fetch(path, { method: 'HEAD' });
                this.results.paths[path] = {
                    exists: response.ok,
                    status: response.status,
                    url: response.url
                };
                console.log(`  ${response.ok ? '✅' : '❌'} ${path}: ${response.ok ? 'موجود' : 'غير موجود'} (${response.status})`);
            } catch (error) {
                this.results.paths[path] = {
                    exists: false,
                    error: error.message
                };
                console.log(`  ❌ ${path}: خطأ - ${error.message}`);
            }
        }
    }
    
    async checkDataVariables() {
        console.log('📊 التحقق من متغيرات البيانات في الذاكرة...');
        
        this.results.variables = {
            activityVectors: {
                exists: typeof window.activityVectors !== 'undefined',
                type: typeof window.activityVectors,
                length: window.activityVectors?.length || 0
            },
            industrialVectors: {
                exists: typeof window.industrialVectors !== 'undefined',
                type: typeof window.industrialVectors,
                length: window.industrialVectors?.length || 0
            },
            decision104Vectors: {
                exists: typeof window.decision104Vectors !== 'undefined',
                type: typeof window.decision104Vectors,
                length: window.decision104Vectors?.length || 0
            },
            masterActivityDB: {
                exists: typeof window.masterActivityDB !== 'undefined',
                type: typeof window.masterActivityDB,
                length: window.masterActivityDB?.length || 0
            },
            industrialAreasData: {
                exists: typeof window.industrialAreasData !== 'undefined',
                type: typeof window.industrialAreasData,
                length: window.industrialAreasData?.length || 0
            },
            sectorAData: {
                exists: typeof window.sectorAData !== 'undefined',
                type: typeof window.sectorAData,
                isObject: typeof window.sectorAData === 'object'
            }
        };
        
        Object.entries(this.results.variables).forEach(([key, data]) => {
            console.log(`  ${data.exists ? '✅' : '❌'} ${key}: ${data.exists ? `موجود (${data.type}, ${data.length || 'N/A'})` : 'غير موجود'}`);
        });
    }
    
    async checkEngineStatus() {
        console.log('🚀 التحقق من حالة المحرك...');
        
        this.results.engine = {
            vEngine: {
                exists: typeof window.vEngine !== 'undefined',
                isReady: window.vEngine?.isReady || false,
                type: typeof window.vEngine
            },
            vectorEngine: {
                exists: typeof window.vectorEngine !== 'undefined',
                isReady: window.vectorEngine?.isReady || false
            },
            assistant: {
                exists: typeof window.assistant !== 'undefined',
                isReady: window.assistant?.isReady || false
            }
        };
        
        console.log(`  ${this.results.engine.vEngine.exists ? '✅' : '❌'} window.vEngine: ${this.results.engine.vEngine.exists ? `موجود (جاهز: ${this.results.engine.vEngine.isReady})` : 'غير موجود'}`);
        console.log(`  ${this.results.engine.vectorEngine.exists ? '✅' : '❌'} window.vectorEngine: ${this.results.engine.vectorEngine.exists ? `موجود (جاهز: ${this.results.engine.vectorEngine.isReady})` : 'غير موجود'}`);
        console.log(`  ${this.results.engine.assistant.exists ? '✅' : '❌'} window.assistant: ${this.results.engine.assistant.exists ? `موجود (جاهز: ${this.results.engine.assistant.isReady})` : 'غير موجود'}`);
    }
    
    async checkNetworkAccess() {
        console.log('🌐 التحقق من الوصول للشبكة...');
        
        try {
            const response = await fetch(window.location.href, { method: 'HEAD' });
            this.results.network = {
                canAccessOrigin: true,
                origin: window.location.origin,
                basePath: window.location.pathname.split('/').slice(0, -1).join('/') || '/'
            };
            console.log(`  ✅ يمكن الوصول إلى الأصل: ${window.location.origin}`);
        } catch (error) {
            this.results.network = {
                canAccessOrigin: false,
                error: error.message
            };
            console.log(`  ❌ لا يمكن الوصول إلى الأصل: ${error.message}`);
        }
    }
    
    async checkDirectoryStructure() {
        console.log('🗂️ التحقق من هيكل الدلائل...');
        
        this.results.directory = {
            currentPath: window.location.pathname,
            pathParts: window.location.pathname.split('/'),
            isGitHubPages: window.location.hostname.includes('github.io'),
            baseDirectory: this.getBaseDirectory()
        };
        
        console.log(`  📍 المسار الحالي: ${this.results.directory.currentPath}`);
        console.log(`  🏠 المجلد الأساسي: ${this.results.directory.baseDirectory}`);
        console.log(`  🌐 GitHub Pages: ${this.results.directory.isGitHubPages ? 'نعم' : 'لا'}`);
    }
    
    getBaseDirectory() {
        const path = window.location.pathname;
        if (path === '/' || path === '/index.html') return '/';
        
        const parts = path.split('/');
        // إزالة اسم الملف
        parts.pop();
        return parts.join('/') || '/';
    }
    
    generateReport() {
        console.log('\n📋 === تقرير التشخيص ===\n');
        
        // المشكلة الرئيسية: الملفات غير موجودة
        const workingPaths = Object.entries(this.results.paths || {})
            .filter(([_, data]) => data.exists)
            .map(([path, _]) => path);
        
        if (workingPaths.length === 0) {
            console.log('🚨 المشكلة الرئيسية: ملفات البيانات غير موجودة في أي مسار');
            console.log('💡 الحلول الممكنة:');
            console.log('   1. تأكد من وجود مجلد data/ في المكان الصحيح');
            console.log('   2. تحقق من أسماء الملفات (activity_vectors_v5.json، إلخ)');
            console.log('   3. تأكد من صلاحيات الوصول للملفات');
            console.log('   4. استخدم البيانات من المتغيرات العالمية بدلاً من الملفات');
        } else {
            console.log(`✅ المسارات العاملة: ${workingPaths.join(', ')}`);
        }
        
        // اقتراح بناءً على المتغيرات المتاحة
        if (this.results.variables?.activityVectors?.exists && 
            this.results.variables.activityVectors.length > 0) {
            console.log('\n💡 الحل الفوري:');
            console.log('   استخدم البيانات من window.activityVectors بدلاً من تحميل الملفات');
            
            // إظهار نموذج كود
            console.log('\n📝 كود الإصلاح:');
            console.log(`
// في vector_engine.js، استبدل loadDataFromJSON بـ:
async loadDataFromJSON() {
    if (window.activityVectors && window.activityVectors.length > 0) {
        console.log('✅ استخدام البيانات من الذاكرة...');
        for (const item of window.activityVectors) {
            await this.knowledgeBase.activities.addItem(item);
        }
        for (const item of window.industrialVectors || []) {
            await this.knowledgeBase.industrial.addItem(item);
        }
        for (const item of window.decision104Vectors || []) {
            await this.knowledgeBase.decision104.addItem(item);
        }
        return;
    }
    // ... باقي الكود للبيانات المدمجة
}
            `);
        }
        
        console.log('\n🔧 التوصيات:');
        console.log('   1. عطل fetch للملفات وأستخدم البيانات المدمجة');
        console.log('   2. تأكد من نشر ملفات JSON مع المشروع');
        console.log('   3. استخدم console.log لرؤية المسار الفعلي');
        
        // حفظ النتائج للوصول السريع
        window.systemDiagnosis = this.results;
    }
}

// تشغيل التشخيص بعد تحميل الصفحة
setTimeout(() => {
    new SystemDiagnostic();
}, 2000);
