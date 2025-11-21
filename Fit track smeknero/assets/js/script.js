function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
const elements = {
  weight:document.getElementById('weight'),
  height:document.getElementById('height'),
  nama:document.getElementById('nama'),
  kelas:document.getElementById('kelas'),
  jurusan:document.getElementById('jurusan'),
  usia:document.getElementById('usia'),
  gender:document.getElementById('gender'),
  bmiValue:document.getElementById('bmiValue'),
  bmiCategory:document.getElementById('bmiCategory'),
  lookRate:document.getElementById('lookRate'),
  gaugeFill:document.getElementById('gaugeFill'),
  avatarImg:document.getElementById('avatarImg'),
  adviceCard:document.getElementById('adviceCard'),
  adviceText:document.getElementById('adviceText'),
  tipsArea:document.getElementById('tipsArea'),
  printBtn:document.getElementById('printBtn'),
  calcBtn:document.getElementById('calcBtn')
};

function bmiCat(bmi){
  if(bmi<18.5) return 'Kurus';
  if(bmi<25) return 'Normal';
  if(bmi<30) return 'Berlebihan';
  return 'Obesitas';
}
function lookScore(bmi){
  return Math.round(clamp(100-Math.abs(bmi-22)*6,0,100));
}

function applyCategoryClass(cat){
  document.body.classList.remove('cat-under','cat-normal','cat-over');
  if(cat==='Kurus') document.body.classList.add('cat-under');
  else if(cat==='Normal') document.body.classList.add('cat-normal');
  else document.body.classList.add('cat-over');
}

function updateAvatarAndAccent(cat){
  const avatar = elements.avatarImg;
  avatar.classList.remove('visible');
  setTimeout(()=>{ 
    if(cat==='Kurus') avatar.src='assets/img/avatar_under.svg';
    else if(cat==='Normal') avatar.src='assets/img/avatar_normal.svg';
    else avatar.src='assets/img/avatar_over.svg';
    avatar.onload = ()=> avatar.classList.add('visible');
  }, 200);
}

function generateAdvice(weight,height,bmi){
  const m = height/100;
  const ideal = 22*(m*m);
  let advice='', tips=[], cal='';
  if(bmi<18.5){
    advice = '<strong>Underweight.</strong> Target ideal: '+ideal.toFixed(1)+' kg.';
    cal = 'Surplus ~300–500 kcal/hari.';
    tips = ['Makan 5-6 kali/hari','Pilihan kalori padat & bergizi','Latihan beban 3x/minggu','Protein cukup'];
  }else if(bmi>=25){
    advice = '<strong>Overweight/Obesitas.</strong> Target ideal: '+ideal.toFixed(1)+' kg.';
    cal = 'Defisit ~500–1000 kcal/hari.';
    tips = ['Kurangi gula & gorengan','Cardio + Latihan beban','Pantau porsi','Cukup tidur'];
  }else{
    advice = 'Berat dalam kisaran sehat. Fokus komposisi tubuh.';
    cal = 'Pertahankan & tambahkan beban untuk otot jika perlu.';
    tips = ['Latihan beban & cardio','Tidur cukup','Protein cukup','Monitor progres'];
  }
  return {advice, tips, cal};
}

elements.calcBtn.addEventListener('click', ()=>{
  const w = parseFloat(elements.weight.value);
  const h = parseFloat(elements.height.value);
  if(!w||!h) return;
  const bmi = w/((h/100)*(h/100));
  const bmiR = Math.round(bmi*10)/10;
  elements.bmiValue.textContent = bmiR.toFixed(1);
  const cat = bmiCat(bmi);
  elements.bmiCategory.textContent = cat;
  const ls = lookScore(bmi);
  elements.lookRate.textContent = ls;
  elements.gaugeFill.style.width = ls + '%';

  applyCategoryClass(cat);
  updateAvatarAndAccent(cat);

  // advice
  const info = generateAdvice(w,h,bmi);
  elements.adviceCard.style.display = 'block';
  elements.adviceText.innerHTML = info.advice + '<p><em>'+info.cal+'</em></p>';
  elements.tipsArea.innerHTML = '';
  info.tips.forEach(t=>{
    const d = document.createElement('div'); d.className='tip'; d.textContent = t; elements.tipsArea.appendChild(d);
  });
});

// Print report: open new window and print
elements.printBtn.addEventListener('click', ()=>{
  const data = {
    nama: elements.nama.value || '-',
    kelas: elements.kelas.value,
    jurusan: elements.jurusan.value,
    usia: elements.usia.value,
    gender: elements.gender.value,
    weight: elements.weight.value,
    height: elements.height.value,
    bmi: elements.bmiValue.textContent,
    category: elements.bmiCategory.textContent,
    look: elements.lookRate.textContent
  };
  const reportHtml = `
  <html><head><title>Laporan FitTrack</title>
  <style>
    body{font-family:Arial;padding:24px;color:#041223}
    .header{display:flex;gap:12px;align-items:center}
    .logo{width:72px}
    h2{margin:6px 0}
    table{width:100%;border-collapse:collapse;margin-top:12px}
    td,th{border:1px solid #ddd;padding:8px;text-align:left}
  </style>
  </head><body>
    <div class="header">
      <img src="assets/img/logo.png" class="logo">
      <div>
        <h2>FitTrack — Laporan Kesehatan</h2>
        <div>Created by: Siswa Kelas X RPL SMKN 1 Robatal</div>
      </div>
    </div>
    <h3>Data Siswa</h3>
    <table>
      <tr><th>Nama</th><td>${data.nama}</td></tr>
      <tr><th>Kelas</th><td>${data.kelas}</td></tr>
      <tr><th>Jurusan</th><td>${data.jurusan}</td></tr>
      <tr><th>Usia</th><td>${data.usia}</td></tr>
      <tr><th>Jenis Kelamin</th><td>${data.gender}</td></tr>
    </table>
    <h3>Hasil BMI</h3>
    <table>
      <tr><th>Berat (kg)</th><td>${data.weight}</td></tr>
      <tr><th>Tinggi (cm)</th><td>${data.height}</td></tr>
      <tr><th>BMI</th><td>${data.bmi}</td></tr>
      <tr><th>Kategori</th><td>${data.category}</td></tr>
      <tr><th>LookMaxing Rate</th><td>${data.look}</td></tr>
    </table>
    <script>window.print();</script>
  </body></html>`;
  const w = window.open('', '_blank', 'width=800,height=900');
  w.document.write(reportHtml);
  w.document.close();
});
