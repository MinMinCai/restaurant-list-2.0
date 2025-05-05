// 獲取 URL 參數
const urlParams = new URLSearchParams(window.location.search);
const sortOption = urlParams.get('sort');

// 獲取 select 元素
const selectElement = document.querySelector('select[name="sort"]');

// 如果有排序選項，設置對應的 option 為選中狀態
if (sortOption) {
  const option = selectElement.querySelector(`option[value="${sortOption}"]`);
  if (option) {
    option.selected = true;
  }
}

// 處理排序選項變更
function handleSortChange(selectElement) {
  if (selectElement.value === '') {
    // 如果選擇"排序方式"，直接跳轉回首頁
    window.location.href = '/';
  } else {
    // 其他選項則提交表單
    selectElement.form.submit();
  }
} 