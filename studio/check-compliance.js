// Run this in browser console to check if compliance is in API response
(async () => {
  const token = localStorage.getItem('access_token');
  const response = await fetch('/api/navigation/?t=' + Date.now(), {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  
  console.log('=== API RESPONSE CHECK ===');
  console.log('Total sections:', data.sections?.length);
  console.log('Section IDs:', data.sections?.map(s => s.id));
  
  const compliance = data.sections?.find(s => s.id === 'compliance');
  if (compliance) {
    console.log('✅✅✅ COMPLIANCE FOUND IN API ✅✅✅');
    console.log('Compliance items:', compliance.items?.length);
    console.log('Compliance section:', compliance);
  } else {
    console.log('❌❌❌ COMPLIANCE NOT IN API ❌❌❌');
    console.log('All sections:', data.sections);
  }
})();

