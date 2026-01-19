/**
 * main_logic.js - المحرك الموحد المحدث (نسخة المتجهات V7)
 * تم التعديل ليدعم العمليات غير المتزامنة والربط مع vEngine
 */

// 1. تهيئة الكائنات العالمية لضمان عدم حدوث أخطاء
window.licenseDB = window.licenseDB || {};
window.productionStagesDB = window.productionStagesDB || {};
window.technicalNotesDB = window.technicalNotesDB || {};
window.licenseFieldsDB = window.licenseFieldsDB || {};

document.addEventListener('DOMContentLoaded', async () => {
    console.log("🚀 جاري تهيئة النظام الشامل بنظام المتجهات...");

    // 2. بناء جسور البيانات النصية (للعرض وليس للبحث)
    if (typeof masterActivityDB !== 'undefined') {
        masterActivityDB.forEach(act => {
            window.licenseDB[act.value] = act.details;
            window.productionStagesDB[act.value] = act.productionStages;
            window.technicalNotesDB[act.value] = act.technicalNotes;
            window.licenseFieldsDB[act.value] = act.dynamicLicenseFields;
        });
        console.log("✅ تم بناء جسور البيانات بنجاح");
    }

    // 3. ملء القائمة المنسدلة للأنشطة
    populateActivitySelect(masterActivityDB);

    // 4. تشغيل البحث العصبي (المطور المرتبط بالمتجهات)
    if (typeof initializeNeuralSearch === 'function') {
        initializeNeuralSearch('activityTypeSearch', 'activityTypeSearchResults', 'activityTypeSelect', masterActivityDB);
    }
    
    // 5. تهيئة المساعد الذكي وربط زر الإرسال
    setupAssistantUI();

    console.log("🎯 تم اكتمال إعدادات المنطق الأساسي");
});

/**
 * دالة إعداد واجهة المساعد الذكي لتدعم Async/Await
 */
function setupAssistantUI() {
    const sendBtn = document.getElementById('sendAssistantMsg'); // تأكد أن هذا الـ ID موجود في HTML
    const inputField = document.getElementById('assistantInput');

    if (sendBtn && inputField) {
        // نستخدم async هنا لأننا سننتظر رد المساعد الذكي (Vector Search)
        sendBtn.onclick = async () => {
            const query = inputField.value.trim();
            if (!query) return;

            // إظهار حالة "جاري التفكير" في الواجهة
            if (window.showAssistantLoading) window.showAssistantLoading(true);

            try {
                // الانتظار الفعلي لرد المساعد المعتمد على المتجهات
                const response = await window.assistant.getResponse(query);
                
                // عرض الرد عبر واجهة المستخدم
                if (window.renderAssistantResponse) {
                    window.renderAssistantResponse(response);
                }
            } catch (error) {
                console.error("خطأ أثناء معالجة رد المساعد:", error);
            } finally {
                if (window.showAssistantLoading) window.showAssistantLoading(false);
                inputField.value = '';
            }
        };
    }
}

/**
 * ملء القائمة المنسدلة للأنشطة
 */
function populateActivitySelect(data) {
    const select = document.getElementById('activityTypeSelect');
    if (!select || !data) return;

    select.innerHTML = '<option value="">-- اختر النشاط أو ابحث عنه أعلاه --</option>';

    data.forEach(item => {
        const option = document.createElement('option');
        // تعديل هنا: التأكد من أخذ القيمة والاسم بشكل صحيح
        option.value = item.value || item.id; 
        option.textContent = item.text || item.id || "نشاط";
        select.appendChild(option);
    });

    select.onchange = (e) => updateActivityDetails(e.target.value);
}

/**
 * تحديث تفاصيل النشاط عند الاختيار
 */
function updateActivityDetails(selectedValue) {
    if (!selectedValue) return;

    // تعديل هنا: البحث بمرونة أكبر (عن طريق الـ value أو الـ id)
    const activity = masterActivityDB.find(a => (a.value === selectedValue || a.id === selectedValue));
    
    if (activity) {
        console.log("🔄 تحديث واجهة التفاصيل للنشاط:", activity.text || activity.id);

        // استخدام || 'غير متوفر' لضمان عدم ظهور مساحات فارغة
        const label = activity.text || activity.id;
        if(document.getElementById('currentLicense')) document.getElementById('currentLicense').innerText = label;
        
        // جلب التفاصيل من كائن details
        const details = activity.details || {};
        if(document.getElementById('reqLicense')) document.getElementById('reqLicense').innerText = details.req || 'غير متوفر';
        if(document.getElementById('authLicense')) document.getElementById('authLicense').innerText = details.auth || 'غير متوفر';
        if(document.getElementById('reqLocation')) document.getElementById('reqLocation').innerText = details.loc || 'غير متوفر';
        if(document.getElementById('legalBasis')) document.getElementById('legalBasis').innerText = details.leg || 'غير متوفر';
        if(document.getElementById('guideNameDisplay')) document.getElementById('guideNameDisplay').innerText = details.guid || 'غير متوفر';

        if(document.getElementById('licenseResultArea')) document.getElementById('licenseResultArea').style.display = 'block';

        const techNotesArea = document.getElementById('technicalNotesTextarea');
        if (techNotesArea) techNotesArea.value = activity.technicalNotes || '';

        // تنفيذ الوظائف الملحقة
        if (typeof loadDynamicLicenseFields === 'function') loadDynamicLicenseFields(selectedValue);
        if (typeof initProductionFlow === 'function') initProductionFlow(selectedValue);
    } else {
        console.warn("⚠️ لم يتم العثور على بيانات تفصيلية للقيمة:", selectedValue);
    }
}
