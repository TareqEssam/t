/****************************************************************************
 * 🧠 NeuralSearch v8.0 - المحرك الدلالي المطور (النسخة الكاملة)
 * --------------------------------------------------------------------------
 * هذا الملف هو المسؤول عن الربط بين واجهة المستخدم (مربع البحث) 
 * وبين محرك المتجهات السحابي، مع ضمان تحديث شاشات النظام (4 و 7).
 ****************************************************************************/

/**
 * دالة تهيئة البحث العصبي
 * @param {string} inputId - ID حقل الإدخال النصي
 * @param {string} resultsId - ID حاوية النتائج التي ستظهر
 * @param {string} selectId - ID القائمة المنسدلة الأصلية المراد تحديثها
 */
function initializeNeuralSearch(inputId, resultsId, selectId) {
    const searchInput = document.getElementById(inputId);
    const resultsContainer = document.getElementById(resultsId);
    const mainSelect = document.getElementById(selectId);

    // التحقق من وجود العناصر في الصفحة لتجنب الأخطاء
    if (!searchInput || !resultsContainer) {
        console.error("❌ NeuralSearch: عناصر الواجهة غير موجودة. تأكد من الـ IDs في ملف HTML");
        return;
    }

    // --- إعداد التصميم الخاص بحاوية النتائج لضمان ظهورها فوق كافة العناصر ---
    resultsContainer.style.cssText = `
        position: absolute;
        z-index: 99999 !important;
        background: #ffffff !important;
        width: 100%;
        max-height: 400px;
        overflow-y: auto;
        box-shadow: 0px 10px 30px rgba(0,0,0,0.25);
        display: none;
        border: 1px solid #d1d5db;
        border-radius: 12px;
        margin-top: 8px;
        scrollbar-width: thin;
    `;

    // استماع لحدث الكتابة في مربع البحث
    searchInput.addEventListener('input', async (e) => {
        const query = e.target.value.trim();
        
        // لا تبحث إذا كان النص أقل من حرفين
        if (query.length < 2) {
            resultsContainer.style.display = 'none';
            return;
        }

        // إظهار حالة جاري التحميل داخل الحاوية
        resultsContainer.innerHTML = `
            <div class="p-4 text-center">
                <div class="spinner-border text-primary spinner-border-sm" role="status"></div>
                <div class="mt-2 text-primary fw-bold" style="font-size: 0.85rem;">جاري التحليل الدلالي للنشاط...</div>
            </div>
        `;
        resultsContainer.style.display = 'block';

        try {
            // التأكد من أن محرك المتجهات جاهز للعمل
            if (!window.vEngine || !window.vEngine.isReady) {
                // محاولة انتظار بسيطة إذا لم يكن جاهزاً
                resultsContainer.innerHTML = '<div class="p-3 text-muted">جاري تهيئة قاعدة بيانات المتجهات...</div>';
                return;
            }

            // تنفيذ البحث الفعلي عبر vEngine
            const allResults = await window.vEngine.search(query);
            
            // استخراج نتائج الأنشطة فقط (Activities)
            const activityResults = allResults.activities || [];

            if (activityResults.length > 0) {
                // استدعاء دالة الرسم لعرض النتائج
                renderVectorResults(activityResults, resultsContainer, mainSelect, searchInput);
            } else {
                resultsContainer.innerHTML = `
                    <div class="p-4 text-center text-muted">
                        <i class="bi bi-exclamation-circle d-block mb-2" style="font-size: 1.5rem;"></i>
                        <div style="font-size: 0.9rem;">لم نجد نشاطاً مطابقاً لـ "${query}"</div>
                        <small>جرب كتابة كلمات مختلفة (مثلاً: فندق، ملابس، ورشة)</small>
                    </div>
                `;
            }
        } catch (error) {
            console.error("❌ NeuralSearch Error:", error);
            resultsContainer.innerHTML = `
                <div class="p-3 text-danger text-center small">
                    ⚠️ عذراً، تعذر الاتصال بمحرك البحث حالياً.
                </div>
            `;
        }
    });

    // إغلاق قائمة النتائج عند النقر خارجها
    document.addEventListener('mousedown', (e) => {
        if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.style.display = 'none';
        }
    });

    // التعامل مع أزرار لوحة المفاتيح (Escape للإغلاق)
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            resultsContainer.style.display = 'none';
        }
    });
}

/**
 * دالة رسم النتائج داخل الحاوية
 */
function renderVectorResults(results, container, selectElement, inputElement) {
    container.innerHTML = '';
    
    // ترتيب النتائج حسب النسبة الأعلى (في حال لم تكن مرتبة)
    results.sort((a, b) => b.score - a.score);

    results.forEach((result, index) => {
        const div = document.createElement('div');
        div.className = 'search-result-item';
        
        // تحديد مسمى النشاط والقيمة الخاصة به (id هو الأهم في الفيكتور)
        const label = result.id || result.text || result.name || "نشاط غير مسمى";
        const value = result.value || result.id; 
        const matchPercentage = Math.round(result.score * 100);

        // تنسيق صف النتيجة
        div.style.cssText = `
            padding: 14px 18px;
            border-bottom: 1px solid #f3f4f6;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #fff;
        `;

        div.innerHTML = `
            <div style="flex: 1; text-align: right;">
                <div style="font-weight: 700; color: #1f2937; font-size: 0.95rem;">${label}</div>
                <small style="color: #6b7280; font-size: 0.75rem;">قاعدة بيانات الأنشطة الموحدة</small>
            </div>
            <div class="text-start">
                <span class="badge" style="background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; font-size: 0.7rem;">
                    مطابقة ${matchPercentage}%
                </span>
            </div>
        `;

        // تأثيرات بصرية عند التفاعل
        div.onmouseover = () => {
            div.style.background = '#f9fafb';
            div.style.borderRight = '4px solid #2563eb';
        };
        div.onmouseout = () => {
            div.style.background = '#fff';
            div.style.borderRight = 'none';
        };

        // الحدث الرئيسي: عند النقر على النشاط المختار
        div.onclick = () => {
            console.log("🎯 تم اختيار:", label);
            
            // إخفاء القائمة فوراً
            container.style.display = 'none';
            
            // 1. تحديث حقل البحث النصي
            inputElement.value = label;

            // 2. محاولة استدعاء الدالة المصلحة في app.js (الأفضل)
            if (typeof window.selectActivityType === 'function') {
                window.selectActivityType(value, label);
            } 
            else {
                // 3. حل احتياطي متكامل في حال غياب دالة app.js
                console.warn("⚠️ window.selectActivityType غير معرفة، يتم التحديث يدوياً");
                
                selectElement.value = value;
                
                // إطلاق حدث التغيير لمزامنة الجداول
                const event = new Event('change', { bubbles: true });
                selectElement.dispatchEvent(event);
                
                // تحديث التفاصيل الأساسية
                if (typeof updateActivityDetails === 'function') {
                    updateActivityDetails(value);
                }
                
                // تحديث مراحل الإنتاج (الشاشة 7)
                if (typeof initProductionFlow === 'function') {
                    initProductionFlow(value);
                }
            }
        };

        container.appendChild(div);
    });
}

// إضافة ستايل CSS إضافي لتحسين المظهر العام للقائمة
const customSearchStyle = document.createElement('style');
customSearchStyle.innerHTML = `
    .search-result-item:last-child { border-bottom: none !important; }
    .search-result-item:active { background-color: #e5e7eb !important; }
    #activityTypeSearchResults::-webkit-scrollbar { width: 6px; }
    #activityTypeSearchResults::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
`;
document.head.appendChild(customSearchStyle);

console.log("🚀 NeuralSearch v8.0: الجسر البرمجي جاهز للعمل بكامل طاقته");
