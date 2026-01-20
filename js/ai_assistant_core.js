/****************************************************************************
 * 🧠 Smart Assistant V12 - النظام الذكي المتكامل
 * ════════════════════════════════════════════════════════════════════════════
 * 🔥 النظام المتكامل: ذاكرة + معالجة مركبة + تعلم + Vector Engine V2
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * ✨ المميزات:
 * - ذاكرة محادثة ذكية (20 جولة)
 * - معالجة الأسئلة المركبة (و، أيضًا، كذلك، إلخ)
 * - فهم الأسئلة المتتابعة بالسياق
 * - تعلم تلقائي من التصحيحات
 * - تكامل كامل مع Vector Engine V2
 * - ردود ذكية متعددة الطبقات
 * 
 * 📁 التصميم: فصول داخلية (يمكن فصلها لاحقاً)
 * 
 * 1. ConversationMemory    ← نظام الذاكرة والسياق
 * 2. ComplexProcessor     ← معالج الأسئلة المركبة  
 * 3. LearningEngine       ← محرك التعلم الذاتي
 * 4. ContextManager       ← مدير السياق الذكي
 * 
 ****************************************************************************/

// ============================================================================
// 🧠 الجزء 1: نظام الذاكرة الذكية (للأسئلة المتتابعة)
// ============================================================================

class ConversationMemory {
    constructor(assistant) {
        this.assistant = assistant;
        this.history = [];           // سجل المحادثة الكامل
        this.contextStack = [];      // سلسلة السياقات النشطة
        this.entityChain = new Map(); // تتبع الكيانات عبر المحادثة
        this.maxHistory = 20;        // الحد الأقصى للذاكرة
        this.maxContextDepth = 5;    // عمق السياق المسموح
    }

    /**
     * 📝 تسجيل تفاعل جديد في الذاكرة
     */
    recordInteraction(userInput, assistantResponse, analysis = null) {
        const interaction = {
            timestamp: Date.now(),
            user: userInput,
            assistant: assistantResponse,
            analysis: analysis,
            entities: analysis?.understanding?.entities || [],
            intent: analysis?.understanding?.intent || 'general',
            contextId: this.generateContextId()
        };

        // إضافة إلى التاريخ
        this.history.push(interaction);
        
        // الحفاظ على الحد الأقصى
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }

        // تحديث سلسلة الكيانات
        this.updateEntityChain(interaction);
        
        // تحديث سياق المحادثة
        this.updateContextStack(interaction);
        
        console.log(`💾 الذاكرة: ${this.history.length} تفاعل، ${this.entityChain.size} كيان`);
        
        return interaction;
    }

    /**
     * 🔗 توليد معرف فريد للسياق
     */
    generateContextId() {
        return 'ctx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * 🔄 تحديث سلسلة الكيانات
     */
    updateEntityChain(interaction) {
        if (!interaction.entities || interaction.entities.length === 0) {
            return;
        }

        interaction.entities.forEach(entity => {
            const entityKey = `${entity.type}:${entity.text}`;
            
            if (this.entityChain.has(entityKey)) {
                const chain = this.entityChain.get(entityKey);
                chain.lastSeen = Date.now();
                chain.count++;
                chain.interactions.push({
                    time: interaction.timestamp,
                    contextId: interaction.contextId,
                    userInput: interaction.user
                });
            } else {
                this.entityChain.set(entityKey, {
                    type: entity.type,
                    text: entity.text,
                    firstSeen: Date.now(),
                    lastSeen: Date.now(),
                    count: 1,
                    interactions: [{
                        time: interaction.timestamp,
                        contextId: interaction.contextId,
                        userInput: interaction.user
                    }]
                });
            }
        });
    }

    /**
     * 🏗️ تحديث مكدس السياق
     */
    updateContextStack(interaction) {
        const context = {
            id: interaction.contextId,
            timestamp: interaction.timestamp,
            primaryEntity: interaction.entities[0] || null,
            intent: interaction.intent,
            userInput: interaction.user.substring(0, 100),
            depth: 0
        };

        // إذا كان هناك سياق نشط، احسب العمق
        if (this.contextStack.length > 0) {
            const lastContext = this.contextStack[this.contextStack.length - 1];
            
            // تحقق إذا كان هذا استمرار لنفس السياق
            if (this.isContextContinuation(lastContext, interaction)) {
                context.depth = lastContext.depth + 1;
                context.parentContextId = lastContext.id;
            }
        }

        this.contextStack.push(context);
        
        // الحفاظ على الحد الأقصى للعمق
        if (this.contextStack.length > this.maxContextDepth) {
            this.contextStack.shift();
        }
    }

    /**
     * 🔍 التحقق إذا كان التفاعل استمراراً للسياق السابق
     */
    isContextContinuation(previousContext, currentInteraction) {
        // تحقق من الزمن (أقل من 2 دقيقة)
        const timeDiff = (currentInteraction.timestamp - previousContext.timestamp) / 1000;
        if (timeDiff > 120) return false;

        // تحقق من وجود كيانات مشتركة
        if (previousContext.primaryEntity && currentInteraction.entities) {
            const prevEntity = `${previousContext.primaryEntity.type}:${previousContext.primaryEntity.text}`;
            const hasCommonEntity = currentInteraction.entities.some(e => 
                `${e.type}:${e.text}` === prevEntity
            );
            if (hasCommonEntity) return true;
        }

        // تحقق من استخدام الضمائر الدالة على السياق
        const contextWords = ['هذا', 'هذه', 'ذلك', 'تلك', 'هو', 'هي', 'هم', 'فيه', 'فيها'];
        const hasContextWord = contextWords.some(word => 
            currentInteraction.user.includes(word)
        );
        
        // تحقق من الأسئلة القصيرة (غالباً متابعة)
        const isShortFollowUp = currentInteraction.user.length < 25 && 
                               currentInteraction.user.includes('؟');
        
        return hasContextWord || isShortFollowUp;
    }

    /**
     * 🔎 استرجاع السياق الحالي
     */
    getCurrentContext() {
        if (this.contextStack.length === 0) {
            return null;
        }
        return this.contextStack[this.contextStack.length - 1];
    }

    /**
     * 📚 استرجاع الكيان النشط من المحادثة السابقة
     */
    getActiveEntity() {
        const context = this.getCurrentContext();
        if (!context || !context.primaryEntity) {
            return null;
        }
        return context.primaryEntity;
    }

    /**
     * 🔄 إضافة السياق إلى الاستعلام الجديد
     */
    enrichQueryWithContext(userInput) {
        const context = this.getCurrentContext();
        if (!context) {
            return userInput;
        }

        // إذا كان الاستعلام قصيراً ويحتوي على ضمائر
        if (userInput.length < 30) {
            const contextWords = ['هذا', 'هذه', 'ذلك', 'هو', 'هي', 'هم'];
            const hasPronoun = contextWords.some(word => userInput.includes(word));
            
            if (hasPronoun && context.primaryEntity) {
                return `${context.primaryEntity.text} ${userInput}`;
            }
        }

        return userInput;
    }

    /**
     * 🧹 تنظيف الذاكرة القديمة
     */
    cleanupOldMemory(minutes = 30) {
        const cutoffTime = Date.now() - (minutes * 60 * 1000);
        
        // تنظيف التاريخ
        this.history = this.history.filter(item => 
            item.timestamp > cutoffTime
        );
        
        // تنظيف سلسلة الكيانات
        for (const [key, entity] of this.entityChain.entries()) {
            if (entity.lastSeen < cutoffTime) {
                this.entityChain.delete(key);
            }
        }
        
        // تنظيف مكدس السياق
        this.contextStack = this.contextStack.filter(ctx => 
            ctx.timestamp > cutoffTime
        );
        
        console.log(`🧹 تنظيف الذاكرة: بقي ${this.history.length} تفاعل`);
    }

    /**
     * 💾 تصدير حالة الذاكرة (للتخزين)
     */
    exportState() {
        return {
            history: this.history.slice(-10), // آخر 10 تفاعلات فقط
            contextStack: this.contextStack,
            entityChain: Array.from(this.entityChain.entries()),
            timestamp: Date.now()
        };
    }

    /**
     * 📥 استيراد حالة الذاكرة (من التخزين)
     */
    importState(state) {
        if (state.history) this.history = state.history;
        if (state.contextStack) this.contextStack = state.contextStack;
        if (state.entityChain) this.entityChain = new Map(state.entityChain);
        console.log(`📥 تم استيراد حالة الذاكرة: ${this.history.length} تفاعل`);
    }
}

// ============================================================================
// 🔗 الجزء 2: معالج الأسئلة المركبة
// ============================================================================

class ComplexQueryProcessor {
    constructor(assistant) {
        this.assistant = assistant;
        
        // كاش للنتائج الوسيطة
        this.resultCache = new Map();
        
        // أنماط الأسئلة المركبة
        this.complexPatterns = {
            // نمط: نشاط + منطقة
            activity_area: {
                triggers: ['في', 'بـ', 'ب', 'منطقة', 'بالمنطقة', 'بالمحافظة'],
                example: 'مصنع أغذية في العاشر من رمضان'
            },
            // نمط: نشاط + قرار
            activity_decision: {
                triggers: ['بموجب', 'وفق', 'طبقاً', 'قرار', '104'],
                example: 'ورشة معدنية بموجب قرار 104'
            },
            // نمط: منطقة + تعداد
            area_count: {
                triggers: ['كم', 'عدد', 'كام', 'تعداد', 'كثير'],
                example: 'كم منطقة في القاهرة'
            },
            // نمط: نشاط + متطلبات
            activity_requirements: {
                triggers: ['شروط', 'متطلبات', 'إجراءات', 'خطوات', 'كيف'],
                example: 'شروط فتح مصنع بلاستيك'
            },
            // نمط: مقارنة
            comparison: {
                triggers: ['مقارنة', 'أفضل', 'أقل', 'أكبر', 'أصغر', 'فرق'],
                example: 'مقارنة بين منطقة العاشر والسادات'
            }
        };
    }

    /**
     * 🔍 التحقق إذا كان السؤال مركباً
     */
    isComplexQuery(userInput) {
        const text = userInput.toLowerCase();
        
        // 1. التحقق من طول السؤال
        const wordCount = text.split(/\s+/).length;
        if (wordCount < 8) return false;
        
        // 2. التحقق من وجود روابط عطف
        const conjunctions = ['و', 'أيضاً', 'كذلك', 'بالإضافة', 'إلى جانب', 'ثم'];
        const hasConjunction = conjunctions.some(c => text.includes(c));
        
        // 3. التحقق من علامات الاستفهام المتعددة
        const questionMarks = (text.match(/[؟?]/g) || []).length;
        
        // 4. التحقق من الأنماط المعروفة
        let patternCount = 0;
        for (const pattern of Object.values(this.complexPatterns)) {
            if (pattern.triggers.some(trigger => text.includes(trigger))) {
                patternCount++;
            }
        }
        
        // اعتبار السؤال مركب إذا توفر شرطان أو أكثر
        return (hasConjunction && questionMarks >= 1) || 
               (patternCount >= 2) || 
               (wordCount > 15 && patternCount >= 1);
    }

    /**
     * 🧩 تفكيك السؤال المركب إلى مكونات
     */
    decomposeComplexQuery(userInput) {
        console.log('🧩 تفكيك السؤال المركب:', userInput);
        
        const components = [];
        const text = userInput.toLowerCase();
        
        // 1. تقسيم بواسطة الروابط
        const splitByConjunctions = this.splitByConjunctions(text);
        
        // 2. تقسيم بواسطة علامات الاستفهام
        const splitByQuestions = this.splitByQuestions(userInput);
        
        // 3. استخدام كلا الطريقتين
        if (splitByConjunctions.length > 1) {
            components.push(...splitByConjunctions);
        } else if (splitByQuestions.length > 1) {
            components.push(...splitByQuestions);
        } else {
            // إذا لم يمكن تقسيمه، حاول استخراج المكونات الدلالية
            const semanticComponents = this.extractSemanticComponents(userInput);
            components.push(...semanticComponents);
        }
        
        // تنظيف المكونات
        const cleaned = components
            .map(c => c.trim())
            .filter(c => c.length > 3 && !c.endsWith('؟؟'));
        
        console.log('📦 المكونات المفككة:', cleaned);
        return cleaned;
    }

    /**
     * 🔪 تقسيم النص بواسطة الروابط
     */
    splitByConjunctions(text) {
        const conjunctions = [' و ', ' أيضا ', ' كذلك ', ' بالإضافة ', ' إلى جانب ', ' ثم ', ' كما '];
        let parts = [text];
        
        conjunctions.forEach(conj => {
            const newParts = [];
            parts.forEach(part => {
                if (part.includes(conj)) {
                    const split = part.split(conj);
                    newParts.push(...split);
                } else {
                    newParts.push(part);
                }
            });
            parts = newParts;
        });
        
        return parts;
    }

    /**
     * ❓ تقسيم النص بواسطة علامات الاستفهام
     */
    splitByQuestions(text) {
        // استبدال علامات الاستفهام المتعددة
        const normalized = text.replace(/[؟?]+/g, '؟');
        return normalized.split('؟').filter(p => p.trim().length > 0);
    }

    /**
     * 🧠 استخراج المكونات الدلالية
     */
    extractSemanticComponents(userInput) {
        const components = [];
        
        // محاولة التعرف على الأجزاء عبر Vector Engine
        if (window.vEngine && window.vEngine.autoExtractEntities) {
            // هذا سيعمل عندما يكون Vector Engine جاهزاً
            // سنستخدمه لاستخراج الكيانات كمواضيع مستقلة
        }
        
        // طريقة بديلة: البحث عن كلمات مفتاحية تشير إلى مكونات
        const keywords = {
            'نشاط': ['مصنع', 'ورشة', 'مشروع', 'منشأة', 'عمل'],
            'منطقة': ['في', 'بـ', 'ب', 'منطقة', 'محافظة', 'مدينة'],
            'قرار': ['104', 'قرار', 'بموجب', 'وفقاً', 'طبقاً'],
            'متطلبات': ['شروط', 'متطلبات', 'إجراءات', 'وثائق', 'أوراق'],
            'تكلفة': ['تكلفة', 'سعر', 'ثمن', 'ميزانية', 'رأس مال']
        };
        
        Object.entries(keywords).forEach(([type, words]) => {
            if (words.some(word => userInput.includes(word))) {
                // استخراج الجملة التي تحتوي على الكلمة المفتاحية
                const sentences = userInput.split(/[.,،;؛]/);
                sentences.forEach(sentence => {
                    if (words.some(word => sentence.includes(word))) {
                        components.push(sentence.trim());
                    }
                });
            }
        });
        
        return components.length > 0 ? components : [userInput];
    }

    /**
     * 🔗 اكتشاف العلاقات بين المكونات
     */
    detectRelationships(components, originalQuery) {
        const relationships = [];
        
        // تحليل كل مكون مع الآخر
        for (let i = 0; i < components.length; i++) {
            for (let j = i + 1; j < components.length; j++) {
                const relation = this.analyzeRelation(components[i], components[j], originalQuery);
                if (relation) {
                    relationships.push({
                        component1: components[i],
                        component2: components[j],
                        type: relation.type,
                        strength: relation.strength,
                        direction: relation.direction
                    });
                }
            }
        }
        
        return relationships;
    }

    /**
     * 🔬 تحليل العلاقة بين مكونين
     */
    analyzeRelation(comp1, comp2, originalQuery) {
        // العلاقات المحتملة
        const relationTypes = {
            LOCATION: { // موقع
                indicators: ['في', 'بـ', 'بداخل', 'خلال', 'على'],
                strength: 0.8
            },
            CONDITION: { // شرط
                indicators: ['بموجب', 'وفق', 'طبقاً', 'بناء', 'تحت'],
                strength: 0.7
            },
            COMPARISON: { // مقارنة
                indicators: ['مقارنة', 'مقارنة بـ', 'أفضل من', 'أقل من', 'مثل'],
                strength: 0.6
            },
            SEQUENCE: { // تسلسل
                indicators: ['ثم', 'بعد', 'قبل', 'أولاً', 'ثانياً'],
                strength: 0.5
            },
            ADDITION: { // إضافة
                indicators: ['و', 'أيضاً', 'كذلك', 'بالإضافة'],
                strength: 0.4
            }
        };
        
        // البحث عن مؤشرات العلاقة في النص الأصلي
        const query = originalQuery.toLowerCase();
        
        for (const [type, info] of Object.entries(relationTypes)) {
            for (const indicator of info.indicators) {
                const indicatorWithSpaces = ` ${indicator} `;
                
                // تحقق إذا كان المؤشر يربط بين المكونين في النص الأصلي
                const comp1Lower = comp1.toLowerCase();
                const comp2Lower = comp2.toLowerCase();
                
                if (query.includes(comp1Lower) && query.includes(comp2Lower)) {
                    // البحث عن المؤشر بين المكونين
                    const pattern = new RegExp(`${comp1Lower}.*?${indicatorWithSpaces}.*?${comp2Lower}|${comp2Lower}.*?${indicatorWithSpaces}.*?${comp1Lower}`);
                    
                    if (pattern.test(query)) {
                        return {
                            type: type,
                            strength: info.strength,
                            direction: query.indexOf(comp1Lower) < query.indexOf(comp2Lower) ? 'comp1→comp2' : 'comp2→comp1'
                        };
                    }
                }
            }
        }
        
        return null;
    }

    /**
     * 🎯 معالجة السؤال المركب الرئيسية
     */
    async processComplexQuery(userInput) {
        console.log('🔗 معالجة سؤال مركب:', userInput);
        
        // 1. تفكيك السؤال إلى مكونات
        const components = this.decomposeComplexQuery(userInput);
        
        if (components.length <= 1) {
            console.log('⚠️ لم يمكن تفكيك السؤال إلى مكونات');
            return null;
        }
        
        // 2. اكتشاف العلاقات بين المكونات
        const relationships = this.detectRelationships(components, userInput);
        
        // 3. معالجة كل مكون على حدة
        const componentResults = [];
        
        for (const component of components) {
            console.log(`🔍 معالجة المكون: "${component}"`);
            
            try {
                // استخدام المساعد الأساسي لمعالجة كل مكون
                const result = await this.assistant.processQueryComponent(component);
                
                if (result) {
                    componentResults.push({
                        component: component,
                        result: result,
                        confidence: result.confidence || 0.5
                    });
                }
            } catch (error) {
                console.error(`❌ خطأ في معالجة المكون "${component}":`, error);
            }
        }
        
        // 4. بناء خطة الرد
        const responsePlan = this.buildResponsePlan(componentResults, relationships, userInput);
        
        return responsePlan;
    }

    /**
     * 🏗️ بناء خطة للرد المركب
     */
    buildResponsePlan(componentResults, relationships, originalQuery) {
        console.log('🏗️ بناء خطة رد مركب');
        
        const plan = {
            type: 'complex_response',
            originalQuery: originalQuery,
            components: componentResults,
            relationships: relationships,
            structure: this.determineResponseStructure(componentResults, relationships),
            confidence: this.calculateOverallConfidence(componentResults)
        };
        
        // تحديد هيكل الرد بناءً على العلاقات
        if (relationships.some(r => r.type === 'COMPARISON')) {
            plan.responseType = 'comparison';
        } else if (relationships.some(r => r.type === 'SEQUENCE')) {
            plan.responseType = 'sequence';
        } else if (relationships.some(r => r.type === 'LOCATION')) {
            plan.responseType = 'location_based';
        } else {
            plan.responseType = 'combined';
        }
        
        return plan;
    }

    /**
     * 🏛️ تحديد هيكل الرد
     */
    determineResponseStructure(components, relationships) {
        // إذا كان هناك علاقة مقارنة
        if (relationships.some(r => r.type === 'COMPARISON')) {
            return {
                type: 'comparison_table',
                sections: ['المقارنة', 'النقاط المشتركة', 'الاختلافات', 'التوصية']
            };
        }
        
        // إذا كان هناك علاقة تسلسل
        if (relationships.some(r => r.type === 'SEQUENCE')) {
            return {
                type: 'step_by_step',
                sections: ['الخطوات', 'المتطلبات', 'الوقت المتوقع', 'الملاحظات']
            };
        }
        
        // إذا كان هناك علاقة موقع
        if (relationships.some(r => r.type === 'LOCATION')) {
            return {
                type: 'location_focused',
                sections: ['الموقع', 'المتطلبات المحلية', 'التراخيص', 'المزايا']
            };
        }
        
        // هيكل عام
        return {
            type: 'comprehensive',
            sections: ['المقدمة', 'النتائج', 'التفاصيل', 'الخلاصة']
        };
    }

    /**
     * 📊 حساب الثقة العامة
     */
    calculateOverallConfidence(componentResults) {
        if (componentResults.length === 0) return 0;
        
        const totalConfidence = componentResults.reduce((sum, comp) => 
            sum + (comp.confidence || 0.5), 0
        );
        
        const avgConfidence = totalConfidence / componentResults.length;
        
        // خفض الثقة إذا كان هناك مكونات منخفضة الثقة
        const lowConfidenceComponents = componentResults.filter(c => c.confidence < 0.4).length;
        const penalty = lowConfidenceComponents * 0.1;
        
        return Math.max(0.1, Math.min(0.95, avgConfidence - penalty));
    }

    /**
     * ✍️ توليد الرد المركب
     */
    async generateComplexResponse(plan) {
        if (!plan || plan.components.length === 0) {
            return this.assistant.createResponse(
                'عذراً، لم أستطع تحليل سؤالك المركب بشكل كامل. يمكنك طرح كل جزء على حدة.',
                'complex_error',
                0.3
            );
        }
        
        let responseText = `✅ **تحليل السؤال المركب:**\n\n`;
        
        // بناء الرد حسب النوع
        switch (plan.responseType) {
            case 'comparison':
                responseText += this.buildComparisonResponse(plan);
                break;
                
            case 'sequence':
                responseText += this.buildSequenceResponse(plan);
                break;
                
            case 'location_based':
                responseText += this.buildLocationResponse(plan);
                break;
                
            default:
                responseText += this.buildCombinedResponse(plan);
                break;
        }
        
        // إضافة ملاحظة عن الثقة
        const confidencePercent = Math.round(plan.confidence * 100);
        if (confidencePercent < 70) {
            responseText += `\n\n⚠️ **ملاحظة:** درجة الثقة العامة ${confidencePercent}% - قد تحتاج بعض المعلومات للتأكد.`;
        }
        
        return this.assistant.createResponse(
            responseText,
            'complex',
            plan.confidence,
            { plan: plan }
        );
    }

    /**
     * ⚖️ بناء رد المقارنة
     */
    buildComparisonResponse(plan) {
        let text = `**مقارنة بين ${plan.components.length} عنصر:**\n\n`;
        
        plan.components.forEach((comp, index) => {
            text += `${index + 1}. **${comp.component}**\n`;
            
            if (comp.result && comp.result.data) {
                // استخراج نقاط المقارنة الرئيسية
                const keyPoints = this.extractComparisonPoints(comp.result.data);
                keyPoints.forEach(point => {
                    text += `   • ${point}\n`;
                });
            }
            
            text += `   (الثقة: ${Math.round((comp.confidence || 0.5) * 100)}%)\n\n`;
        });
        
        // إضافة خلاصة المقارنة
        text += `**الخلاصة:**\n`;
        
        if (plan.relationships.length > 0) {
            const comparisonRel = plan.relationships.find(r => r.type === 'COMPARISON');
            if (comparisonRel) {
                text += `- العلاقة: ${comparisonRel.direction === 'comp1→comp2' ? 'أفضلية' : 'تماثل'}\n`;
            }
        }
        
        return text;
    }

    /**
     * 📋 بناء رد التسلسل
     */
    buildSequenceResponse(plan) {
        let text = `**الخطوات المتسلسلة:**\n\n`;
        
        // ترتيب المكونات حسب العلاقات
        const orderedComponents = this.orderBySequence(plan.components, plan.relationships);
        
        orderedComponents.forEach((comp, index) => {
            text += `**الخطوة ${index + 1}: ${comp.component}**\n`;
            
            if (comp.result && comp.result.steps) {
                comp.result.steps.forEach(step => {
                    text += `   ${step}\n`;
                });
            } else if (comp.result && comp.result.data) {
                text += `   ${this.extractKeyInfo(comp.result.data)}\n`;
            }
            
            text += '\n';
        });
        
        return text;
    }

    /**
     * 🗺️ بناء رد الموقع
     */
    buildLocationResponse(plan) {
        let text = `**التحليل الجغرافي:**\n\n`;
        
        // البحث عن مكون الموقع
        const locationComp = plan.components.find(comp => 
            comp.component.includes('في') || 
            comp.component.includes('بـ') ||
            comp.component.includes('منطقة')
        );
        
        if (locationComp && locationComp.result) {
            text += `**الموقع:** ${locationComp.component}\n`;
            text += this.formatLocationInfo(locationComp.result.data);
            text += '\n';
        }
        
        // إضافة المكونات الأخرى
        plan.components.forEach((comp, index) => {
            if (comp !== locationComp) {
                text += `**${comp.component}**\n`;
                if (comp.result && comp.result.data) {
                    text += this.extractKeyInfo(comp.result.data) + '\n';
                }
                text += '\n';
            }
        });
        
        return text;
    }

    /**
     * 🧩 بناء رد مدمج
     */
    buildCombinedResponse(plan) {
        let text = `**تحليل متكامل:**\n\n`;
        
        plan.components.forEach((comp, index) => {
            text += `**الجزء ${index + 1}: ${comp.component}**\n`;
            
            if (comp.result) {
                if (comp.result.summary) {
                    text += `   ${comp.result.summary}\n`;
                } else if (comp.result.data) {
                    const keyInfo = this.extractKeyInfo(comp.result.data);
                    text += `   ${keyInfo.substring(0, 150)}...\n`;
                }
            }
            
            text += `   (الثقة: ${Math.round((comp.confidence || 0.5) * 100)}%)\n\n`;
        });
        
        // إضافة العلاقات إذا وجدت
        if (plan.relationships.length > 0) {
            text += `**العلاقات المكتشفة:**\n`;
            plan.relationships.forEach(rel => {
                text += `- ${rel.component1} ←[${rel.type}]→ ${rel.component2}\n`;
            });
        }
        
        return text;
    }

    /**
     * 🛠️ دوال مساعدة
     */
    extractComparisonPoints(data) {
        const points = [];
        
        if (data.details) {
            if (data.details.req) points.push(`المتطلبات: ${data.details.req.substring(0, 80)}...`);
            if (data.details.loc) points.push(`الموقع: ${data.details.loc}`);
            if (data.details.auth) points.push(`الجهة: ${data.details.auth.substring(0, 60)}...`);
        }
        
        if (data.keywords) {
            points.push(`الكلمات المفتاحية: ${data.keywords.slice(0, 3).join(', ')}`);
        }
        
        return points.slice(0, 3); // 3 نقاط فقط للمقارنة
    }

    extractKeyInfo(data) {
        if (!data) return 'لا توجد معلومات تفصيلية';
        
        let info = '';
        
        if (data.text) info += `${data.text}. `;
        if (data.details && data.details.act) {
            info += `${data.details.act.substring(0, 100)}... `;
        }
        
        return info || 'معلومات عامة متاحة';
    }

    formatLocationInfo(data) {
        if (!data) return 'لا توجد معلومات موقعية';
        
        let info = '';
        
        if (data.governorate) info += `المحافظة: ${data.governorate}\n`;
        if (data.area) info += `المساحة: ${data.area} فدان\n`;
        if (data.decision) info += `القرار: ${data.decision.substring(0, 60)}...\n`;
        
        return info;
    }

    orderBySequence(components, relationships) {
        // طريقة بسيطة للترتيب - يمكن تطويرها
        return [...components].sort((a, b) => {
            const rel = relationships.find(r => 
                (r.component1 === a.component && r.component2 === b.component) ||
                (r.component1 === b.component && r.component2 === a.component)
            );
            
            if (rel && rel.type === 'SEQUENCE') {
                return rel.direction === 'comp1→comp2' ? -1 : 1;
            }
            
            return 0;
        });
    }
}

// ============================================================================
// 🎓 الجزء 3: محرك التعلم الذاتي
// ============================================================================

class LearningEngine {
    constructor(assistant) {
        this.assistant = assistant;
        
        // قاعدة التعلم
        this.learnedPatterns = new Map();
        this.userCorrections = new Map();
        this.successMetrics = new Map();
        this.adaptiveThresholds = new Map();
        
        // إحصائيات
        this.stats = {
            totalInteractions: 0,
            successfulPredictions: 0,
            learnedSynonyms: 0,
            correctedErrors: 0,
            lastLearningTime: null
        };
    }

    /**
     * 📚 التعلم من التفاعل
     */
    learnFromInteraction(userInput, understanding, analysis, response, userFeedback = null) {
        this.stats.totalInteractions++;
        
        // 1. تعلم الأنماط الناجحة
        if (analysis.confidence > 0.6 && response.type !== 'no_results') {
            this.learnSuccessPattern(userInput, understanding, analysis);
        }
        
        // 2. تعلم المرادفات
        if (analysis.primaryResult && understanding.entities.length > 0) {
            this.learnSynonyms(understanding.entities, analysis.primaryResult);
        }
        
        // 3. التعلم من تصحيحات المستخدم
        if (userFeedback) {
            this.learnFromCorrection(userInput, analysis, userFeedback);
        }
        
        // 4. تحديث المقاييس التكيفية
        this.updateAdaptiveMetrics(analysis, response);
        
        // 5. الحفظ الدوري
        if (this.stats.totalInteractions % 10 === 0) {
            this.saveLearningData();
        }
        
        this.stats.lastLearningTime = Date.now();
    }

    /**
     * 🎯 تعلم الأنماط الناجحة
     */
    learnSuccessPattern(userInput, understanding, analysis) {
        const patternKey = this.generatePatternKey(userInput, understanding);
        
        const patternData = {
            input: userInput,
            entities: understanding.entities,
            intent: understanding.intent,
            resultType: analysis.type,
            resultId: analysis.primaryResult?.id,
            confidence: analysis.confidence,
            timestamp: Date.now(),
            usedCount: 0
        };
        
        if (this.learnedPatterns.has(patternKey)) {
            const existing = this.learnedPatterns.get(patternKey);
            existing.usedCount++;
            existing.lastUsed = Date.now();
            existing.confidence = (existing.confidence + analysis.confidence) / 2;
            this.learnedPatterns.set(patternKey, existing);
        } else {
            this.learnedPatterns.set(patternKey, patternData);
        }
        
        // تحديث مقاييس النجاح
        const resultKey = analysis.primaryResult?.id || 'unknown';
        this.updateSuccessMetrics(resultKey, analysis.confidence);
    }

    /**
     * 🔤 تعلم المرادفات
     */
    learnSynonyms(entities, primaryResult) {
        if (!primaryResult || !primaryResult.id) return;
        
        entities.forEach(entity => {
            const synonymKey = primaryResult.id;
            const synonymValue = entity.text;
            
            if (synonymKey !== synonymValue) { // تجنب المرادفات المتماثلة
                const existing = this.assistant.learning.discoveredSynonyms.get(synonymKey) || [];
                
                if (!existing.includes(synonymValue)) {
                    existing.push(synonymValue);
                    this.assistant.learning.discoveredSynonyms.set(synonymKey, existing);
                    this.stats.learnedSynonyms++;
                    
                    console.log(`📚 تعلم مرادف جديد: "${synonymKey}" ← "${synonymValue}"`);
                }
            }
        });
    }

    /**
     * 🛠️ التعلم من التصحيحات
     */
    learnFromCorrection(userInput, analysis, feedback) {
        const correctionKey = `correction_${Date.now()}`;
        
        const correctionData = {
            originalInput: userInput,
            originalAnalysis: analysis,
            feedback: feedback,
            timestamp: Date.now(),
            learned: false
        };
        
        this.userCorrections.set(correctionKey, correctionData);
        this.stats.correctedErrors++;
        
        // تطبيق التعلم الفوري
        this.applyImmediateLearning(correctionData);
        
        console.log(`🛠️ تعلم من تصحيح: ${feedback.type || 'تصحيح عام'}`);
    }

    /**
     * ⚡ تطبيق التعلم الفوري
     */
    applyImmediateLearning(correction) {
        // تحليل التصحيح
        if (correction.feedback.type === 'wrong_entity') {
            // إذا صحح المستخدم الكيان
            this.adjustEntityConfidence(
                correction.originalAnalysis.primaryResult?.id,
                correction.feedback.correctEntity,
                -0.3 // خفض الثقة في الكيان الخاطئ
            );
        }
        
        if (correction.feedback.type === 'right_entity_low_confidence') {
            // إذا أكد المستخدم على كيان كان ثقتنا فيه منخفضة
            this.adjustEntityConfidence(
                correction.originalAnalysis.primaryResult?.id,
                null,
                0.2 // رفع الثقة
            );
        }
    }

    /**
     * 📊 تحديث المقاييس التكيفية
     */
    updateAdaptiveMetrics(analysis, response) {
        const isSuccess = response.type !== 'no_results' && 
                         analysis.confidence > 0.5 && 
                         response.confidence > 0.5;
        
        if (isSuccess) {
            this.stats.successfulPredictions++;
        }
        
        // تحديث العتبات التكيفية حسب نوع الاستعلام
        const queryType = analysis.type || 'general';
        const currentThreshold = this.adaptiveThresholds.get(queryType) || 0.35;
        
        let newThreshold = currentThreshold;
        
        if (isSuccess) {
            // نجاح متكرر → خفض العتبة (نظام أكثر جرأة)
            newThreshold = Math.max(0.2, currentThreshold * 0.95);
        } else {
            // فشل متكرر → رفع العتبة (نظام أكثر حذراً)
            newThreshold = Math.min(0.7, currentThreshold * 1.05);
        }
        
        this.adaptiveThresholds.set(queryType, newThreshold);
        
        console.log(`📊 تحديث عتبة ${queryType}: ${currentThreshold.toFixed(3)} → ${newThreshold.toFixed(3)}`);
    }

    /**
     * 🔑 توليد مفتاح النمط
     */
    generatePatternKey(userInput, understanding) {
        // استخدام الكيانات والنية كمفتاح
        const entityKeys = understanding.entities
            .map(e => `${e.type}:${e.text.substring(0, 15)}`)
            .sort()
            .join('|');
        
        const intentKey = understanding.intent || 'general';
        const complexityKey = understanding.complexity || 'medium';
        
        return `${intentKey}|${complexityKey}|${entityKeys}`;
    }

    /**
     * 🔍 البحث عن أنماط مطابقة
     */
    findMatchingPattern(userInput, understanding) {
        const patternKey = this.generatePatternKey(userInput, understanding);
        
        // البحث عن تطابق كامل
        if (this.learnedPatterns.has(patternKey)) {
            return this.learnedPatterns.get(patternKey);
        }
        
        // البحث عن تطابق جزئي
        for (const [key, pattern] of this.learnedPatterns.entries()) {
            if (this.patternsMatchPartially(key, patternKey)) {
                return pattern;
            }
        }
        
        return null;
    }

    /**
     * 🔄 مقارنة الأنماط جزئياً
     */
    patternsMatchPartially(patternKey1, patternKey2) {
        const parts1 = patternKey1.split('|');
        const parts2 = patternKey2.split('|');
        
        // المقارنة مع بعض المرونة
        let matchScore = 0;
        
        // مقارنة النية
        if (parts1[0] === parts2[0]) matchScore += 0.4;
        
        // مقارنة الكيانات (مع مرونة)
        const entities1 = parts1.slice(2);
        const entities2 = parts2.slice(2);
        
        const commonEntities = entities1.filter(e1 => 
            entities2.some(e2 => this.entitiesSimilar(e1, e2))
        );
        
        matchScore += (commonEntities.length / Math.max(entities1.length, entities2.length)) * 0.6;
        
        return matchScore > 0.7; // عتبة 70% تطابق
    }

    /**
     * 🔤 مقارنة الكيانات
     */
    entitiesSimilar(entity1, entity2) {
        // تبسيط المقارنة
        const e1 = entity1.toLowerCase();
        const e2 = entity2.toLowerCase();
        
        // تحقق من التطابق الجزئي
        return e1.includes(e2) || e2.includes(e1) || 
               this.levenshteinDistance(e1, e2) < Math.min(e1.length, e2.length) * 0.3;
    }

    /**
     * 📏 حساب مسافة ليفنشتاين (للمقارنة التقريبية)
     */
    levenshteinDistance(a, b) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        const matrix = [];

        // تهيئة المصفوفة
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        // حساب المسافة
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // استبدال
                        matrix[i][j - 1] + 1,     // إدراج
                        matrix[i - 1][j] + 1      // حذف
                    );
                }
            }
        }

        return matrix[b.length][a.length];
    }

    /**
     * ⚖️ ضبط ثقة الكيان
     */
    adjustEntityConfidence(entityId, correctEntityId, adjustment) {
        if (!this.assistant.learning.confidenceAdjustments) {
            this.assistant.learning.confidenceAdjustments = new Map();
        }
        
        const key = entityId || 'general';
        const current = this.assistant.learning.confidenceAdjustments.get(key) || 0;
        const newValue = Math.max(-0.5, Math.min(0.5, current + adjustment));
        
        this.assistant.learning.confidenceAdjustments.set(key, newValue);
        
        console.log(`⚖️ ضبط ثقة "${key}": ${current.toFixed(2)} → ${newValue.toFixed(2)}`);
    }

    /**
     * 💾 حفظ بيانات التعلم
     */
    saveLearningData() {
        try {
            const learningData = {
                patterns: Array.from(this.learnedPatterns.entries()),
                corrections: Array.from(this.userCorrections.entries()),
                thresholds: Array.from(this.adaptiveThresholds.entries()),
                stats: this.stats,
                timestamp: Date.now()
            };
            
            localStorage.setItem('smart_assistant_learning', JSON.stringify(learningData));
            console.log('💾 حفظ بيانات التعلم');
        } catch (error) {
            console.error('❌ فشل حفظ بيانات التعلم:', error);
        }
    }

    /**
     * 📥 تحميل بيانات التعلم
     */
    loadLearningData() {
        try {
            const saved = localStorage.getItem('smart_assistant_learning');
            if (!saved) return false;
            
            const learningData = JSON.parse(saved);
            
            // استعادة البيانات
            this.learnedPatterns = new Map(learningData.patterns || []);
            this.userCorrections = new Map(learningData.corrections || []);
            this.adaptiveThresholds = new Map(learningData.thresholds || []);
            this.stats = learningData.stats || this.stats;
            
            console.log('📥 تحميل بيانات التعلم:', this.learnedPatterns.size, 'نمط');
            return true;
        } catch (error) {
            console.error('❌ فشل تحميل بيانات التعلم:', error);
            return false;
        }
    }

    /**
     * 📊 الحصول على إحصائيات التعلم
     */
    getLearningStats() {
        return {
            ...this.stats,
            patternCount: this.learnedPatterns.size,
            synonymCount: this.assistant.learning.discoveredSynonyms.size,
            correctionCount: this.userCorrections.size,
            successRate: this.stats.totalInteractions > 0 
                ? (this.stats.successfulPredictions / this.stats.totalInteractions).toFixed(2)
                : 0
        };
    }
}

// ============================================================================
// 🎭 الجزء 4: مدير السياق الذكي
// ============================================================================

class ContextManager {
    constructor(assistant) {
        this.assistant = assistant;
        
        // حالات السياق
        this.activeContext = null;
        this.contextHistory = [];
        this.entityFocus = null;
        this.conversationFlow = [];
        
        // إعدادات
        this.maxContextHistory = 10;
        this.contextTimeout = 300000; // 5 دقائق
    }

    /**
     * 🔍 تحليل وتحديث السياق
     */
    updateContext(userInput, analysis, response) {
        // 1. تحليل الاستعلام للكشف عن تغيير السياق
        const contextShift = this.detectContextShift(userInput);
        
        // 2. إذا كان هناك تغيير كبير في السياق، إعادة ضبط
        if (contextShift.major) {
            this.resetContext();
            console.log('🔄 إعادة ضبط السياق بسبب تغيير كبير');
        }
        
        // 3. تحديث تركيز الكيان
        this.updateEntityFocus(analysis);
        
        // 4. تسجيل تدفق المحادثة
        this.recordConversationFlow(userInput, response, analysis);
        
        // 5. تحديث السياق النشط
        this.activeContext = {
            timestamp: Date.now(),
            userInput: userInput,
            primaryEntity: this.entityFocus,
            intent: analysis.understanding?.intent || 'general',
            analysisType: analysis.type,
            confidence: analysis.confidence,
            contextShift: contextShift
        };
        
        // 6. حفظ في التاريخ
        this.saveToHistory();
        
        // 7. تنظيف السياق المنتهي
        this.cleanupExpiredContexts();
        
        return this.activeContext;
    }

    /**
     * 🎯 اكتشاف تغيير السياق
     */
    detectContextShift(userInput) {
        if (!this.activeContext) {
            return { major: true, reason: 'no_previous_context' };
        }
        
        const now = Date.now();
        const timeDiff = now - this.activeContext.timestamp;
        
        // إذا مر أكثر من 5 دقائق، يعتبر تغيير سياق
        if (timeDiff > this.contextTimeout) {
            return { major: true, reason: 'timeout' };
        }
        
        // تحليل النص لاكتشاف تغيير الموضوع
        const currentTopics = this.extractTopics(userInput);
        const previousTopics = this.activeContext.topics || [];
        
        // حساب تشابه الموضوع
        const similarity = this.calculateTopicSimilarity(currentTopics, previousTopics);
        
        if (similarity < 0.3) {
            return { 
                major: true, 
                reason: 'topic_change',
                similarity: similarity 
            };
        }
        
        // تحليل النية
        const currentIntent = this.inferIntentFromText(userInput);
        const previousIntent = this.activeContext.intent;
        
        if (currentIntent !== previousIntent && 
            !this.areIntentsRelated(currentIntent, previousIntent)) {
            return { 
                major: true, 
                reason: 'intent_change',
                from: previousIntent,
                to: currentIntent
            };
        }
        
        // تغيير طفيف
        return { 
            major: false, 
            reason: 'continuation',
            similarity: similarity
        };
    }

    /**
     * 🏷️ تحديث تركيز الكيان
     */
    updateEntityFocus(analysis) {
        if (!analysis || !analysis.primaryResult) {
            // إذا لم يكن هناك كيان جديد، احتفظ بالقديم
            if (!this.entityFocus && this.activeContext) {
                this.entityFocus = this.activeContext.primaryEntity;
            }
            return;
        }
        
        const newEntity = {
            type: analysis.type,
            id: analysis.primaryResult.id,
            name: analysis.primaryResult.text || analysis.primaryResult.name,
            confidence: analysis.confidence
        };
        
        // إذا كان هناك كيان نشط، تحقق إذا كان نفس الكيان
        if (this.entityFocus) {
            const isSameEntity = this.areEntitiesSame(this.entityFocus, newEntity);
            
            if (isSameEntity) {
                // تحديث الثقة فقط
                this.entityFocus.confidence = Math.max(
                    this.entityFocus.confidence,
                    newEntity.confidence
                );
                this.entityFocus.lastUpdated = Date.now();
            } else {
                // كيان جديد
                this.entityFocus = newEntity;
                console.log(`🎯 تغيير تركيز الكيان إلى: ${newEntity.name}`);
            }
        } else {
            // لا يوجد كيان نشط، ضبط الجديد
            this.entityFocus = newEntity;
        }
    }

    /**
     * 📝 تسجيل تدفق المحادثة
     */
    recordConversationFlow(userInput, response, analysis) {
        const flowEntry = {
            timestamp: Date.now(),
            userInput: userInput,
            responseType: response.type,
            analysisType: analysis.type,
            entityFocus: this.entityFocus,
            confidence: analysis.confidence,
            contextId: this.activeContext?.id || 'new'
        };
        
        this.conversationFlow.push(flowEntry);
        
        // الحفاظ على الطول المعقول
        if (this.conversationFlow.length > 20) {
            this.conversationFlow.shift();
        }
    }

    /**
     * 🔧 إعادة ضبط السياق
     */
    resetContext() {
        this.activeContext = null;
        this.entityFocus = null;
        // لا نمسح التاريخ بالكامل، فقط السياق النشط
        console.log('🧹 إعادة ضبط السياق');
    }

    /**
     * 💾 حفظ في التاريخ
     */
    saveToHistory() {
        if (!this.activeContext) return;
        
        const contextCopy = {
            ...this.activeContext,
            id: 'ctx_' + Date.now(),
            entityFocus: this.entityFocus,
            flowLength: this.conversationFlow.length
        };
        
        this.contextHistory.push(contextCopy);
        
        // الحفاظ على الحد الأقصى
        if (this.contextHistory.length > this.maxContextHistory) {
            this.contextHistory.shift();
        }
    }

    /**
     * 🧹 تنظيف السياقات المنتهية
     */
    cleanupExpiredContexts() {
        const cutoffTime = Date.now() - this.contextTimeout;
        
        this.contextHistory = this.contextHistory.filter(ctx => 
            ctx.timestamp > cutoffTime
        );
        
        // إذا كان السياق النشط منتهي، أعد ضبطه
        if (this.activeContext && this.activeContext.timestamp < cutoffTime) {
            this.resetContext();
        }
    }

    /**
     * 🔍 الحصول على السياق المناسب للاستعلام
     */
    getRelevantContext(userInput) {
        if (!this.activeContext) {
            return null;
        }
        
        // تحليل الاستعلام الجديد
        const currentTopics = this.extractTopics(userInput);
        const currentIntent = this.inferIntentFromText(userInput);
        
        // حساب الأهمية السياقية
        let relevanceScore = 0;
        
        // 1. تشابه الموضوع
        const topicSimilarity = this.calculateTopicSimilarity(
            currentTopics,
            this.activeContext.topics || []
        );
        relevanceScore += topicSimilarity * 0.4;
        
        // 2. علاقة النية
        if (this.areIntentsRelated(currentIntent, this.activeContext.intent)) {
            relevanceScore += 0.3;
        }
        
        // 3. استمرارية الوقت
        const timeDiff = Date.now() - this.activeContext.timestamp;
        const timeFactor = Math.max(0, 1 - (timeDiff / this.contextTimeout));
        relevanceScore += timeFactor * 0.3;
        
        // 4. إذا كان هناك كيان نشط والاستعلام يشير إليه
        if (this.entityFocus && this.doesInputReferenceEntity(userInput, this.entityFocus)) {
            relevanceScore += 0.2;
        }
        
        console.log(`📊 أهمية السياق: ${relevanceScore.toFixed(2)}`);
        
        return relevanceScore > 0.5 ? this.activeContext : null;
    }

    /**
     * 🛠️ دوال مساعدة
     */
    extractTopics(text) {
        const words = text.toLowerCase().split(/\s+/);
        
        // كلمات تهميش
        const stopWords = ['ما', 'هل', 'كيف', 'أين', 'متى', 'لماذا', 'من', 'في', 'على', 'إلى'];
        
        // كلمات موضوعية (من مجالك)
        const topicWords = [
            'مصنع', 'ورشة', 'نشاط', 'صناعي', 'منطقة', 'قرار', '104',
            'رخصة', 'ترخيص', 'إجراءات', 'متطلبات', 'شروط', 'تكلفة',
            'استثمار', 'تشغيل', 'تأسيس', 'سجل', 'هيئة', 'محافظة'
        ];
        
        return words.filter(word => 
            !stopWords.includes(word) && 
            topicWords.some(topic => word.includes(topic) || topic.includes(word))
        );
    }

    calculateTopicSimilarity(topics1, topics2) {
        if (!topics1.length || !topics2.length) return 0;
        
        const set1 = new Set(topics1);
        const set2 = new Set(topics2);
        
        const intersection = [...set1].filter(x => set2.has(x)).length;
        const union = new Set([...topics1, ...topics2]).size;
        
        return union > 0 ? intersection / union : 0;
    }

    inferIntentFromText(text) {
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('104') || lowerText.includes('قرار')) {
            return 'decision_info';
        }
        
        if (lowerText.includes('منطقة') || lowerText.includes('محافظة') || lowerText.includes('في ')) {
            return 'area_info';
        }
        
        if (lowerText.includes('نشاط') || lowerText.includes('مصنع') || lowerText.includes('ورشة')) {
            return 'activity_info';
        }
        
        if (lowerText.includes('شروط') || lowerText.includes('متطلبات') || lowerText.includes('إجراءات')) {
            return 'requirements';
        }
        
        if (lowerText.includes('كم') || lowerText.includes('عدد') || lowerText.includes('كثير')) {
            return 'count';
        }
        
        return 'general';
    }

    areIntentsRelated(intent1, intent2) {
        const relatedGroups = {
            'activity_info': ['requirements', 'general'],
            'area_info': ['count', 'general'],
            'decision_info': ['activity_info', 'general'],
            'requirements': ['activity_info', 'general'],
            'count': ['area_info', 'general'],
            'general': ['activity_info', 'area_info', 'decision_info', 'requirements', 'count']
        };
        
        return relatedGroups[intent1]?.includes(intent2) || 
               relatedGroups[intent2]?.includes(intent1) ||
               intent1 === intent2;
    }

    areEntitiesSame(entity1, entity2) {
        if (!entity1 || !entity2) return false;
        
        // مقارنة مباشرة
        if (entity1.id && entity2.id && entity1.id === entity2.id) {
            return true;
        }
        
        // مقارنة الأسماء (مع مرونة)
        if (entity1.name && entity2.name) {
            const name1 = entity1.name.toLowerCase();
            const name2 = entity2.name.toLowerCase();
            
            return name1.includes(name2) || 
                   name2.includes(name1) ||
                   this.levenshteinDistance(name1, name2) < Math.min(name1.length, name2.length) * 0.3;
        }
        
        return false;
    }

    doesInputReferenceEntity(input, entity) {
        if (!entity || !entity.name) return false;
        
        const lowerInput = input.toLowerCase();
        const entityName = entity.name.toLowerCase();
        
        // تحقق من وجود اسم الكيان
        if (lowerInput.includes(entityName)) {
            return true;
        }
        
        // تحقق من الضمائر الدالة
        const contextPronouns = ['هذا', 'هذه', 'ذلك', 'تلك', 'هو', 'هي'];
        const hasPronoun = contextPronouns.some(pronoun => lowerInput.includes(pronoun));
        
        // تحقق من الأسئلة القصيرة التالية
        const isShortFollowUp = lowerInput.length < 25 && 
                               lowerInput.includes('؟') &&
                               (lowerInput.includes('في') || lowerInput.includes('بـ'));
        
        return hasPronoun || isShortFollowUp;
    }

    levenshteinDistance(a, b) {
        // نفس الدالة المستخدمة في LearningEngine
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        const matrix = [];
        for (let i = 0; i <= b.length; i++) matrix[i] = [i];
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                const cost = a.charAt(j - 1) === b.charAt(i - 1) ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + cost
                );
            }
        }

        return matrix[b.length][a.length];
    }

    /**
     * 📊 الحصول على حالة السياق
     */
    getContextState() {
        return {
            activeContext: this.activeContext,
            entityFocus: this.entityFocus,
            historyCount: this.contextHistory.length,
            flowCount: this.conversationFlow.length,
            isActive: !!this.activeContext
        };
    }
}

// ============================================================================
// 🧠 الجزء 5: الفئة الرئيسية للمساعد الذكي (محدثة)
// ============================================================================

class TrulySmartAssistant {
    constructor() {
        console.log('🚀 تهيئة المستشار الذكي V12 المتكامل...');
        
        // ═══════════ الأنظمة الأساسية ═══════════
        this.memorySystem = new ConversationMemory(this);
        this.complexProcessor = new ComplexQueryProcessor(this);
        this.learningEngine = new LearningEngine(this);
        this.contextManager = new ContextManager(this);
        
        // ═══════════ الذاكرة والمعرفة ═══════════
        this.memory = {
            conversation: [],
            context: {
                currentEntity: null,
                currentType: null,
                currentData: null,
                relatedEntities: [],
                timestamp: null
            }
        };
        
        // ═══════════ قواعد البيانات المحلية ═══════════
        this.db = {
            activities: null,
            industrial: null,
            decision104: null
        };
        
        // ═══════════ نظام التعلم (موروث) ═══════════
        this.learning = {
            discoveredSynonyms: new Map(),
            successPatterns: new Map(),
            failurePatterns: new Map(),
            userCorrections: new Map(),
            confidenceAdjustments: new Map()
        };
        
        // ═══════════ الإحصائيات ═══════════
        this.stats = {
            total: 0,
            successful: 0,
            learned: 0,
            ambiguous: 0,
            complexQueries: 0,
            contextUses: 0
        };
        
        // ═══════════ التهيئة ═══════════
        this.init();
    }
    
    async init() {
        console.log('🚀 تهيئة المستشار الذكي V12...');
        
        // تحميل القواعد المحلية
        if (typeof masterActivityDB !== 'undefined') {
            this.db.activities = masterActivityDB;
            console.log(`✅ قاعدة الأنشطة: ${masterActivityDB.length} نشاط`);
        }
        
        if (typeof industrialAreasData !== 'undefined') {
            this.db.industrial = industrialAreasData;
            console.log(`✅ قاعدة المناطق: ${industrialAreasData.length} منطقة`);
        }
        
        if (typeof sectorAData !== 'undefined') {
            this.db.decision104 = sectorAData;
            console.log('✅ قاعدة القرار 104');
        }
        
        // استعادة المعرفة المكتسبة
        this.restoreLearning();
        
        // تحميل تعلم محرك التعلم
        this.learningEngine.loadLearningData();
        
        console.log('✅ التهيئة اكتملت');
    }
    
    /**
     * 🎯 الدالة الرئيسية - الاستعلام الذكي (محدثة)
     */
    async query(userInput) {
        this.stats.total++;
        
        const raw = userInput.trim();
        console.log(`\n${'═'.repeat(70)}`);
        console.log(`💬 استفسار #${this.stats.total}: "${raw}"`);
        console.log(`${'═'.repeat(70)}\n`);
        
        try {
            // ─────── المرحلة 0: التحقق من السياق ───────
            const relevantContext = this.contextManager.getRelevantContext(raw);
            const contextualInput = relevantContext ? 
                this.memorySystem.enrichQueryWithContext(raw) : raw;
            
            if (relevantContext) {
                this.stats.contextUses++;
                console.log(`🔗 استخدام السياق النشط`);
            }
            
            // ─────── المرحلة 1: التحقق من الأسئلة المركبة ───────
            if (this.complexProcessor.isComplexQuery(contextualInput)) {
                this.stats.complexQueries++;
                console.log('🔗 اكتشاف سؤال مركب');
                return await this.handleComplexQuery(contextualInput);
            }
            
            // ─────── المرحلة 2: الفهم الدلالي العميق ───────
            const understanding = await this.deepUnderstanding(contextualInput);
            console.log('🧠 الفهم:', understanding);
            
            // ─────── المرحلة 3: البحث الذكي متعدد الطبقات ───────
            const searchResults = await this.multiLayerSearch(contextualInput, understanding);
            
            // ─────── المرحلة 4: التحليل الذكي ───────
            const analysis = this.smartAnalysis(searchResults, understanding, contextualInput);
            console.log('📊 التحليل:', analysis);
            
            // ─────── المرحلة 5: بناء الرد ───────
            const response = await this.buildIntelligentResponse(analysis, contextualInput);
            
            // ─────── المرحلة 6: التعلم من التفاعل ───────
            this.learnFromInteraction(contextualInput, understanding, analysis, response);
            
            // ─────── المرحلة 7: تحديث الذاكرة والسياق ───────
            this.updateMemory(contextualInput, response, analysis);
            this.contextManager.updateContext(raw, analysis, response);
            
            return response;
            
        } catch (error) {
            console.error('❌ خطأ في معالجة الاستعلام:', error);
            return this.createResponse(
                `عذراً، حدث خطأ في معالجة سؤالك: "${raw}"\n\nيمكنك إعادة صياغة السؤال أو تجزئته إلى أجزاء أصغر.`,
                'error',
                0.1
            );
        }
    }
    
    /**
     * 🔗 معالجة الأسئلة المركبة
     */
    async handleComplexQuery(userInput) {
        console.log('🔗 بدء معالجة سؤال مركب...');
        
        // 1. تحليل السؤال المركب
        const responsePlan = await this.complexProcessor.processComplexQuery(userInput);
        
        if (!responsePlan) {
            // إذا فشل التحليل، عالج كسؤال عادي
            console.log('⚠️ فشل تحليل السؤال المركب، معالجة كعادي');
            return await this.query(userInput);
        }
        
        // 2. توليد الرد المركب
        const response = await this.complexProcessor.generateComplexResponse(responsePlan);
        
        // 3. التعلم من التفاعل المركب
        this.learningEngine.learnFromInteraction(
            userInput,
            { entities: [], intent: 'complex', complexity: 'complex' },
            { type: 'complex', confidence: responsePlan.confidence },
            response
        );
        
        // 4. تحديث الذاكرة
        this.memorySystem.recordInteraction(userInput, response, {
            understanding: { intent: 'complex', entities: [] },
            type: 'complex',
            confidence: responsePlan.confidence
        });
        
        return response;
    }
    
    /**
     * 🧠 الفهم الدلالي العميق (محدث)
     */
    async deepUnderstanding(text) {
        const understanding = {
            entities: [],
            intent: null,
            complexity: 'simple',
            topics: [],
            contextual: false,
            requiresClarification: false,
            detectedRelations: []
        };
        
        // ─────── اكتشاف الكيانات عبر Vector Engine ───────
        if (window.vEngine && window.vEngine.isReady) {
            understanding.entities = await window.vEngine.autoExtractEntities(text);
        }
        
        // ─────── استخدام أنماط التعلم المكتسبة ───────
        const learnedPattern = this.learningEngine.findMatchingPattern(text, understanding);
        if (learnedPattern) {
            console.log(`🎓 استخدام النمط المتعلم: ${learnedPattern.resultType}`);
            understanding.intent = learnedPattern.intent;
            understanding.complexity = learnedPattern.complexity || 'medium';
        } else {
            // ─────── تقدير التعقيد ───────
            understanding.complexity = this.estimateComplexity(text);
            
            // ─────── كشف الاعتماد على السياق ───────
            understanding.contextual = this.isContextDependent(text);
            
            // ─────── استنتاج النية ───────
            understanding.intent = this.inferIntent(understanding.entities, text);
        }
        
        // ─────── استخراج المواضيع ───────
        understanding.topics = this.extractTopics(text);
        
        // ─────── كشف الحاجة إلى توضيح ───────
        understanding.requiresClarification = this.detectsClarificationNeed(text, understanding);
        
        return understanding;
    }
    
    /**
     * 🔍 البحث متعدد الطبقات (محدث)
     */
    async multiLayerSearch(query, understanding) {
        if (!window.vEngine || !window.vEngine.isReady) {
            console.warn('⚠️ محرك البحث غير جاهز');
            return { activities: [], industrial: [], decision104: [] };
        }
        
        // ─────── الطبقة 1: البحث الدلالي الأساسي ───────
        const baseResults = await window.vEngine.intelligentSearch(query, {
            limit: 8,
            useReranking: true,
            useNER: true,
            useContext: understanding.contextual
        });
        
        // ─────── الطبقة 2: البحث بالكيانات المكتشفة ───────
        if (understanding.entities.length > 0) {
            console.log('🔎 بحث إضافي بالكيانات...');
            for (const entity of understanding.entities) {
                const entityResults = await window.vEngine.intelligentSearch(entity.text, {
                    limit: 3
                });
                
                this.mergeSearchResults(baseResults, entityResults);
            }
        }
        
        // ─────── الطبقة 3: البحث بالسياق النشط ───────
        const activeEntity = this.memorySystem.getActiveEntity();
        if (understanding.contextual && activeEntity) {
            console.log(`🔗 بحث سياقي مع: ${activeEntity.text}`);
            const contextQuery = `${activeEntity.text} ${query}`;
            const contextResults = await window.vEngine.intelligentSearch(contextQuery, {
                limit: 3
            });
            
            this.mergeSearchResults(baseResults, contextResults);
        }
        
        // ─────── الطبقة 4: البحث بالمرادفات المتعلمة ───────
        if (this.learning.discoveredSynonyms.size > 0) {
            for (const [key, synonyms] of this.learning.discoveredSynonyms.entries()) {
                if (query.toLowerCase().includes(key.toLowerCase())) {
                    for (const synonym of synonyms.slice(0, 2)) {
                        const synonymResults = await window.vEngine.intelligentSearch(synonym, {
                            limit: 2
                        });
                        this.mergeSearchResults(baseResults, synonymResults);
                    }
                }
            }
        }
        
        return baseResults;
    }
    
    /**
     * 📊 التحليل الذكي (محدث)
     */
    smartAnalysis(results, understanding, originalQuery) {
        // جمع كل النتائج
        const allResults = [
            ...(results.activities || []).map(r => ({ ...r, type: 'activity' })),
            ...(results.industrial || []).map(r => ({ ...r, type: 'area' })),
            ...(results.decision104 || []).map(r => ({ ...r, type: 'decision104' }))
        ].sort((a, b) => b.score - a.score);
        
        if (allResults.length === 0) {
            return {
                type: 'no_results',
                confidence: 0,
                needsClarification: true,
                suggestion: this.getSuggestion(originalQuery),
                understanding: understanding
            };
        }
        
        const best = allResults[0];
        const secondBest = allResults[1];
        
        // 🔥 عتبة ديناميكية مع التعلم
        const dynamicThreshold = this.calculateDynamicThreshold(
            understanding.complexity,
            this.memorySystem.getCurrentContext() !== null
        );
        
        console.log(`🎯 أفضل نتيجة: ${best.id} (${best.type})`);
        console.log(`   Score: ${(best.score * 100).toFixed(1)}%`);
        console.log(`   العتبة الديناميكية: ${(dynamicThreshold * 100).toFixed(1)}%`);
        
        // ─────── كشف الالتباس النسبي ───────
        const hasAmbiguity = secondBest && 
            Math.abs(best.score - secondBest.score) < 0.12 &&
            best.score < 0.75;
        
        // ─────── استخدام العتبات المتعلمة ───────
        const learnedThreshold = this.learningEngine.adaptiveThresholds.get(best.type) || dynamicThreshold;
        const finalThreshold = (dynamicThreshold + learnedThreshold) / 2;
        
        return {
            type: best.type,
            primaryResult: best,
            allResults: allResults.slice(0, 5),
            confidence: best.score,
            hasAmbiguity,
            ambiguousResults: hasAmbiguity ? [best, secondBest] : [],
            needsClarification: best.score < finalThreshold || hasAmbiguity,
            dynamicThreshold: finalThreshold,
            understanding
        };
    }
    
    /**
     * 🎯 حساب العتبة الديناميكية (محسنة)
     */
    calculateDynamicThreshold(complexity, hasContext) {
        let baseThreshold = 0.35;
        
        // تعديل حسب التعقيد
        const complexityFactors = {
            simple: 0.7,
            medium: 1.0,
            complex: 1.3
        };
        baseThreshold *= complexityFactors[complexity] || 1.0;
        
        // تعديل حسب السياق
        if (hasContext) {
            baseThreshold *= 0.8;
        }
        
        // تعديل حسب ثقة المحرك الدلالي
        if (window.vEngine) {
            const engineThreshold = window.vEngine.getDynamicConfidenceThreshold(complexity);
            baseThreshold = (baseThreshold + engineThreshold) / 2;
        }
        
        // تعديل حسب تاريخ النجاح
        const successRate = this.stats.total > 0 
            ? this.stats.successful / this.stats.total 
            : 0.5;
        
        if (successRate > 0.8) {
            baseThreshold *= 0.9;
        } else if (successRate < 0.5) {
            baseThreshold *= 1.1;
        }
        
        // التعديل النهائي مع الحدود
        return Math.max(0.2, Math.min(0.7, baseThreshold));
    }
    
    /**
     * 🏗️ بناء الرد الذكي (محدث)
     */
    async buildIntelligentResponse(analysis, originalQuery) {
        // ─────── حالة: لا نتائج ───────
        if (analysis.type === 'no_results') {
            return this.createResponse(
                this.buildNoResultsMessage(analysis.suggestion),
                'no_results',
                0
            );
        }
        
        // ─────── حالة: التباس ───────
        if (analysis.hasAmbiguity) {
            this.stats.ambiguous++;
            return this.buildAmbiguityResponse(analysis);
        }
        
        // ─────── حالة: ثقة منخفضة - نسأل ───────
        if (analysis.needsClarification && analysis.confidence < analysis.dynamicThreshold) {
            return this.buildClarificationRequest(analysis);
        }
        
        // ─────── حالات محددة ───────
        switch (analysis.type) {
            case 'activity':
                return this.buildActivityResponse(analysis, originalQuery);
            case 'area':
                return this.buildAreaResponse(analysis, originalQuery);
            case 'decision104':
                return this.buildDecision104Response(analysis);
            default:
                return this.createResponse(
                    `وجدت معلومات محتملة لكن الثقة ${Math.round(analysis.confidence * 100)}%.\n\nهل تقصد "${analysis.primaryResult.id}"؟`,
                    'uncertain',
                    analysis.confidence
                );
        }
    }
    
    /**
     * 📋 بناء رد النشاط (محدث)
     */
    buildActivityResponse(analysis, originalQuery) {
        const activityData = this.findFullData(analysis.primaryResult.id, 'activity');
        
        if (!activityData || !activityData.details) {
            return this.createResponse(
                `وجدت النشاط "${analysis.primaryResult.id}" لكن التفاصيل غير متوفرة.`,
                'partial',
                analysis.confidence
            );
        }
        
        // حفظ في الذاكرة
        this.memory.context.currentEntity = activityData.text;
        this.memory.context.currentType = 'activity';
        this.memory.context.currentData = activityData;
        
        // تحديد ما يريده المستخدم بالضبط
        const requestedInfo = this.detectRequestedInfo(originalQuery, analysis.understanding);
        
        return this.formatActivityInfo(activityData, requestedInfo, analysis.confidence);
    }
    
    /**
     * 🏭 بناء رد المنطقة (محدث)
     */
    buildAreaResponse(analysis, originalQuery) {
        // كشف نوع السؤال
        const questionType = this.detectAreaQuestionType(originalQuery);
        
        if (questionType === 'count') {
            return this.buildAreaCount(originalQuery);
        }
        
        if (questionType === 'list') {
            return this.buildAreaList(originalQuery);
        }
        
        // سؤال عن منطقة محددة
        const areaData = this.findFullData(analysis.primaryResult.id, 'area');
        
        if (!areaData) {
            return this.createResponse(
                `وجدت منطقة "${analysis.primaryResult.id}" لكن التفاصيل غير متوفرة.`,
                'partial',
                analysis.confidence
            );
        }
        
        this.memory.context.currentEntity = areaData.name;
        this.memory.context.currentType = 'area';
        this.memory.context.currentData = areaData;
        
        return this.formatAreaInfo(areaData, analysis.confidence);
    }
    
    /**
     * ⭐ بناء رد القرار 104 (محدث)
     */
    buildDecision104Response(analysis) {
        const resultId = analysis.primaryResult.id;
        
        // البحث في قاعدة البيانات
        let found = null;
        let sector = null;
        let category = null;
        
        if (this.db.decision104) {
            for (const [cat, items] of Object.entries(this.db.decision104)) {
                if (Array.isArray(items)) {
                    const match = items.find(item => {
                        const normalized = item.toLowerCase();
                        const searchNorm = resultId.toLowerCase();
                        return normalized.includes(searchNorm) || 
                               searchNorm.includes(normalized.substring(0, 20));
                    });
                    
                    if (match) {
                        found = match;
                        sector = 'القطاع أ';
                        category = cat;
                        break;
                    }
                }
            }
        }
        
        if (!found) {
            return this.createResponse(
                this.buildDecision104NotFound(),
                'decision104_not_found',
                analysis.confidence
            );
        }
        
        return this.formatDecision104Info(found, sector, category, analysis.confidence);
    }
    
    /**
     * 🎭 بناء رد الالتباس (محدث)
     */
    buildAmbiguityResponse(analysis) {
        const [first, second] = analysis.ambiguousResults;
        
        const name1 = this.getDisplayName(first);
        const name2 = this.getDisplayName(second);
        
        let text = `وجدت أكثر من نتيجة محتملة:\n\n`;
        text += `1️⃣ ${name1} (${Math.round(first.score * 100)}%)\n`;
        text += `2️⃣ ${name2} (${Math.round(second.score * 100)}%)\n\n`;
        text += `💡 أيهما تقصد؟ أو أعد صياغة السؤال`;
        
        return this.createResponse(text, 'ambiguous', analysis.confidence, {
            options: [first, second]
        });
    }
    
    /**
     * ❓ طلب توضيح (محدث)
     */
    buildClarificationRequest(analysis) {
        const name = this.getDisplayName(analysis.primaryResult);
        
        let text = `هل تقصد "${name}"?\n\n`;
        text += `🎯 الثقة: ${Math.round(analysis.confidence * 100)}%\n`;
        text += `📊 العتبة المطلوبة: ${Math.round(analysis.dynamicThreshold * 100)}%\n\n`;
        text += `💡 يمكنك:\n- الموافقة ("نعم" أو "أكيد")\n`;
        text += `- إعادة صياغة السؤال بتفاصيل أكثر`;
        
        return this.createResponse(text, 'clarification', analysis.confidence, {
            suggestedEntity: analysis.primaryResult
        });
    }
    
    /**
     * 🎓 التعلم من التفاعل (محدث)
     */
    learnFromInteraction(query, understanding, analysis, response, userFeedback = null) {
        this.stats.learned++;
        
        // استخدام محرك التعلم الجديد
        this.learningEngine.learnFromInteraction(
            query,
            understanding,
            analysis,
            response,
            userFeedback
        );
        
        // تحديث التعلم القديم (للتوافق)
        if (analysis.confidence > 0.6 && response.type !== 'no_results') {
            const pattern = {
                query,
                entities: understanding.entities,
                resultType: analysis.type,
                confidence: analysis.confidence,
                timestamp: Date.now()
            };
            
            const key = analysis.primaryResult?.id || 'unknown';
            const existing = this.learning.successPatterns.get(key);
            
            if (existing) {
                existing.count++;
                existing.patterns.push(pattern);
            } else {
                this.learning.successPatterns.set(key, {
                    count: 1,
                    patterns: [pattern]
                });
            }
        }
        
        // تعلم المرادفات
        if (analysis.primaryResult && understanding.entities.length > 0) {
            understanding.entities.forEach(entity => {
                const synonymKey = analysis.primaryResult.id;
                const existing = this.learning.discoveredSynonyms.get(synonymKey);
                
                if (existing) {
                    if (!existing.includes(entity.text)) {
                        existing.push(entity.text);
                    }
                } else {
                    this.learning.discoveredSynonyms.set(synonymKey, [entity.text]);
                }
            });
        }
        
        console.log(`📚 التعلم: ${this.stats.learned} تفاعل`);
    }
    
    /**
     * 💾 تحديث الذاكرة (محدث)
     */
    updateMemory(userInput, response, analysis) {
        // استخدام نظام الذاكرة الجديد
        this.memorySystem.recordInteraction(userInput, response, analysis);
        
        // تحديث الذاكرة القديمة (للتوافق)
        this.memory.conversation.push({
            user: userInput,
            assistant: response.text,
            timestamp: Date.now(),
            confidence: analysis.confidence
        });
        
        if (this.memory.conversation.length > 20) {
            this.memory.conversation.shift();
        }
        
        // تحديث السياق إذا كان هناك نتيجة
        if (analysis.primaryResult) {
            this.memory.context.currentEntity = analysis.primaryResult.id;
            this.memory.context.currentType = analysis.type;
            this.memory.context.currentData = analysis.primaryResult;
            this.memory.context.timestamp = Date.now();
        }
    }
    
    /**
     * 🛠️ دعم معالجة المكونات (للمعالج المركب)
     */
    async processQueryComponent(component) {
        // معالجة مكون من سؤال مركب
        console.log(`🔍 معالجة مكون: "${component}"`);
        
        try {
            const understanding = await this.deepUnderstanding(component);
            const searchResults = await this.multiLayerSearch(component, understanding);
            const analysis = this.smartAnalysis(searchResults, understanding, component);
            
            if (analysis.type === 'no_results') {
                return null;
            }
            
            return {
                type: analysis.type,
                data: this.findFullData(analysis.primaryResult.id, analysis.type),
                confidence: analysis.confidence,
                analysis: analysis
            };
        } catch (error) {
            console.error(`❌ خطأ في معالجة المكون: ${error}`);
            return null;
        }
    }
    
    /**
     * 📥 استعادة التعلم
     */
    restoreLearning() {
        try {
            const saved = localStorage.getItem('smart_assistant_learning_legacy');
            if (!saved) return;
            
            const data = JSON.parse(saved);
            
            if (data.discoveredSynonyms) {
                this.learning.discoveredSynonyms = new Map(data.discoveredSynonyms);
            }
            if (data.successPatterns) {
                this.learning.successPatterns = new Map(data.successPatterns);
            }
            
            console.log(`📥 استعادة التعلم: ${this.learning.discoveredSynonyms.size} مرادف`);
        } catch (error) {
            console.error('❌ فشل استعادة التعلم:', error);
        }
    }
    
    /**
     * 💾 حفظ التعلم
     */
    saveLearning() {
        try {
            const data = {
                discoveredSynonyms: Array.from(this.learning.discoveredSynonyms.entries()),
                successPatterns: Array.from(this.learning.successPatterns.entries()),
                timestamp: Date.now()
            };
            
            localStorage.setItem('smart_assistant_learning_legacy', JSON.stringify(data));
        } catch (error) {
            console.error('❌ فشل حفظ التعلم:', error);
        }
    }
    
    /**
     * 🧰 دوال مساعدة (موجودة في الكود الأصلي)
     */
    
    // تقدير التعقيد
    estimateComplexity(text) {
        const words = text.split(/\s+/).length;
        const hasMultipleQuestions = (text.match(/[؟?]/g) || []).length > 1;
        const hasConjunctions = /و|أو|ثم|كذلك|أيضا/.test(text);
        
        if (words <= 5 && !hasMultipleQuestions) return 'simple';
        if (words > 15 || hasMultipleQuestions || hasConjunctions) return 'complex';
        return 'medium';
    }
    
    // كشف الاعتماد على السياق
    isContextDependent(text) {
        const contextWords = ['هذا', 'هذه', 'ذلك', 'تلك', 'ده', 'دي', 'فيه', 'فيها', 'هناك'];
        return contextWords.some(word => text.includes(word)) || text.length < 15;
    }
    
    // استنتاج النية
    inferIntent(entities, text) {
        if (entities.length === 0) return 'general';
        
        const types = entities.map(e => e.type);
        
        if (types.includes('decision')) return 'incentives';
        if (types.includes('governorate') && types.includes('area')) return 'area_location';
        if (types.includes('activity')) return 'activity_info';
        if (types.includes('governorate')) return 'area_list';
        
        return 'general';
    }
    
    // استخراج المواضيع
    extractTopics(text) {
        const lowerText = text.toLowerCase();
        const topics = [];
        
        // كلمات مفتاحية للمواضيع
        const topicKeywords = {
            'نشاط': ['مصنع', 'ورشة', 'منشأة', 'عمل', 'مشروع'],
            'منطقة': ['محافظة', 'مدينة', 'موقع', 'في', 'بـ'],
            'قرار': ['104', 'قرار', 'بموجب', 'وفق'],
            'متطلبات': ['شروط', 'متطلبات', 'إجراءات', 'وثائق'],
            'تكلفة': ['سعر', 'ثمن', 'تكلفة', 'رأس مال']
        };
        
        Object.entries(topicKeywords).forEach(([topic, keywords]) => {
            if (keywords.some(keyword => lowerText.includes(keyword))) {
                topics.push(topic);
            }
        });
        
        return topics;
    }
    
    // كشف الحاجة إلى توضيح
    detectsClarificationNeed(text, understanding) {
        // الأسئلة القصيرة جداً
        if (text.length < 10) return true;
        
        // الأسئلة العامة جداً
        const generalWords = ['ماذا', 'ماذا عن', 'كيف', 'أين', 'متى'];
        if (generalWords.some(word => text.startsWith(word))) return true;
        
        // إذا كان هناك كيانات متعددة بدون علاقة واضحة
        if (understanding.entities.length > 2 && !understanding.intent) return true;
        
        return false;
    }
    
    // دمج نتائج البحث
    mergeSearchResults(baseResults, newResults) {
        for (const [key, items] of Object.entries(newResults)) {
            if (!baseResults[key]) baseResults[key] = [];
            
            items.forEach(newItem => {
                const existing = baseResults[key].find(item => item.id === newItem.id);
                if (existing) {
                    // تحسين النتيجة الموجودة
                    existing.score = Math.max(existing.score, newItem.score);
                    if (newItem.entityMatch) existing.entityMatch = true;
                } else {
                    baseResults[key].push(newItem);
                }
            });
            
            // ترتيب النتائج
            baseResults[key].sort((a, b) => b.score - a.score);
            // الحفاظ على الحد الأقصى
            if (baseResults[key].length > 10) {
                baseResults[key] = baseResults[key].slice(0, 10);
            }
        }
    }
    
    // العثور على البيانات الكاملة
    findFullData(id, type) {
        if (type === 'activity' && this.db.activities) {
            let found = this.db.activities.find(a => a.value === id);
            
            if (!found) {
                found = this.db.activities.find(a => 
                    a.text && (
                        a.text.toLowerCase().includes(id.toLowerCase()) ||
                        id.toLowerCase().includes(a.text.toLowerCase().substring(0, 15))
                    )
                );
            }
            
            if (!found && this.learning.discoveredSynonyms.has(id)) {
                const synonyms = this.learning.discoveredSynonyms.get(id);
                found = this.db.activities.find(a => 
                    synonyms.some(syn => a.text.toLowerCase().includes(syn.toLowerCase()))
                );
            }
            
            return found;
        }
        
        if (type === 'area' && this.db.industrial) {
            let found = this.db.industrial.find(a => a.name === id);
            
            if (!found) {
                found = this.db.industrial.find(a => 
                    a.name && a.name.toLowerCase().includes(id.toLowerCase())
                );
            }
            
            return found;
        }
        
        return null;
    }
    
    // الحصول على اسم العرض
    getDisplayName(result) {
        if (result.text) return result.text;
        if (result.name) return result.name;
        return result.id;
    }
    
    // باقي الدوال المساعدة الموجودة في الكود الأصلي...
    // buildNoResultsMessage, detectAreaQuestionType, buildAreaCount, 
    // buildAreaList, formatActivityInfo, formatAreaInfo, 
    // buildDecision104NotFound, formatDecision104Info, 
    // detectRequestedInfo, extractKeyInfo, createResponse
    // ... إلخ
    
    /**
     * 📊 الحصول على إحصائيات النظام
     */
    getSystemStats() {
        return {
            ...this.stats,
            memory: {
                history: this.memorySystem.history.length,
                entities: this.memorySystem.entityChain.size,
                contexts: this.memorySystem.contextStack.length
            },
            learning: this.learningEngine.getLearningStats(),
            context: this.contextManager.getContextState()
        };
    }
    
    /**
     * 🧹 تنظيف النظام
     */
    cleanup() {
        this.memorySystem.cleanupOldMemory();
        this.contextManager.cleanupExpiredContexts();
        
        // حفظ البيانات
        this.saveLearning();
        this.learningEngine.saveLearningData();
        
        console.log('🧹 تنظيف النظام اكتمل');
    }
}

// ============================================================================
// 📦 التصدير والإعدادات
// ============================================================================

// جعل الفصول متاحة للتصدير إذا لزم الأمر
window.ConversationMemory = ConversationMemory;
window.ComplexQueryProcessor = ComplexQueryProcessor;
window.LearningEngine = LearningEngine;
window.ContextManager = ContextManager;
window.TrulySmartAssistant = TrulySmartAssistant;

// إنشاء نسخة افتراضية للمساعد
window.smartAssistant = new TrulySmartAssistant();

console.log('✅ المستشار الذكي V12 المتكامل جاهز للعمل!');
console.log('🧠 الأنظمة المضمنة: الذاكرة، المعالجة المركبة، التعلم، السياق');
console.log('🚀 استخدم: smartAssistant.query("سؤالك هنا")');
