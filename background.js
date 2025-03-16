async function translateWithSiliconFlow(text, apiKey, apiUrl, model) {
  try {
    const url = apiUrl.endsWith('/') ? `${apiUrl}chat/completions` : `${apiUrl}/chat/completions`;
    const requestBody = {
      model: model,
      messages: [
        {
          role: "system",
          content: "You are a translator. Translate the following text to Chinese. Only output the translation, no explanations."
        },
        {
          role: "user",
          content: text
        }
      ]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status} ${response.statusText}`);
    }

    const responseText = await response.text();
    
    try {
      const data = JSON.parse(responseText);
      if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('响应格式无效');
      }
      return data.choices[0].message.content.trim();
    } catch (parseError) {
      throw new Error(`响应解析失败: ${parseError.message}`);
    }
  } catch (error) {
    throw new Error(`SiliconFlow 翻译失败: ${error.message}`);
  }
}

// 在文件顶部添加右键菜单创建代码
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translateSelection",
    title: "翻译选中文本",
    contexts: ["selection"]
  });
});

// 添加右键菜单点击事件处理
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "translateSelection") {
    chrome.tabs.sendMessage(tab.id, {
      action: "translate",
      text: info.selectionText
    });
  }
});

// 消息监听器
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "translate") {
    chrome.storage.sync.get({
      siliconflowKey: '',
      siliconflowUrl: '',
      defaultModel: 'Pro/deepseek-ai/DeepSeek-V3'
    }, async function(items) {
      try {
        if (!request.text) {
          sendResponse({ error: '没有要翻译的文本' });
          return;
        }

        if (!items.siliconflowKey) {
          throw new Error('请先设置 API Key');
        }
        if (!items.siliconflowUrl) {
          throw new Error('请先设置 API URL');
        }
        if (!items.defaultModel) {
          throw new Error('请先设置模型');
        }

        const translatedText = await translateWithSiliconFlow(
          request.text, 
          items.siliconflowKey, 
          items.siliconflowUrl,
          items.defaultModel
        );
        
        sendResponse({ translatedText });
      } catch (error) {
        sendResponse({ error: error.message || '翻译失败' });
      }
    });
    return true;
  }
});