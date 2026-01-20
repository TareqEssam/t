/****************************************************************************
 * 🧠 VECTOR ENGINE PRO - محرك المتجهات الذكي (النسخة النهائية المثبتة)
 * ════════════════════════════════════════════════════════════════════════
 * إصدار محسن: لا يحمل بيانات لا نهائية، يستخدم المتغيرات العالمية مباشرة
 * تاريخ الإصدار: 2024
 ****************************************************************************/

// ============================================================
// 1. فهرس دلالي ذكي مع كاش لمنع التحميل المتكرر
// ============================================================
class SemanticIndex {
    constructor(name) {
        this.name = name;
        this.items = new Map();      // تخزين العناصر
        this.vectors = new Map();    // تخزين المتجهات
        this.vectorCache = new Map(); // كاش لمنع التكرار
        this.loadCounter = 0;        // عداد التحميل
    }
    
    /**
     * إضافة عنصر واحد فقط - مع منع التكرار
     */
    async addItem(item) {
        // توليد ID فريد إذا لم يكن موجوداً
        const id = item.id || `${this.name}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        
        // منع التكرار
        if (this.items.has(id)) {
            console.debug(`⏭️ ${this.name}: تخطي مكرر ${id.substring(0, 30)}...`);
            return id;
        }
        
        // توليد أو استخدام المتجه الموجود
        const vector = item.vector || await this.generateVector(item.text);
        
        // حفظ العنصر
        this.items.set(id, {
            id,
            text: item.text || 'بدون نص',
            metadata: item.metadata || {},
            category: this.name,
            timestamp: Date.now()
        });
        
        // حفظ المتجه
        this.vectors.set(id, vector);
        this.loadCounter++;
        
        // تحديث مرئي كل 50 عنصر
        if (this.loadCounter % 50 === 0) {
            console.log(`   ${this.name}: تم تحميل ${this.loadCounter} عنصر`);
        }
        
        return id;
    }
    
    /**
     * توليد متجه للنص مع الكاش
     */
    async generateVector(text) {
        const cacheKey = text.toLowerCase().trim();
        if (!cacheKey) return new Array(384).fill(0);
        
        // التحقق من الكاش
        if (this.vectorCache.has(cacheKey)) {
            return this.vectorCache.get(cacheKey);
        }
        
        // توليد متجه جديد
        const vector = new Array(384).fill(0);
        const words = cacheKey.split(/\s+/).filter(w => w.length > 1);
        
        for (const word of words) {
            const hash = this.hashString(word);
            const index = hash % 384;
            vector[index] += 0.15; // زيادة طفيفة للتأثير
        }
        
        // تطبيع المتجه
        const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
        const normalized = norm > 0.001 ? vector.map(val => val / norm) : vector;
        
        // حفظ في الكاش
        if (words.length > 0) {
            this.vectorCache.set(cacheKey, normalized);
        }
        
        return normalized;
    }
    
    /**
     * بحث في الفهرس
     */
    async search(queryVector, options = {}) {
        const results = [];
        const minScore = options.minScore || 0.05; // عتبة منخفضة للسماح بنتائج أكثر
        const limit = options.limit || 10;
        
        // إذا لم يكن هناك متجهات، ارجع قائمة فارغة
        if (this.vectors.size === 0) {
            return results;
        }
        
        // البحث في جميع المتجهات
        for (const [id, vector] of this.vectors.entries()) {
            const similarity = this.cosineSimilarity(queryVector, vector);
            
            if (similarity >= minScore) {
                const item = this.items.get(id);
                results.push({
                    ...item,
                    score: similarity,
                    confidence: Math.min(1, similarity * 1.2) // تعزيز الثقة قليلاً
                });
            }
        }
        
        // الترتيب التنازلي والحد
        results.sort((a, b) => b.score - a.score);
        return results.slice(0, limit);
    }
    
    /**
     * حساب التشابه الدلالي
     */
    cosineSimilarity(vec1, vec2) {
        if (!vec1 || !vec2 || vec1.length !== vec2.length || vec1.length === 0) {
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
        
        if (norm1 < 0.001 || norm2 < 0.001) return 0;
        return Math.max(0, Math.min(1, dot / (norm1 * norm2)));
    }
    
    /**
     * تجزئة النص
     */
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // تحويل إلى 32-bit integer
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
     * إحصائيات الفهرس
     */
    getStats() {
        return {
            items: this.items.size,
            vectors: this.vectors.size,
            cache: this.vectorCache.size,
            category: this.name
        };
    }
    
    /**
     * مسح الفهرس (للاستخدام في حالة إعادة التحميل)
     */
    clear() {
        this.items.clear();
        this.vectors.clear();
        this.vectorCache.clear();
        this.loadCounter = 0;
    }
}

// ============================================================
// 2. محرك المتجهات الرئيسي
// ============================================================
class VectorEnginePro {
    constructor() {
        // الفهارس الدلالية
        this.knowledgeBase = {
            activities: new SemanticIndex('activities'),
            industrial: new SemanticIndex('industrial'),
            decision104: new SemanticIndex('decision104')
        };
        
        // حالة النظام
        this.isReady = false;
        this.isLoading = false;
        this.loadStartTime = null;
        this.maxLoadTime = 10000; // 10 ثواني كحد أقصى
        
        // إحصائيات
        this.stats = {
            totalSearches: 0,
            avgResponseTime: 0,
            lastSearchTime: 0
        };
        
        // تهيئة سريعة
        this.initialize();
    }
    
    /**
     * التهيئة الذكية السريعة
     */
    async initialize() {
        console.log('🚀 Vector Engine Pro: بدء التهيئة السريعة...');
        this.loadStartTime = Date.now();
        this.isLoading = true;
        
        try {
            // تحميل البيانات الأساسية فقط
            await this.loadEssentialData();
            
            this.isReady = true;
            this.isLoading = false;
            const loadTime = Date.now() - this.loadStartTime;
            
            console.log(`✅ Vector Engine Pro: جاهز في ${loadTime}ms`);
            console.log(`📊 الفهارس: ${this.getIndexStats().total} عنصر`);
            
            // إطلاق حدث الجاهزية
            window.dispatchEvent(new CustomEvent('vectorEngineReady', {
                detail: this.getStats()
            }));
            
        } catch (error) {
            console.error('⚠️ Vector Engine Pro: خطأ في التهيئة:', error.message);
            this.initializeFallback();
        }
    }
    
    /**
     * تحميل البيانات الأساسية فقط (غير متزامن)
     */
    async loadEssentialData() {
        console.log('📦 جاري تحميل البيانات الأساسية...');
        
        let totalLoaded = 0;
        const MAX_ITEMS = 200; // حد أقصى للبيانات الأساسية
        
        // 1. تحميل عينة من الأنشطة
        if (window.masterActivityDB && Array.isArray(window.masterActivityDB)) {
            const sampleSize = Math.min(50, window.masterActivityDB.length);
            const sample = window.masterActivityDB.slice(0, sampleSize);
            
            console.log(`   🏢 ${sampleSize} نشاط...`);
            for (const activity of sample) {
                await this.knowledgeBase.activities.addItem({
                    id: activity.value || `act_${totalLoaded}`,
                    text: activity.text || 'نشاط',
                    metadata: { source: 'masterActivityDB' }
                });
                totalLoaded++;
            }
        }
        
        // 2. تحميل عينة من المناطق
        if (window.industrialAreasData && Array.isArray(window.industrialAreasData)) {
            const sampleSize = Math.min(40, window.industrialAreasData.length);
            const sample = window.industrialAreasData.slice(0, sampleSize);
            
            console.log(`   🏭 ${sampleSize} منطقة...`);
            for (const area of sample) {
                await this.knowledgeBase.industrial.addItem({
                    id: area.name || `area_${totalLoaded}`,
                    text: area.name || 'منطقة صناعية',
                    metadata: { source: 'industrialAreasData' }
                });
                totalLoaded++;
            }
        }
        
        // 3. تحميل عينة من قرار 104
        if (window.sectorAData && typeof window.sectorAData === 'object') {
            console.log('   ⭐ قرار 104...');
            let count = 0;
            
            for (const [category, items] of Object.entries(window.sectorAData)) {
                if (Array.isArray(items) && count < 20) {
                    const sample = items.slice(0, 5);
                    
                    for (const item of sample) {
                        if (typeof item === 'string' && count < 20) {
                            await this.knowledgeBase.decision104.addItem({
                                id: `104_${category}_${count}`,
                                text: item.substring(0, 100),
                                metadata: { category, source: 'sectorAData' }
                            });
                            totalLoaded++;
                            count++;
                        }
                    }
                }
            }
        }
        
        console.log(`✅ تم تحميل ${totalLoaded} عنصر أساسي`);
        return totalLoaded;
    }
    
    /**
     * وضع الطوارئ إذا فشل التحميل
     */
    initializeFallback() {
        console.log('🔄 Vector Engine Pro: استخدام وضع الطوارئ...');
        
        // بيانات أساسية فقط
        const fallbackData = [
            { category: 'activities', text: 'نشاط صناعي', id: 'fallback_activity' },
            { category: 'industrial', text: 'منطقة صناعية', id: 'fallback_industrial' },
            { category: 'decision104', text: 'قرار 104 للحوافز', id: 'fallback_104' }
        ];
        
        // تحميل البيانات الأساسية
        fallbackData.forEach(item => {
            this.knowledgeBase[item.category].addItem(item);
        });
        
        this.isReady = true;
        this.isLoading = false;
        
        console.log('✅ Vector Engine Pro: وضع الطوارئ جاهز');
    }
    
    /**
     * البحث الدلالي
     */
    async search(query, limit = 10, category = null) {
        if (!this.isReady) {
            console.warn('⚠️ المحرك غير جاهز بعد');
            return this.getEmptyResults();
        }
        
        const searchStartTime = Date.now();
        this.stats.totalSearches++;
        
        try {
            // توليد متجه الاستعلام
            const queryVector = await this.encodeText(query);
            
            // تحديد الفهارس للبحث
            const searchCategories = category ? [category] : ['activities', 'industrial', 'decision104'];
            
            // البحث في الفهارس
            let allResults = [];
            for (const cat of searchCategories) {
                const results = await this.knowledgeBase[cat].search(queryVector, {
                    limit: limit * 2,
                    minScore: 0.05
                });
                allResults.push(...results);
            }
            
            // ترتيب النتائج
            const sortedResults = allResults.sort((a, b) => b.score - a.score);
            const finalResults = sortedResults.slice(0, limit);
            
            // تنسيق النتائج
            const formatted = this.formatResults(finalResults);
            
            // تحديث الإحصائيات
            const searchTime = Date.now() - searchStartTime;
            this.stats.lastSearchTime = searchTime;
            this.stats.avgResponseTime = (
                (this.stats.avgResponseTime * (this.stats.totalSearches - 1) + searchTime) / 
                this.stats.totalSearches
            );
            
            console.log(`🔍 بحث: "${query.substring(0, 30)}..." → ${finalResults.length} نتيجة (${searchTime}ms)`);
            
            return formatted;
            
        } catch (error) {
            console.error('❌ خطأ في البحث:', error);
            return this.getEmptyResults();
        }
    }
    
    /**
     * ترميز النص إلى متجه
     */
    async encodeText(text) {
        if (!text || typeof text !== 'string') {
            return new Array(384).fill(0);
        }
        
        // استخدام دالة الترميز المبسطة
        return await this.knowledgeBase.activities.generateVector(text);
    }
    
    /**
     * تنسيق النتائج
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
                score: result.score || 0,
                confidence: result.confidence || 0,
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
     * الحصول على إحصائيات الفهرس
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
     * الحصول على إحصائيات النظام
     */
    getStats() {
        return {
            ready: this.isReady,
            loading: this.isLoading,
            indices: this.getIndexStats(),
            performance: {
                totalSearches: this.stats.totalSearches,
                avgResponseTime: this.stats.avgResponseTime.toFixed(2),
                lastSearchTime: this.stats.lastSearchTime
            }
        };
    }
    
    /**
     * نتائج فارغة
     */
    getEmptyResults() {
        return {
            activities: [],
            industrial: [],
            decision104: []
        };
    }
    
    /**
     * إعادة تعيين المحرك
     */
    async reset() {
        console.log('🔄 إعادة تعيين المحرك...');
        
        this.isReady = false;
        this.isLoading = false;
        
        // مسح الفهارس
        this.knowledgeBase.activities.clear();
        this.knowledgeBase.industrial.clear();
        this.knowledgeBase.decision104.clear();
        
        // إعادة التهيئة
        await this.initialize();
        
        console.log('✅ تم إعادة تعيين المحرك');
    }
}

// ============================================================
// 3. التصدير والتهيئة العالمية
// ============================================================

// التحقق من عدم التحميل المزدوج
if (typeof window.vEngine !== 'undefined') {
    console.warn('⚠️ تم تحميل Vector Engine مسبقاً، استخدام النسخة الموجودة');
} else {
    // إنشاء المحرك
    window.vEngine = new VectorEnginePro();
    
    // التوافق مع الاسم القديم
    if (typeof window.vectorEngine === 'undefined') {
        window.vectorEngine = window.vEngine;
    }
    
    // رسالة بدء التشغيل
    console.log('🧠 Vector Engine Pro: جاري التهيئة...');
    console.log('📌 يستخدم البيانات من:');
    console.log('   - window.masterActivityDB');
    console.log('   - window.industrialAreasData');
    console.log('   - window.sectorAData');
}

// ============================================================
// 4. أدوات المساعدة للتصحيح
// ============================================================

/**
 * أداة تشخيص المحرك
 */
window.diagnoseVectorEngine = function() {
    console.log('🔍 === تشخيص Vector Engine ===');
    
    const engine = window.vEngine;
    if (!engine) {
        console.log('❌ المحرك غير موجود');
        return;
    }
    
    console.log('📊 الحالة:', engine.isReady ? '✅ جاهز' : '⏳ قيد التحميل');
    console.log('📈 الإحصائيات:', engine.getStats());
    
    // التحقق من البيانات
    console.log('📦 مصادر البيانات:');
    console.log('   masterActivityDB:', window.masterActivityDB?.length || 0, 'عنصر');
    console.log('   industrialAreasData:', window.industrialAreasData?.length || 0, 'عنصر');
    console.log('   sectorAData:', window.sectorAData ? 'موجود' : 'غير موجود');
    
    // اختبار بحث بسيط
    console.log('🧪 اختبار بحث:');
    engine.search('منطقة صناعية', 3).then(results => {
        console.log('   نتائج الاختبار:', {
            activities: results.activities.length,
            industrial: results.industrial.length,
            decision104: results.decision104.length
        });
    }).catch(err => {
        console.log('   ❌ فشل الاختبار:', err.message);
    });
};

/**
 * تحميل بيانات إضافية في الخلفية
 */
window.loadBackgroundData = async function() {
    console.log('🔄 تحميل بيانات إضافية في الخلفية...');
    
    const engine = window.vEngine;
    if (!engine || !engine.isReady) {
        console.log('⚠️ المحرك غير جاهز');
        return;
    }
    
    // يمكن إضافة منطق لتحميل المزيد من البيانات هنا
    console.log('✅ سيتم تحميل البيانات الإضافية عند الحاجة');
};

// ============================================================
// 5. أحداث النظام
// ============================================================

// إطلاق حدث عند جاهزية DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM جاهز، المحرك في طور التهيئة...');
});

// مراقبة الأخطاء
window.addEventListener('error', function(e) {
    if (e.message.includes('VectorEngine') || e.message.includes('SemanticIndex')) {
        console.error('🚨 خطأ في Vector Engine:', e.message, e.error);
    }
});

// ============================================================
// 6. رسالة النهاية
// ============================================================
console.log('🚀 Vector Engine Pro: تم التحميل بنجاح');
console.log('📋 الإصدار: النهائي المثبت - لا يحمل بيانات لا نهائية');
console.log('💡 استخدم window.vEngine.search("استعلام") للبحث');
