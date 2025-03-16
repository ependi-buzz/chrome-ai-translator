document.addEventListener('DOMContentLoaded', function() {
  // 加载保存的设置
  chrome.storage.sync.get({
    defaultModel: 'Pro/deepseek-ai/DeepSeek-V3',
    siliconflowKey: '',
    siliconflowUrl: ''
  }, function(items) {
    document.getElementById('siliconflowModel').value = items.defaultModel;
    document.getElementById('siliconflowKey').value = items.siliconflowKey;
    document.getElementById('siliconflowUrl').value = items.siliconflowUrl;
  });

  // 保存设置
  document.getElementById('save').addEventListener('click', function() {
    const defaultModel = document.getElementById('siliconflowModel').value;
    const siliconflowKey = document.getElementById('siliconflowKey').value;
    const siliconflowUrl = document.getElementById('siliconflowUrl').value;

    chrome.storage.sync.set({
      defaultModel: defaultModel,
      siliconflowKey: siliconflowKey,
      siliconflowUrl: siliconflowUrl
    }, function() {
      alert('设置已保存！');
    });
  });
});