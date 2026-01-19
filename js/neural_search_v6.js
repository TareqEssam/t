/****************************************************************************
 * 🧠 NeuralSearch v7.0 - الجسر الرابط لمحرك المتجهات
 * يقوم بتحويل طلبات الواجهة إلى استعلامات دلالية للمحرك السحابي
 ****************************************************************************/

/**
 * تهيئة البحث العصبي (النسخة المتوافقة مع الفيكتور)
 */
function initializeNeuralSearch(inputId, resultsId, selectId, database) {
    const searchInput = document.getElementById(inputId);
    const resultsContainer = document.getElementById(resultsId);
    const mainSelect = document.getElementById(selectId);

    if (!searchInput || !resultsContainer) return;

    // استماع لحدث الكتابة
    searchInput.addEventListener('input', async (e) => {
        const query = e.target.value.trim();
        
        if (query.length < 2) {
            resultsContainer.style.display = 'none';
            return;
        }

        // إظهار مؤشر بحث بسيط
        resultsContainer.innerHTML = '<div class="p-3 text-center"><i class="bi bi-cpu-fill fa-spin"></i> جاري التحليل الدلالي...</div>';
        resultsContainer.style.display = 'block';

        try {
            // الاستعلام من محرك المتجهات العالمي الذي أنشأناه
            // نبحث هنا في فئة "activities" لأن هذا البحث مخصص للقائمة المنسدلة للأنشطة
            const allResults = await window.vEngine.search(query);
            const activityResults = allResults.activities;

            if (activityResults.length > 0) {
                renderVectorResults(activityResults, resultsContainer, mainSelect, searchInput);
            } else {
                resultsContainer.innerHTML = '<div class="p-3 text-muted text-center">لم يتم العثور على نشاط مطابق دلالياً</div>';
            }
        } catch (error) {
            console.error("Search Error:", error);
            resultsContainer.style.display = 'none';
        }
    });

    // إغلاق النتائج عند النقر خارجها
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.style.display = 'none';
        }
    });
}

/**
 * عرض النتائج القادمة من الفيكتور بتنسيق احترافي
 */
function renderVectorResults(results, container, selectElement, inputElement) {
    container.innerHTML = '';
    
    results.forEach(result => {
        const div = document.createElement('div');
        div.className = 'search-result-item p-2 border-bottom';
        div.style.cursor = 'pointer';
        
        // حساب النسبة المئوية للمطابقة
        const matchPercentage = Math.round(result.score * 100);
        
        div.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <span class="fw-bold">${result.text}</span>
                <span class="badge bg-soft-primary text-primary" style="font-size: 0.7rem;">مطابقة ${matchPercentage}%</span>
            </div>
        `;

        div.onclick = () => {
            // تحديث القائمة المنسدلة الأصلية
            selectElement.value = result.value;
            inputElement.value = result.text;
            container.style.display = 'none';
            
            // تشغيل التحديثات المرتبطة بالاختيار في main_logic
            const event = new Event('change');
            selectElement.dispatchEvent(event);
            
            if (typeof updateActivityDetails === 'function') {
                updateActivityDetails(result.value);
            }
        };
        container.appendChild(div);
    });
}

console.log("✅ تم تحديث NeuralSearch ليعمل بنظام Vector Bridge");