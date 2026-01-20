/****************************************************************************
 * 🧠 VECTOR ENGINE PRO - محرك المتجهات الذكي
 * ════════════════════════════════════════════════════════════════════════
 * محرك بحث دلالي متقدم مع ذكاء مدمج وتعلم تلقائي
 ****************************************************************************/

class VectorEnginePro {
    constructor() {
        // 🔥 القاعدة الدلالية الذكية
        this.knowledgeBase = {
            activities: this.createSemanticIndex('activities'),
            industrial: this.createSemanticIndex('industrial'),
            decision104: this.createSemanticIndex('decision104')
        };
        
        // 🔥 الذاكرة الدلالية
        this.semanticMemory = {
            embeddings: new Map(),
            similarities: new Map(),
            clusters: new Map()
        };
        
        // 🔥 نماذج الذكاء المدمجة - **تم التصحيح هنا**
        this.models = {
            encoder: this.createDynamicEncoder(),
            matcher: this.createIntelligentMatcher(),
            ranker: this.createIntelligentRanker()  // ✅ اسم معدل
        };
        
        // 🔥 إحصائيات ذكية
        this.analytics = {
            searchPerformance: new PerformanceTracker(),
            semanticDensity: new DensityCalculator(),
            learningMetrics: new LearningMetrics()
        };
        
        this.isReady = false;
        this.initialize();
    }
    
    // ... باقي الكود كما هو ...
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 🏆 إنشاء مصنف ذكي (بدلاً من createContextualRanker)
     * ═══════════════════════════════════════════════════════════
     */
    createIntelligentRanker() {
        const self = this;
        
        return {
            rank: async function(results, queryEmbedding, analysis) {
                console.log('🏆 بدء الترتيب الذكي للنتائج:', results.length);
                
                if (!results || results.length === 0) {
                    return [];
                }
                
                const rankingFactors = {
                    semanticSimilarity: 0.4,
                    contextualRelevance: 0.3,
                    historicalPopularity: 0.15,
                    freshness: 0.1,
                    diversity: 0.05
                };
                
                const ranked = await Promise.all(
                    results.map(async (result, index) => {
                        const scores = {
                            semantic: await self.calculateSemanticScore(result, queryEmbedding),
                            contextual: self.calculateContextualScore(result, analysis),
                            popularity: self.calculatePopularityScore(result),
                            freshness: self.calculateFreshnessScore(result),
                            diversity: self.calculateDiversityScore(result, results.slice(0, index))
                        };
                        
                        // حساب النتيجة المركبة
                        const compositeScore = Object.entries(scores).reduce((total, [factor, score]) => {
                            const factorName = {
                                semantic: 'semanticSimilarity',
                                contextual: 'contextualRelevance',
                                popularity: 'historicalPopularity',
                                freshness: 'freshness',
                                diversity: 'diversity'
                            }[factor];
                            
                            return total + (score * (rankingFactors[factorName] || 0));
                        }, 0);
                        
                        return {
                            ...result,
                            score: compositeScore,
                            detailedScores: scores
                        };
                    })
                );
                
                return ranked.sort((a, b) => b.score - a.score);
            },
            
            calculateSemanticScore: async function(result, queryEmbedding) {
                // الحصول على تضمين النتيجة إذا لم يكن موجوداً
                if (!result.embedding && result.text) {
                    result.embedding = await self.encode(result.text);
                }
                
                if (result.embedding && queryEmbedding) {
                    return self.cosineSimilarity(queryEmbedding, result.embedding);
                }
                
                return result.score || 0.5;
            },
            
            calculateContextualScore: function(result, analysis) {
                // حساب الصلة السياقية
                if (!analysis) return 0.5;
                
                let score = 0.5;
                
                // إذا كان هناك كيانات متطابقة
                if (analysis.semantic?.entities && result.metadata?.entities) {
                    const entityMatches = analysis.semantic.entities.filter(e => 
                        result.metadata.entities?.includes(e)
                    ).length;
                    score += entityMatches * 0.1;
                }
                
                // إذا كان هناك مواضيع متطابقة
                if (analysis.semantic?.topics && result.metadata?.topics) {
                    const topicMatches = analysis.semantic.topics.filter(t => 
                        result.metadata.topics?.includes(t)
                    ).length;
                    score += topicMatches * 0.05;
                }
                
                return Math.min(score, 1.0);
            },
            
            calculatePopularityScore: function(result) {
                // حساب الشعبية التاريخية
                const frequency = result.metadata?.frequency || 0;
                const clicks = result.metadata?.clicks || 0;
                
                return Math.min(0.5 + (frequency * 0.01) + (clicks * 0.001), 0.9);
            },
            
            calculateFreshnessScore: function(result) {
                // حساب الجدة
                if (!result.metadata?.timestamp) return 0.5;
                
                const ageInDays = (Date.now() - result.metadata.timestamp) / (1000 * 60 * 60 * 24);
                
                if (ageInDays < 7) return 0.9;       // أقل من أسبوع
                if (ageInDays < 30) return 0.7;      // أقل من شهر
                if (ageInDays < 90) return 0.5;      // أقل من 3 أشهر
                if (ageInDays < 180) return 0.3;     // أقل من 6 أشهر
                return 0.1;                         // أقدم من 6 أشهر
            },
            
            calculateDiversityScore: function(result, previousResults) {
                // حساب التنوع
                if (previousResults.length === 0) return 1.0;
                
                // التحقق من التكرار
                const isSimilar = previousResults.some(prev => 
                    prev.id === result.id || 
                    prev.text === result.text ||
                    (prev.embedding && result.embedding && 
                     self.cosineSimilarity(prev.embedding, result.embedding) > 0.8)
                );
                
                return isSimilar ? 0.2 : 1.0;
            }
        };
    }
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 📊 دوال مساعدة للترتيب
     * ═══════════════════════════════════════════════════════════
     */
    
    calculateSemanticScore(result, queryEmbedding) {
        return this.models.ranker.calculateSemanticScore(result, queryEmbedding);
    }
    
    calculateContextualScore(result, analysis) {
        return this.models.ranker.calculateContextualScore(result, analysis);
    }
    
    calculatePopularityScore(result) {
        return this.models.ranker.calculatePopularityScore(result);
    }
    
    calculateFreshnessScore(result) {
        return this.models.ranker.calculateFreshnessScore(result);
    }
    
    calculateDiversityScore(result, previousResults) {
        return this.models.ranker.calculateDiversityScore(result, previousResults);
    }
    
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
    
    // ... باقي الكود كما هو ...
}

/****************************************************************************
 * 📊 الفئات المساعدة
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
            recent: this.records.slice(-10)
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

console.log('🧠 Vector Engine Pro - المحرك الدلالي الذكي جاهز!');
console.log('✨ المميزات:');
console.log('   ✅ بحث دلالي متعدد المستويات');
console.log('   ✅ ترميز ذكي ديناميكي');
console.log('   ✅ ترتيب نتائج ذكي');
console.log('   ✅ تعلم تلقائي من الأداء');
console.log('   ✅ توافق كامل مع Revolutionary Assistant');
