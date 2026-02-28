/**
 * URL Analyzer Frontend Application
 * 实现 URL 校验、调用后端 API、渲染报告和下载功能
 */

// DOM 元素获取
const urlInput = document.getElementById('urlInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const loading = document.getElementById('loading');
const report = document.getElementById('report');
const errorMsg = document.getElementById('errorMsg');
const downloadBtn = document.getElementById('downloadBtn');

/**
 * URL 格式校验函数
 * 验证 URL 是否以 https:// 开头且符合域名格式
 * @param {string} url - 待校验的 URL
 * @returns {boolean} - 是否通过校验
 */
function validateUrl(url) {
    // 验证 https:// 开头
    const httpsPattern = /^https:\/\//i;
    if (!httpsPattern.test(url)) {
        return false;
    }

    // 验证域名格式
    try {
        const urlObj = new URL(url);
        // 检查是否有有效的 hostname
        if (!urlObj.hostname || urlObj.hostname.length === 0) {
            return false;
        }
        // hostname 应包含字母、数字、点、短横线，且以字母或数字开头和结尾
        const domainPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/;
        return domainPattern.test(urlObj.hostname);
    } catch (e) {
        return false;
    }
}

/**
 * 显示错误消息
 * @param {string} message - 错误信息
 */
function showError(message) {
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
    report.style.display = 'none';
    downloadBtn.style.display = 'none';
}

/**
 * 隐藏错误消息
 */
function hideError() {
    errorMsg.style.display = 'none';
}

/**
 * 显示加载动画
 */
function showLoading() {
    loading.style.display = 'block';
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = '分析中...';
}

/**
 * 隐藏加载动画
 */
function hideLoading() {
    loading.style.display = 'none';
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = '开始分析';
}

/**
 * 渲染 Markdown 报告
 * @param {string} markdownText - Markdown 格式的报告内容
 */
function renderReport(markdownText) {
    // 使用 marked.parse 将 Markdown 转换为 HTML
    const htmlContent = marked.parse(markdownText);
    report.innerHTML = htmlContent;
    report.style.display = 'block';
    downloadBtn.style.display = 'inline-block';
}

/**
 * 下载报告为 Markdown 文件
 * @param {string} content - Markdown 内容
 */
function downloadReport(content) {
    // 创建 Blob 对象
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    // 创建下载链接
    const url = URL.createObjectURL(blob);
    
    // 创建临时链接元素并触发下载
    const link = document.createElement('a');
    link.href = url;
    link.download = `analysis-report-${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    
    // 清理
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * 执行 URL 分析
 */
async function analyzeUrl() {
    const url = urlInput.value.trim();

    // 校验 URL
    if (!url) {
        showError('请输入 URL');
        return;
    }

    if (!validateUrl(url)) {
        showError('URL 格式不正确，请输入以 https:// 开头的有效域名');
        return;
    }

    // 隐藏之前的错误和报告
    hideError();
    report.style.display = 'none';

    // 显示加载动画
    showLoading();

    try {
        // 调用后端 API
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: url })
        });

        // 隐藏加载动画
        hideLoading();

        // 检查响应状态
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `请求失败，状态码: ${response.status}`);
        }

        // 解析响应数据
        const data = await response.json();

        // 渲染报告
        renderReport(data.report);

    } catch (error) {
        // 隐藏加载动画
        hideLoading();

        // 显示错误信息
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            showError('网络错误，请检查网络连接或服务器是否正常运行');
        } else {
            showError(error.message || '分析过程中发生未知错误');
        }
    }
}

// 事件监听: analyzeBtn click 触发检测流程
analyzeBtn.addEventListener('click', analyzeUrl);

// 支持回车键触发分析
urlInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        analyzeUrl();
    }
});

// 下载功能事件监听
downloadBtn.addEventListener('click', function() {
    // 获取报告的 Markdown 源码（从 report 元素的 data 属性或重新获取）
    const markdownContent = report.dataset.markdown || report.textContent;
    if (markdownContent) {
        downloadReport(markdownContent);
    }
});