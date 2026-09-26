  function toggleFaq(el) {
    const item = el.parentElement;
    const answer = el.nextElementSibling;
    const isOpen = item.classList.contains('open');
    
    // Close all
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-answer').classList.remove('open');
    });

    // Open current if was closed
    if (!isOpen) {
      item.classList.add('open');
      answer.classList.add('open');
    }
  }


  async function submitForm() {
    if(document.getElementById('submitBtn').disabled) return;
    const checkbox = document.getElementById('privacy');
    if (!checkbox.checked) {
      alert('プライバシーポリシーへの同意をお願いします。');
      return;
    }

    const name     = document.getElementById('f-name').value.trim();
    const tel      = document.getElementById('f-tel').value.trim();
    const email    = document.getElementById('f-email').value.trim();
    const type     = document.getElementById('f-type').value;
    const area     = document.getElementById('f-area').value.trim();
    const category = document.getElementById('f-category').value;
    const message  = document.getElementById('f-message').value.trim();

    if (!name) { alert('お名前をご入力ください。'); return; }
    if (!tel)  { alert('お電話番号をご入力ください。'); return; }
    if (email && !document.getElementById('f-email').checkValidity()) { document.getElementById('f-email').reportValidity(); return; }

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.textContent = '送信中...';

    const formData = {
      access_key: 'd5b792c4-9c10-43f2-920e-29540951161b',
      subject: '【おうちの診断所】無料相談のお申し込み',
      from_name: 'おうちの診断所',
      name: name,
      phone: tel,
      email: email || '未入力',
      '物件の種類': type || '未選択',
      '物件所在地': area || '未入力',
      'ご相談内容': category || '未選択',
      'ご質問・ご要望': message || 'なし',
      '受付ページ': document.title,
      botcheck: document.querySelector('[name=botcheck]').checked ? 'yes' : ''
    };

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        document.getElementById('successMsg').style.display = 'block';
        document.getElementById('errorMsg').style.display = 'none';
        btn.style.display = 'none';
        // フォームリセット
        ['f-name','f-tel','f-email','f-area','f-message'].forEach(id => document.getElementById(id).value = '');
        document.getElementById('f-type').value = '';
        document.getElementById('f-category').value = '';
        document.getElementById('privacy').checked = false;
      } else {
        throw new Error(data.message);
      }
    } catch (e) {
      document.getElementById('errorMsg').style.display = 'block';
      document.getElementById('successMsg').style.display = 'none';
      btn.disabled = false;
      btn.textContent = '無料相談を申し込む →';
    }
  }


const category=document.getElementById('f-category');
if(category)category.value=({'value.html':'家の価値の相談','sell.html':'売却の相談','family.html':'実家・空き家の相談'})[location.pathname.split('/').pop()]||'';
