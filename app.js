(function(){
  var SUBJECTS=["국어","수학","사회","과학","도덕","영어","음악","미술","체육","실과","창체"];
  var DAYS=["월","화","수","목","금"], DAYS7=["일","월","화","수","목","금","토"];
  var TITLES={timetable:"시간표",weekly:"주별 일정",monthly:"월별 일정",academic:"학사일정",trip:"수학여행",graduation:"졸업",students:"학생관리",traits:"학생특성",admin:"행정"};
  var store={};
  try{ store=JSON.parse(localStorage.getItem("portal6")||"{}")||{}; }catch(e){ store={}; }
  var ACCOUNTS={};
  (function(){
    function add(id,name){ ACCOUNTS[id.toLowerCase()]={id:id,name:name}; }
    for(var g=1;g<=6;g++) for(var c=1;c<=2;c++) add("Cw2026"+g+c,g+"학년 "+c+"반");
    for(var n=1;n<=10;n++) add("Cwoffice"+n,"교무실 "+n);
    add("Cwrector","교장선생님"); add("Cwrector2","교감선생님");
  })();
  var session=null;
  try{ session=sessionStorage.getItem("portal6user"); }catch(e){}
  if(session&&!ACCOUNTS[session]) session=null;
  function persist(){ try{ localStorage.setItem("portal6",JSON.stringify(store)); }catch(e){} }
  var $=function(s,r){return (r||document).querySelector(s)};
  var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var toastT;
  function toast(m){ var t=$("#toast"); t.textContent=m; t.classList.add("on"); clearTimeout(toastT); toastT=setTimeout(function(){t.classList.remove("on")},1800); }

  /* ----- build pages ----- */
  // timetable
  (function(){
    var h='<thead><tr><th style="width:15.8%"></th>'+DAYS.map(function(d){return '<th>'+d+'</th>'}).join("")+'</tr></thead><tbody>';
    for(var p=1;p<=6;p++){
      h+='<tr><td class="p">'+p+'교시</td>';
      DAYS.forEach(function(d,i){
        h+='<td><select data-k="tt_'+p+'_'+i+'" aria-label="'+d+'요일 '+p+'교시"><option value="">교과 선택</option>'+SUBJECTS.map(function(s){return '<option>'+s+'</option>'}).join("")+'</select></td>';
      });
      h+='</tr>';
    }
    $("#ttable").innerHTML=h+'</tbody>';
    $("#ttable").addEventListener("change",function(e){ if(e.target.tagName==="SELECT") e.target.classList.toggle("set",!!e.target.value); });
  })();
  // weekly
  (function(){
    var h=DAYS7.map(function(d){return '<div class="h">'+d+'</div>'}).join("");
    h+=DAYS7.map(function(d,i){return '<textarea data-k="wk_'+i+'" aria-label="'+d+'요일 일정"></textarea>'}).join("");
    $("#wk").innerHTML=h;
  })();
  // monthly
  var now=new Date();
  (function(){
    var m=now.getMonth()+1, days=new Date(now.getFullYear(),m,0).getDate();
    $("#moTitle").textContent=m+"월";
    var h="";
    for(var i=1;i<=35;i++){
      if(i<=days){ h+='<div class="d'+(i===now.getDate()?' today':'')+'"><span>'+i+'</span><textarea data-k="mo_'+m+'_'+i+'" aria-label="'+m+'월 '+i+'일 일정"></textarea></div>'; }
      else h+='<div class="d blank"></div>';
    }
    $("#moGrid").innerHTML=h;
  })();
  // school group inputs (graduation)
  (function(){
    var sch=$(".row.sch");
    var h="";
    for(var i=1;i<=12;i++){
      h+='<div style="flex-direction:column;padding:0;align-items:stretch;border-bottom:'+(i<=6?'1px solid #6b7686':'0')+';border-right:1px solid #6b7686"><div style="font-size:14px;text-align:center;padding:4px 0;border-bottom:1px solid #6b7686">'+i+'희망교</div><input type="text" data-k="g_s'+i+'" aria-label="'+i+'희망교" style="height:26px;border:0;background:transparent;text-align:center;font-size:15px"></div>';
    }
    sch.innerHTML=h;
    sch.style.gridTemplateColumns="repeat(6,1fr)";
    sch.style.alignItems="stretch";
    var f2=sch.parentNode;
    // admission row
    var add=document.createElement("div");
    add.className="f f2"; add.style.borderTop="0";
    add.innerHTML='<div class="L C" style="min-height:120px;line-height:1.35;font-size:18px">입학/<br>전입사항</div>'+
      '<div class="L" style="grid-column:2;font-size:18px">18. 입학(전입)일자</div>'+
      '<div class="row three V" style="grid-column:3;display:grid;grid-template-columns:1fr 1.15fr 1fr;padding:0">'+
        '<div><input type="text" data-k="g_enter" aria-label="입학(전입)일자"></div>'+
        '<div class="L" style="flex-direction:column;line-height:1.45;font-size:17px;border-right:1px solid #6b7686"><span>19. 전 재적교명</span><span>(전입 전 초등학교명</span><span>2025. 1. 1. 이후</span><span>전입자만 기재)</span></div>'+
        '<div><input type="text" data-k="g_prevschool" aria-label="전 재적교명"></div>'+
      '</div>';
    f2.parentNode.insertBefore(add,f2.nextSibling);
    $("#printBtn").onclick=function(){ window.print(); };
  })();
  // subject
  (function(){
    var pubs=["국어<br>(가/나)","수학<br>(수학익힘)","사회<br>(사회과부도)","과학<br>(실험관찰)","도덕","영어","음악","미술","체육","실과"];
    var pk=["kor","math","soc","sci","eth","eng","mus","art","pe","prac"];
    $("#pub").innerHTML=pubs.map(function(t){return '<div class="th">'+t+'</div>'}).join("")+pk.map(function(k,i){return '<div class="td"><input type="text" data-k="pub_'+k+'" aria-label="'+pubs[i].replace("<br>"," ")+' 출판사"></div>'}).join("");
    var e1=[["국어<br>(가/나)","kor"],["수학<br>(수학익힘)","math"],["사회<br>(사회과부도)","soc"],["과학<br>(실험관찰)","sci"],["도덕","eth"]];
    var e2=[["영어","eng"],["음악","mus"],["미술","art"],["체육","pe"],["실과","prac"]];
    function fill(el,arr){ el.innerHTML=arr.map(function(a){return '<div class="th">'+a[0]+'</div>'}).join("")+arr.map(function(a){return '<div class="td tall"><textarea data-k="ev_'+a[1]+'" aria-label="'+a[0].replace("<br>"," ")+' 수행평가"></textarea></div>'}).join(""); }
    fill($("#ev1"),e1); fill($("#ev2"),e2);
  })();

  /* ----- data fill/save ----- */
  function load(){
    $$("[data-k]").forEach(function(el){
      var v=store[el.getAttribute("data-k")];
      if(v===undefined) return;
      if(el.type==="checkbox") el.checked=!!v; else el.value=v;
      if(el.tagName==="SELECT") el.classList.toggle("set",!!el.value);
    });
  }
  function collect(root){
    $$("[data-k]",root).forEach(function(el){
      var k=el.getAttribute("data-k");
      var v=el.type==="checkbox"?el.checked:el.value;
      if(v===""||v===false) delete store[k]; else store[k]=v;
    });
    persist();
  }
  load();
  $$("[data-save]").forEach(function(b){ b.addEventListener("click",function(){ collect(b.closest("[data-page]")); toast("저장되었습니다."); }); });

  /* ----- favorites ----- */
  function favs(){ return store._fav||[]; }
  function renderFav(){
    var f=favs(), h="";
    for(var i=0;i<5;i++){
      h+='<div>'+(f[i]?'<a href="#'+f[i]+'">'+TITLES[f[i]]+'</a>':'')+'</div>';
    }
    $("#favCells").innerHTML=h;
    $$("#tiles .tile").forEach(function(t){
      var on=f.indexOf(t.getAttribute("data-id"))>-1, p=$(".pin",t);
      p.textContent=on?"★":"☆"; p.classList.toggle("on",on);
      p.setAttribute("aria-label",on?"즐겨찾기 해제":"즐겨찾기 추가");
    });
  }
  $("#tiles").addEventListener("click",function(e){
    var p=e.target.closest(".pin"); if(!p) return;
    e.preventDefault(); e.stopPropagation();
    var id=p.closest(".tile").getAttribute("data-id"), f=favs().slice(), i=f.indexOf(id);
    if(i>-1) f.splice(i,1); else if(f.length<5) f.push(id); else { toast("즐겨찾기는 5개까지 추가할 수 있습니다."); return; }
    store._fav=f; persist(); renderFav();
  });

  /* ----- login ----- */
  function setUser(id){
    var t=$("#userTxt");
    var a=id&&ACCOUNTS[id];
    if(a){ t.className="nm"; t.innerHTML='<span></span><small></small>'; $("span",t).textContent=a.name+(/님$/.test(a.name)?"":" 님"); $("small",t).textContent=a.id; }
    else { t.className="guest"; t.textContent="로그인 하세요."; }
  }
  setUser(session);
  $("#loginForm").addEventListener("submit",function(e){
    e.preventDefault();
    var id=$("#uid").value.trim(), pw=$("#upw").value;
    if(!id||!pw){ $("#loginErr").textContent="아이디와 비밀번호를 입력해 주세요."; return; }
    $("#loginErr").textContent="";
    var key=id.toLowerCase(), acct=ACCOUNTS[key];
    if(!acct||pw.toLowerCase()!==key){ $("#loginErr").textContent="아이디 또는 비밀번호가 올바르지 않습니다."; $("#upw").value=""; $("#upw").focus(); return; }
    session=key; try{ sessionStorage.setItem("portal6user",key); }catch(x){}
    setUser(key); $("#upw").value=""; location.hash="#home"; route();
  });
  $("#user").addEventListener("click",function(e){
    if(!session) return;
    var m=$("#umenu"); m.hidden=!m.hidden; e.stopPropagation();
  });
  $("#logout").addEventListener("click",function(e){
    e.stopPropagation(); session=null; try{ sessionStorage.removeItem("portal6user"); }catch(x){}
    $("#umenu").hidden=true; setUser(null); location.hash="#login"; route();
  });
  document.addEventListener("click",function(){ $("#umenu").hidden=true; });

  /* ----- router ----- */
  function route(){
    var h=(location.hash||"").replace("#","")||"login";
    var page=h==="subject-eval"?"subject":h;
    if(!session) page="login";
    else if(page==="login") page="home";
    if(!$('[data-page="'+page+'"]')) page=session?"home":"login";
    $$("[data-page]").forEach(function(s){ s.hidden=s.getAttribute("data-page")!==page; });
    $$(".nav a").forEach(function(a){ a.style.textDecoration=""; });
    if(page==="home") renderFav();
    window.scrollTo(0,0);
    if(h==="subject-eval") setTimeout(function(){ var b=$("#evalBox"); if(b) b.scrollIntoView({behavior:"smooth",block:"start"}); },30);
  }
  window.addEventListener("hashchange",route);
  route();

  /* ----- students ----- */
  function students(){ return store._stu||{}; }
  function stuFields(){ return $$("[data-s]"); }
  function clearStu(){ stuFields().forEach(function(el){ el.value=""; }); }
  function fillStu(rec){ stuFields().forEach(function(el){ el.value=rec[el.getAttribute("data-s")]||""; }); }
  function showRes(){
    var q=$("#sq").value.trim(), box=$("#sres");
    if(!q){ box.hidden=true; return; }
    var list=Object.keys(students()).filter(function(k){ var r=students()[k]; return k.indexOf(q)>-1||(r.no||"")===q; });
    box.hidden=false; box.innerHTML="";
    if(!list.length){ var p=document.createElement("p"); p.textContent="저장된 학생이 없습니다. 아래에 입력하고 저장하면 검색할 수 있습니다."; box.appendChild(p); return; }
    list.forEach(function(k){
      var r=students()[k], b=document.createElement("button"); b.type="button";
      b.textContent=k+(r.grade||r.cls||r.no?"  ("+[r.grade&&r.grade+"학년",r.cls&&r.cls+"반",r.no&&r.no+"번"].filter(Boolean).join(" ")+")":"");
      b.onclick=function(){ fillStu(r); box.hidden=true; $("#sq").value=""; };
      box.appendChild(b);
    });
  }
  $("#sq").addEventListener("input",showRes);
  $("#saveStudent").addEventListener("click",function(){
    var rec={}; stuFields().forEach(function(el){ rec[el.getAttribute("data-s")]=el.value; });
    if(!rec.name.trim()){ toast("이름을 입력해 주세요."); return; }
    var all=students(); all[rec.name.trim()]=rec; store._stu=all; persist(); toast("저장되었습니다.");
  });

  /* ----- admin ----- */
  $("#openDoc").addEventListener("click",function(){ $("#docDlg").hidden=false; setTimeout(function(){ $("#dTitle").focus(); },20); });
  $("#docClose").addEventListener("click",function(){ $("#docDlg").hidden=true; });
  $("#docDlg").addEventListener("click",function(e){ if(e.target===this) this.hidden=true; });
  document.addEventListener("keydown",function(e){ if(e.key==="Escape") $("#docDlg").hidden=true; });
  $$("[data-soon]").forEach(function(b){ b.addEventListener("click",function(){ toast("준비 중인 메뉴입니다."); }); });
  $$("#docDlg .gb, #docDlg .mini").forEach(function(b){ b.addEventListener("click",function(){ toast("준비 중인 기능입니다."); }); });
})();
