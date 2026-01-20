/****************************************************************************
 * 🧠 VECTOR ENGINE PRO - محرك المتجهات الذكي (الإصدار المعدل)
 * ════════════════════════════════════════════════════════════════════════
 * يستخدم البيانات من المتغيرات العالمية مباشرةً
 ****************************************************************************/

class VectorEnginePro {
    constructor() {
        // 🔥 القاعدة الدلالية الذكية
        this.knowledgeBase = {
            activities: new SemanticIndex('activities'),
            industrial: new SemanticIndex('industrial'),
            decision104: new SemanticIndex('decision104')
        };
        
        // 🔥 نماذج الذكاء
        this.models = {
            encoder: this.createDynamicEncoder(),
            matcher: this.createIntelligentMatcher(),
            ranker: this.createIntelligentRanker()
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
        console.log('🧠 تهيئة Vector Engine Pro (الإصدار المحسن)...');
        
        try {
            // تحميل البيانات من المتغيرات العالمية مباشرة
            await this.loadFromGlobalVariables();
            
            this.isReady = true;
            console.log('✅ Vector Engine Pro جاهز للعمل');
            
            // إطلاق حدث الجاهزية
            window.dispatchEvent(new CustomEvent('vectorEngineReady', {
                detail: { 
                    version: 'pro-enhanced',
                    stats: this.getIndexStats()
                }
            }));
        } catch (error) {
            console.error('❌ فشل تهيئة المحرك:', error);
            this.initializeFallbackMode();
        }
    }
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 📥 تحميل البيانات من المتغيرات العالمية
     * ═══════════════════════════════════════════════════════════
     */
    async loadFromGlobalVariables() {
        console.log('📊 تحميل البيانات من المتغيرات العالمية...');
        
        let totalLoaded = 0;
        
        // 1. تحميل الأنشطة من masterActivityDB
        if (window.masterActivityDB && Array.isArray(window.masterActivityDB)) {
            console.log(`📥 تحميل ${window.masterActivityDB.length} نشاط...`);
            for (const activity of window.masterActivityDB) {
                await this.knowledgeBase.activities.addItem({
                    id: activity.value || `act_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                    text: activity.text || 'نشاط غير معروف',
                    metadata: {
                        ...activity,
                        type: 'activity',
                        source: 'masterActivityDB'
                    }
                });
            }
            totalLoaded += window.masterActivityDB.length;
        }
        
        // 2. تحميل المناطق الصناعية
        if (window.industrialAreasData && Array.isArray(window.industrialAreasData)) {
            console.log(`📥 تحميل ${window.industrialAreasData.length} منطقة...`);
            for (const area of window.industrialAreasData) {
                await this.knowledgeBase.industrial.addItem({
                    id: area.name || `area_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                    text: area.name || 'منطقة غير معروفة',
                    metadata: {
                        ...area,
                        type: 'industrial_area',
                        source: 'industrialAreasData'
                    }
                });
            }
            totalLoaded += window.industrialAreasData.length;
        }
        
        // 3. تحميل قرار 104
        if (window.sectorAData && typeof window.sectorAData === 'object') {
            console.log('📥 تحميل قرار 104...');
            let decisionCount = 0;
            
            for (const [category, items] of Object.entries(window.sectorAData)) {
                if (Array.isArray(items)) {
                    for (const item of items) {
                        if (typeof item === 'string') {
                            await this.knowledgeBase.decision104.addItem({
                                id: `104_${category}_${item.substring(0, 30).replace(/\s+/g, '_')}`,
                                text: item,
                                metadata: {
                                    category: category,
                                    type: 'decision104',
                                    source: 'sectorAData'
                                }
                            });
                            decisionCount++;
                        }
                    }
                }
            }
            totalLoaded += decisionCount;
            console.log(`   تم تحميل ${decisionCount} عنصر من القرار 104`);
        }
        
        console.log(`✅ تم تحميل إجمالي ${totalLoaded} عنصر`);
        
        // إذا كانت البيانات قليلة، أضف عينات
        if (totalLoaded < 50) {
            console.log('📝 إضافة بيانات عينة...');
            await this.addSampleData();
        }
    }
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 📝 إضافة بيانات عينة (إذا كانت البيانات قليلة)
     * ═══════════════════════════════════════════════════════════
     */
    async addSampleData() {
        const sampleData = {
            activities: [
                { id: 'صناعة_الأدوية', text: 'تصنيع المستحضرات الصيدلانية والأدوية', metadata: { type: 'activity' } },
                { id: 'المنسوجات', text: 'صناعة المنسوجات والملابس الجاهزة', metadata: { type: 'activity' } },
                { id: 'الأغذية', text: 'صناعة المنتجات الغذائية والمعلبات', metadata: { type: 'activity' } }
            ],
            industrial: [
                { id: 'زهراء_المعادي', text: 'المنطقة الصناعية زهراء المعادي - القاهرة', metadata: { type: 'area' } },
                { id: 'العاشر_من_رمضان', text: 'مدينة العاشر من رمضان الصناعية', metadata: { type: 'area' } },
                { id: 'برج_العرب', text: 'المنطقة الصناعية برج العرب الجديدة - الإسكندرية', metadata: { type: 'area' } }
            ],
            decision104: [
                { id: 'الطاقة_الشمسية', text: 'مشروعات الطاقة الشمسية وتوليد الكهرباء', metadata: { type: 'decision104' } },
                { id: 'الهيدروجين_الأخضر', text: 'إنتاج الهيدروجين الأخضر وتخزين الطاقة', metadata: { type: 'decision104' } }
            ]
        };
        
        for (const [category, items] of Object.entries(sampleData)) {
            for (const item of items) {
                await this.knowledgeBase[category].addItem(item);
            }
        }
        
        console.log('✅ تمت إضافة بيانات عينة');
    }
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 🔍 البحث الدلالي
     * ═══════════════════════════════════════════════════════════
     */
    async search(query, limit = 10, category = null) {
        if (!this.isReady) {
            console.warn('⚠️ المحرك غير جاهز');
            return this.getEmptyResults();
        }
        
        try {
            // توليد التضمين
            const queryEmbedding = await this.encode(query);
            
            // تحديد الفهارس للبحث
            const searchTargets = category ? [category] : ['activities', 'industrial', 'decision104'];
            
            // البحث في الفهارس
            let allResults = [];
            for (const target of searchTargets) {
                const results = await this.knowledgeBase[target].search(queryEmbedding, {
                    limit: limit * 2,
                    minScore: 0.1
                });
                allResults.push(...results);
            }
            
            // ترتيب النتائج
            const rankedResults = await this.models.ranker.rank(allResults, queryEmbedding);
            
            // تنسيق النتائج
            return this.formatResults(rankedResults.slice(0, limit));
            
        } catch (error) {
            console.error('❌ خطأ في البحث:', error);
            return this.getEmptyResults();
        }
    }
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 🧠 الترميز
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
            
            if (result.category === 'activities') formatted.activities.push(item);
            else if (result.category === 'industrial') formatted.industrial.push(item);
            else if (result.category === 'decision104') formatted.decision104.push(item);
        });
        
        return formatted;
    }
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 🏗️ المرمز الديناميكي
     * ═══════════════════════════════════════════════════════════
     */
    createDynamicEncoder() {
        return {
            encode: async function(text) {
                // ترميز مبسط يعتمد على الكلمات
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
     * 🔍 المطابق الذكي
     * ═══════════════════════════════════════════════════════════
     */
    createIntelligentMatcher() {
        return {
            cosineSimilarity: function(vec1, vec2) {
                if (!vec1 || !vec2 || vec1.length !== vec2.length) return 0;
                
                let dot = 0, norm1 = 0, norm2 = 0;
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
     * 🏆 المصنف الذكي
     * ═══════════════════════════════════════════════════════════
     */
    createIntelligentRanker() {
        return {
            rank: async function(results, queryEmbedding) {
                if (!results || results.length === 0) return [];
                
                return results.map(result => {
                    const baseScore = result.score || 0.5;
                    const popularity = result.metadata?.popularity || 0.5;
                    const finalScore = (baseScore * 0.7) + (popularity * 0.3);
                    
                    return {
                        ...result,
                        finalScore: Math.min(1, Math.max(0, finalScore))
                    };
                }).sort((a, b) => b.finalScore - a.finalScore);
            }
        };
    }
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 📊 إحصائيات الفهرس
     * ═══════════════════════════════════════════════════════════
     */
    getIndexStats() {
        return {
            activities: this.knowledgeBase.activities.count(),
            industrial: this.knowledgeBase.industrial.count(),
            decision104: this.knowledgeBase.decision104.count(),
            total: this.knowledgeBase.activities.count() + 
                   this.knowledgeBase.industrial.count() + 
                   this.knowledgeBase.decision104.count()
        };
    }
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 🎪 واجهة برمجة التطبيقات
     * ═══════════════════════════════════════════════════════════
     */
    getEmptyResults() {
        return { activities: [], industrial: [], decision104: [] };
    }
    
    initializeFallbackMode() {
        console.log('🔄 وضع الاحتياطي...');
        this.isReady = true;
        this.addSampleData();
    }
}

/****************************************************************************
 * 📊 فئة الفهرس الدلالي (مبسطة)
 ****************************************************************************/

class SemanticIndex {
    constructor(name) {
        this.name = name;
        this.items = new Map();
        this.vectors = new Map();
    }
    
    async addItem(item) {
        const id = item.id || `${this.name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const vector = item.vector || this.generateVector(item.text);
        
        this.items.set(id, {
            id,
            text: item.text,
            metadata: item.metadata || {},
            category: this.name
        });
        
        this.vectors.set(id, vector);
        return id;
    }
    
    async search(queryVector, options = {}) {
        const results = [];
        const minScore = options.minScore || 0.1;
        
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
        
        results.sort((a, b) => b.score - a.score);
        return results.slice(0, options.limit || 10);
    }
    
    generateVector(text) {
        const vector = new Array(384).fill(0);
        const words = (text || '').toLowerCase().split(/\s+/);
        
        words.forEach(word => {
            const hash = this.hashString(word);
            const index = hash % 384;
            vector[index] += 0.1;
        });
        
        const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
        return norm > 0 ? vector.map(val => val / norm) : vector;
    }
    
    cosineSimilarity(vec1, vec2) {
        if (!vec1 || !vec2 || vec1.length !== vec2.length) return 0;
        
        let dot = 0, norm1 = 0, norm2 = 0;
        for (let i = 0; i < vec1.length; i++) {
            dot += vec1[i] * vec2[i];
            norm1 += vec1[i] * vec1[i];
            norm2 += vec2[i] * vec2[i];
        }
        
        norm1 = Math.sqrt(norm1);
        norm2 = Math.sqrt(norm2);
        return norm1 && norm2 ? dot / (norm1 * norm2) : 0;
    }
    
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }
    
    count() {
        return this.items.size;
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

console.log('🧠 Vector Engine Pro - الإصدار المحسن جاهز للتهيئة!');
console.log('✨ يستخدم البيانات مباشرة من المتغيرات العالمية');
