// API 配置
const API_BASE = 'https://yijing-helpme.manus.space/api/trpc';

// 存储历史记录
let divinationHistory = JSON.parse(localStorage.getItem('divinationHistory') || '[]');

// DOM 元素
const questionInput = document.getElementById('question');
const charCount = document.getElementById('charCount');
const divinationBtn = document.getElementById('divinationBtn');
const historyBtn = document.getElementById('historyBtn');
const loadingMask = document.getElementById('loadingMask');
const resultModal = document.getElementById('resultModal');
const closeModal = document.getElementById('closeModal');
const historyModal = document.getElementById('historyModal');
const closeHistory = document.getElementById('closeHistory');

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    bindEvents();
    updateCharCount();
});

// 绑定事件
function bindEvents() {
    questionInput.addEventListener('input', updateCharCount);
    divinationBtn.addEventListener('click', onDivination);
    historyBtn.addEventListener('click', showHistory);
    closeModal.addEventListener('click', () => hideModal('resultModal'));
    closeHistory.addEventListener('click', () => hideModal('historyModal'));

    // 点击遮罩关闭弹窗
    resultModal.addEventListener('click', (e) => {
        if (e.target === resultModal) hideModal('resultModal');
    });
    historyModal.addEventListener('click', (e) => {
        if (e.target === historyModal) hideModal('historyModal');
    });
}

// 更新字符计数
function updateCharCount() {
    const length = questionInput.value.length;
    charCount.textContent = length;
    divinationBtn.disabled = length === 0;
}

// tRPC 请求封装
async function trpcRequest(procedure, input = {}) {
    const response = await fetch(`${API_BASE}/${procedure}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            json: input
        })
    });

    if (!response.ok) {
        throw new Error('请求失败，请稍后重试');
    }

    const data = await response.json();
    if (data.result && data.result.data) {
        return data.result.data.json;
    } else {
        throw new Error(data.error?.message || '请求失败');
    }
}

// 占卜
async function onDivination() {
    const question = questionInput.value.trim();
    if (!question) {
        showToast('请输入您的问题');
        return;
    }

    showLoading('占卜中...');

    try {
        const result = await trpcRequest('divination.perform', { question });

        hideLoading();

        // 保存到历史记录
        const historyItem = {
            id: Date.now(),
            question,
            result,
            date: new Date().toLocaleString('zh-CN')
        };
        divinationHistory.unshift(historyItem);
        if (divinationHistory.length > 50) {
            divinationHistory = divinationHistory.slice(0, 50);
        }
        localStorage.setItem('divinationHistory', JSON.stringify(divinationHistory));

        // 显示结果
        showResult(question, result);
        questionInput.value = '';
        updateCharCount();

    } catch (error) {
        hideLoading();
        showToast(error.message || '占卜失败，请重试');
        console.error('占卜失败:', error);
    }
}

// 显示结果
function showResult(question, result) {
    document.getElementById('resultQuestion').textContent = question;
    document.getElementById('hexagramName').textContent = result.hexagramName || '';
    document.getElementById('hexagramText').textContent = result.hexagramText || '';
    document.getElementById('interpretation').textContent = result.interpretation || '';

    // 显示卦象
    const hexagramDisplay = document.getElementById('hexagramDisplay');
    hexagramDisplay.innerHTML = '';

    if (result.hexagramPattern && Array.isArray(result.hexagramPattern)) {
        result.hexagramPattern.forEach((line, index) => {
            const lineDiv = document.createElement('div');
            lineDiv.className = `hexagram-line ${line === 'broken' ? 'broken' : ''}`;
            hexagramDisplay.appendChild(lineDiv);
        });
    }

    showModal('resultModal');
}

// 显示历史记录
function showHistory() {
    const historyList = document.getElementById('historyList');

    if (divinationHistory.length === 0) {
        historyList.innerHTML = '<div class="empty-history">暂无历史记录</div>';
    } else {
        historyList.innerHTML = divinationHistory.map(item => `
            <div class="history-item" onclick="showHistoryItem(${item.id})">
                <div class="history-question">${escapeHtml(item.question)}</div>
                <div class="history-date">${item.date}</div>
                <div class="history-hexagram">
                    <div class="history-hexagram-name">${escapeHtml(item.result.hexagramName || '')}</div>
                </div>
            </div>
        `).join('');
    }

    showModal('historyModal');
}

// 显示历史记录详情
function showHistoryItem(id) {
    const item = divinationHistory.find(h => h.id === id);
    if (item) {
        showResult(item.question, item.result);
        hideModal('historyModal');
    }
}

// 显示加载遮罩
function showLoading(text) {
    const loadingText = loadingMask.querySelector('.loading-text');
    if (loadingText) {
        loadingText.textContent = text;
    }
    loadingMask.style.display = 'flex';
}

// 隐藏加载遮罩
function hideLoading() {
    loadingMask.style.display = 'none';
}

// 显示弹窗
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// 隐藏弹窗
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// 显示提示
function showToast(message) {
    // 创建 toast 元素
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 4px;
        z-index: 3000;
        font-size: 14px;
        animation: fadeInOut 3s ease-in-out;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    // 3秒后移除
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// HTML 转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        10% { opacity: 1; transform: translateX(-50%) translateY(0); }
        90% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
`;
document.head.appendChild(style);
