// 监听来自 background script 的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "translate") {
    const text = request.text;
    
    if (text) {
      // 保存当前选中内容的引用
      const selection = window.getSelection();
      const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      
      // 直接发送翻译请求
      chrome.runtime.sendMessage(
        { 
          action: "translate", 
          text: text,
          from: 'content-script',
          timestamp: Date.now()
        }, 
        function(response) {
          // 检查响应是否存在
          if (chrome.runtime.lastError) {
            return;
          }
          
          if (response && response.translatedText && range) {
            // 创建新的文本节点
            const translatedNode = document.createTextNode(response.translatedText);
            
            // 删除原始内容并插入翻译后的内容
            range.deleteContents();
            range.insertNode(translatedNode);
            
            // 更新选区以包含新插入的文本
            selection.removeAllRanges();
            const newRange = document.createRange();
            newRange.selectNodeContents(translatedNode);
            selection.addRange(newRange);
          }
        }
      );
    }
  } else if (request.action === "ping") {
    // 响应 ping 请求
    sendResponse({ status: "ok" });
  }
  return true;
});