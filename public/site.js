/* Brewling portfolio navigation and enquiry form. */
const products=window.BREWLING_PRODUCTS.map(p=>({...p,...window.BREWLING_ENHANCEMENTS[p.id]}));
const main=document.querySelector('#main');
let disposeEnquiryForm=null;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const productURL=p=>`#/products/${p.id}`;
const contactURL=p=>`#/contact${p?'?product='+p.id:''}`;
const theme=p=>`--accent:${p.accent};--tint:${p.tint}`;
const button=(label,url,style='')=>`<a class="button ${style}" href="${url}">${label}<span aria-hidden="true">↗</span></a>`;
const textLink=(label,url)=>`<a class="text-link" href="${url}">${label}<span aria-hidden="true">↗</span></a>`;
const closing=(title='What would better work look like for your team?',p=null)=>`<section class="closing wrap"><h2>${title}</h2>${button(p?p.ctaLabel:'Talk to Brewling',contactURL(p))}</section>`;
const diagrams={
databrew:{label:'From knowledge to action',steps:[['Find','Approved sources'],['Understand','Source-linked response'],['Review','Human judgement'],['Act','Authorised next step']]},
dealbrew:{label:'From agreement to completion',steps:[['Verify','Parties and authority'],['Agree','Terms and responsibilities'],['Deliver','Milestones and evidence'],['Settle','Partner-held escrow controls']]},
hirebrew:{label:'One people journey',steps:[['Attract','Requisitions and candidates'],['Choose','Interviews and offers'],['Welcome','Onboarding and records'],['Support','Everyday employee services']]},
ledgerbrew:{label:'From invoice to clear records',steps:[['Capture','Invoice and source evidence'],['Review','Approvals and exceptions'],['Reconcile','Cash and payment records'],['Post','Your existing general ledger']]},
propbrew:{label:'From request to resolution',steps:[['Report','Resident request'],['Coordinate','Owner and work order'],['Resolve','Field work and evidence'],['Review','Resident service and oversight']]}
};
function processArt(p,withFooter=true){const d=diagrams[p.id];return `<div class="product-stage" style="${theme(p)}"><div class="process-heading"><span class="eyebrow">${p.category}</span><h3>${d.label}</h3></div><ol class="process-art" aria-label="${esc(d.label)}">${d.steps.map((s,i)=>`<li><span class="process-number">0${i+1}</span><div><b>${s[0]}</b><span>${s[1]}</span></div><span aria-hidden="true" class="process-arrow">${i===3?'✓':'↓'}</span></li>`).join('')}</ol><p class="process-caption">Illustrative product workflow</p>${withFooter?`<div class="stage-footer"><span class="maturity-badge">${p.stageLabel}</span><p>${p.shortDescription}</p>${textLink('Explore '+p.name,productURL(p))}</div>`:''}</div>`;}
function home(){return `<section class="hero wrap"><div class="hero-copy"><span class="eyebrow">A family of products for business</span><h1>Make room for better work.</h1><p>AI-powered software for the work that runs your business. We’re building focused products that help teams find clarity, move work forward and stay in control.</p><div class="actions">${button('Explore the products','#/products')}${textLink('Talk to Brewling','#/contact')}</div><p class="local-note">Starting in Nigeria. Thinking across Africa.</p></div><div class="hero-art" aria-label="Brewling product family"><div class="art-note">Less friction.<br>More possibility.</div><img class="art-main" src="assets/brewling-mark-primary.svg" alt="" width="390" height="474"><div class="art-bottom">${products.map((p,i)=>`<span><i>0${i+1}</i>${p.name}</span>`).join('')}</div></div></section><div class="intro-line wrap"><strong>Work gets scattered. Responsibility shouldn’t.</strong><span>Bring context to the decisions lost between messages, documents and spreadsheets.</span></div><section class="section wrap" id="products"><div class="section-head"><div><span class="eyebrow">Meet the family</span><h2>Start with the work<br>you need to improve.</h2></div><p>Every team has a different starting point. Explore the Brewling product designed around yours.</p></div>${audienceLinks()}<div class="product-selector"><div class="product-options" role="tablist" aria-label="Explore the Brewling products" aria-orientation="vertical">${products.map((p,i)=>`<button class="product-option" role="tab" id="tab-${p.id}" aria-controls="product-panel" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-product="${p.id}" style="${theme(p)}"><span class="option-top"><strong><i class="dot"></i>${p.name}</strong><span aria-hidden="true">↗</span></span><span class="category">${p.category}</span></button>`).join('')}</div><div id="product-panel" role="tabpanel" aria-labelledby="tab-databrew" tabindex="0">${processArt(products[0])}</div></div></section><section class="dark-section"><div class="philosophy wrap"><div><span class="eyebrow">The Brewling Standard</span><h2>Better software starts with the whole workflow.</h2><p class="intro">The work rarely ends when a document is created or a request is submitted. Someone needs to review it, act on it and know what happens next.</p>${button('Explore our standard','#/why-brewling','light')}</div><div class="principles">${[['A clear next step','Give people the context, ownership and status they need to move work forward.'],['AI with a useful job','Help teams find information, prepare drafts and review suggestions where those actions save effort.'],['People in control','Keep consequential decisions with the people responsible for them, with supporting evidence close at hand.']].map((x,i)=>`<div class="principle"><span>0${i+1}</span><div><h3>${x[0]}</h3><p>${x[1]}</p></div></div>`).join('')}</div></div></section><section class="section regional wrap"><div class="regional-graphic"><p class="region-type">Grounded<br>here.<br>Looking<br>forward.</p><div class="region-foot"><span>Nigeria first.</span><span>Africa in mind.</span></div></div><div class="regional-copy"><span class="eyebrow">Context matters</span><h2>Built around how business gets done here.</h2><p>Nigerian organisations need software that takes local workflows seriously. Mobile access, variable connectivity, Naira, local operating requirements and familiar communication channels shape our product decisions.</p><div class="regional-points"><span>Practical AI</span><span>Local context</span><span>Clear responsibility</span></div></div></section>${closing()}`;}
function audienceLinks(){return `<div class="audience-links" aria-label="Product starting points"><a href="#/products?audience=institutions"><span class="eyebrow">Institutions & enterprises</span><strong>Work with organisational knowledge <span aria-hidden="true">↗</span></strong><small>Explore Databrew</small></a><a href="#/products?audience=teams"><span class="eyebrow">Operating teams</span><strong>Move everyday business forward <span aria-hidden="true">↗</span></strong><small>Transactions · People · Finance · Property</small></a></div>`;}
function directory(audience){
  const selected=['institutions','teams'].includes(audience)?audience:'all';
  const shown=products.filter(p=>selected==='all'||(selected==='institutions'?p.id==='databrew':p.id!=='databrew'));
  const labels={all:'All products',institutions:'Institutions & enterprises',teams:'Operating teams'};
  return `<section class="inner-hero wrap"><span class="eyebrow">The Brewling family</span><h1>Different work.<br>The same care.</h1><p>Five products, each designed around a distinct business challenge. Start with your team’s most important workflow.</p>${textLink('Help me find the right product','#/contact')}</section><section class="wrap directory" aria-label="Our products"><nav class="audience-filter" aria-label="Choose a product starting point">${Object.entries(labels).map(([id,label])=>`<a href="#/products${id==='all'?'':'?audience='+id}"${id===selected?' aria-current="page"':''}>${label}</a>`).join('')}</nav><p class="filter-note">${selected==='institutions'?'Start with AI across organisational knowledge. Your teams may also need our specialist products.':selected==='teams'?'Start with transactions, people, finance or property operations. Databrew supports wider organisational knowledge needs.':'Explore the complete family, or choose a starting point.'} These routes guide discovery; they don’t limit who a product can serve.${selected!=='all'?' <a href="#/products">View all five products ↗</a>':''}</p><div class="directory-summary"><span>${labels[selected]}</span><span>${shown.length} ${shown.length===1?'product':'products'}</span></div>${shown.map(p=>`<article class="directory-row" style="${theme(p)}"><div><a href="${productURL(p)}" class="product-name">${p.name}</a><small>${p.category}</small><span class="maturity-badge">${p.stageLabel}</span></div><div><h3>${p.hero}</h3><p>${p.shortDescription}</p>${textLink('Explore '+p.name,productURL(p))}</div><div class="key-areas">${p.keys.map(x=>`<div>${x}</div>`).join('')}</div></article>`).join('')}</section><div class="section wrap"><p class="manifesto">Choose by the work.<br><em>Find your starting point.</em></p></div>${closing('Let’s find the right fit for your organisation.')}`;
}
function productPage(p){return `<div style="${theme(p)}"><section class="product-hero wrap"><div><span class="eyebrow">${p.name} / ${p.category}</span><h1>${p.hero}</h1><p>${p.intro}</p><div class="actions">${button(p.ctaLabel,contactURL(p))}<a href="#/products/${p.id}?section=workflow" class="text-link">Explore the workflow <span aria-hidden="true">↓</span></a></div><p class="audience">${p.audience}</p><div class="product-maturity"><span class="maturity-badge">${p.stageLabel}</span><p>${p.stageDetail}</p></div></div>${processArt(p,false)}</section><section class="problem wrap"><h2>${p.problemTitle}</h2><p>${p.problemBody}</p></section><section class="workflow" id="workflow"><div class="wrap"><span class="eyebrow">The product direction</span><h2>${p.workflowTitle}</h2><div class="workflow-steps">${p.steps.map((s,i)=>`<article class="workflow-step"><span>0${i+1}</span><h3>${s.title}</h3><p>${s.body}</p></article>`).join('')}</div></div></section><section class="section wrap"><span class="eyebrow">Areas of focus</span><h2 style="margin-top:20px">The detail behind better work.</h2><div class="capability-grid">${p.capabilities.map(c=>`<article class="capability"><h3>${c.title}</h3><p>${c.body}</p></article>`).join('')}</div></section><section class="ai-panel wrap"><div><span class="eyebrow">AI with a useful job</span><h2>${p.aiTitle}</h2><p class="ai-intro">${p.aiBody}</p>${textLink('The Brewling Standard','#/why-brewling')}</div><div class="responsibilities"><article><span class="eyebrow">AI assists</span><p>${p.aiAssists}</p></article><article><span class="eyebrow">Your team decides</span><p>${p.humanDecides}</p></article></div></section><section class="evidence-section wrap"><div><span class="eyebrow">A record you can follow</span><h2>${p.evidenceTitle}</h2><p>${p.evidenceIntro}</p></div><ol class="evidence-list">${p.evidenceItems.map((item,i)=>`<li><span>0${i+1}</span><p>${item}</p></li>`).join('')}</ol></section><section class="faq-section wrap"><div><span class="eyebrow">Before we talk</span><h2>A few useful answers.</h2><p>Where ${p.name} fits, what it is designed to do and what needs to be agreed.</p></div><div class="faq-list">${p.faqs.map(f=>`<details><summary>${f.question}<span aria-hidden="true">+</span></summary><p>${f.answer}</p></details>`).join('')}</div></section>${closing('Let’s talk about '+p.name+'.',p)}</div>`;}
const solutionGroups=window.BREWLING_SOLUTIONS;
const solutions=solutionGroups.flatMap(g=>g.items.map(item=>({...item,groupId:g.id,group:g.title})));
const solutionURL=s=>`#/solutions?focus=${s.id}`;
const solutionIcons={
 bank:'<path d="M3 9h18M4 20h16M6 9v8m6-8v8m6-8v8M3 6l9-4 9 4v3H3z"/>',
 institution:'<path d="M3 21h18M6 21V7l6-4 6 4v14M9 10h1m4 0h1m-6 4h1m4 0h1m-4 7v-4h2v4"/>',
 briefcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12l9 3 9-3m-9 1v4"/>',
 home:'<path d="M3 11l9-8 9 8M5 9v12h14V9m-9 12v-7h4v7"/>',
 bolt:'<path d="M14 2L4 14h7l-1 8 10-12h-7z"/>',
 code:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M8 9l-3 3 3 3m8-6l3 3-3 3m-3-7l-2 8"/>',
 spark:'<path d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5zM20 3v4m-2-2h4"/>',
 document:'<path d="M5 2h10l4 4v16H5zM14 2v5h5M8 11h8m-8 4h8m-8 4h5"/>',
 people:'<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0112 0v3m1-17a3 3 0 010 6m2 4a5 5 0 014 5v2"/>',
 wallet:'<path d="M20 8V5H5a2 2 0 010-4h13v4M5 5H3v15a2 2 0 002 2h15V8z"/><path d="M20 12h-6v6h6m-3-3h.01"/>',
 building:'<path d="M4 22V2h11v20M15 10h5v12M8 6h3M8 10h3M8 14h3M8 22v-4h3v4M2 22h20"/>',
 growth:'<path d="M3 21h18M5 17v-5h4v5m4 0V9h4v8M4 8l6-5 5 2 5-3m-4 0h4v4"/>',
 network:'<rect x="8" y="2" width="8" height="5" rx="1"/><rect x="2" y="17" width="7" height="5" rx="1"/><rect x="15" y="17" width="7" height="5" rx="1"/><path d="M12 7v5M5.5 17v-5h13v5"/>'
};
function solutionIcon(s){return `<span class="solution-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${solutionIcons[s.icon]||solutionIcons.building}</svg></span>`;}
function solutionMenu(){return `<div class="mega-top"><h3>Start with your world.</h3><a href="#/solutions">Explore all solutions ↗</a></div><div class="solutions-columns">${solutionGroups.map(g=>`<section><h4>${g.title}</h4><div class="solution-menu-list">${g.items.map(s=>`<a href="${solutionURL(s)}">${solutionIcon(s)}<span>${s.label}</span><i aria-hidden="true">↗</i></a>`).join('')}</div>${g.id==='organisations'?`<div class="solution-menu-note"><strong>Five products. Your starting point.</strong><p>Find the right fit for your team’s work.</p><a href="#/solutions">Find a solution <span aria-hidden="true">↗</span></a></div>`:''}</section>`).join('')}</div>`;}
function solutionsPage(focus){
 const s=solutions.find(s=>s.id===focus);
 if(s)return solutionDetail(s);
 if(focus)return `<section class="inner-hero wrap"><span class="eyebrow">Solutions</span><h1>Find your<br>starting point.</h1><p>That solution is not in our directory. Explore the industries, teams and organisations below.</p>${button('Explore all solutions','#/solutions')}</section>`;
 return `<section class="inner-hero solution-hub-hero wrap"><span class="eyebrow">Brewling solutions</span><h1>Start with your world.<br>Find your better work.</h1><p>Explore by industry, team or organisation. Find focused products for the challenges your people deal with every day.</p><nav class="solution-jumps" aria-label="Browse solutions">${solutionGroups.map(g=>`<a href="#/solutions?section=${g.id}">${g.title}<span aria-hidden="true">↓</span></a>`).join('')}</nav></section>${solutionGroups.map(g=>`<section class="solution-group wrap" id="${g.id}"><div class="solution-group-head"><div><span class="eyebrow">${g.title}</span><h2>${g.id==='industries'?'Your industry. Its everyday work.':g.id==='teams'?'The work your team owns.':'The way your organisation operates.'}</h2></div><p>${g.description}</p></div><div class="solution-grid">${g.items.map(s=>`<a class="solution-card" href="${solutionURL(s)}">${solutionIcon(s)}<h3>${s.label}<span aria-hidden="true">↗</span></h3><p>${s.intro}</p><div class="solution-product-names">${s.products.map(([id])=>`<span>${products.find(p=>p.id===id).name}</span>`).join('')}</div></a>`).join('')}</div></section>`).join('')}<section class="solution-footnote wrap"><span class="eyebrow">A considered fit</span><p>Each product has its own scope, development stage and deployment requirements. Start with the workflow you need to improve, then assess the product against it.</p></section>${closing('Let’s find the right starting point.')}`;
}
function solutionDetail(s){return `<section class="solution-hero wrap"><div class="solution-detail-intro"><a class="solution-back" href="#/solutions">← All solutions</a><span class="eyebrow">${s.group}</span><h1>${s.label}</h1><p>${s.intro}</p>${button('Discuss your requirements',`#/contact?solution=${s.id}`)}</div><aside class="solution-priorities"><span class="eyebrow">Work to bring into focus</span><ol>${s.priorities.map((text,i)=>`<li><span>0${i+1}</span><p>${text}</p></li>`).join('')}</ol><div class="solution-ai"><strong>AI with a useful job</strong><p>${s.ai}</p></div></aside></section><section class="solution-matches wrap"><div class="section-head"><div><span class="eyebrow">Your starting points</span><h2>Relevant products.</h2></div><p>Explore each product’s role, scope and development stage. Choose the one that fits your workflow.</p></div><div class="solution-match-grid">${s.products.map(([id,role])=>{const p=products.find(p=>p.id===id);return `<article class="solution-product" data-product="${p.id}" style="${theme(p)}"><div class="solution-product-top"><span class="eyebrow">${p.category}</span><span class="maturity-badge">${p.stageLabel}</span></div><h3>${p.name}</h3><p>${role}</p><div class="solution-product-actions">${textLink('Explore '+p.name,productURL(p))}<a href="${contactURL(p)}&solution=${s.id}">Discuss the fit <span aria-hidden="true">↗</span></a></div></article>`}).join('')}</div></section><section class="solution-footnote wrap"><span class="eyebrow">Scope comes first</span><p>These are relevant products to assess for your organisation. Deployment, controls and any connections between systems need to be agreed for the specific workflow.</p></section><section class="closing wrap"><h2>Let’s talk about<br>the work ahead.</h2>${button('Discuss your requirements',`#/contact?solution=${s.id}`)}</section>`;}

function why(){return `<section class="inner-hero wrap"><span class="eyebrow">Why Brewling</span><h1>The Brewling<br>Standard.</h1><p>Our design principles for useful AI, clear responsibility and work you can trace. A shared approach across five focused products.</p></section><section class="editorial-split wrap"><h2>Focused products.<br>A shared point of view.</h2><div><p>Each Brewling product serves a different kind of work. What they share is a commitment to clarity, useful AI and responsible action. This standard guides how we build; each product has its own scope, deployment requirements and development stage.</p><p>You should be able to understand what a product does, where it fits and what your organisation needs to make it work. That principle shapes both the software and how we introduce it.</p></div></section><section class="dark-section"><div class="philosophy wrap"><div><span class="eyebrow">Our approach to AI</span><h2>Useful intelligence.<br>Visible responsibility.</h2><p class="intro">Start with a specific task. Keep the source in view. Make the next action clear.</p></div><div class="principles">${[['Give AI a useful job','Start with a real task, work with permitted information and help people review the result.'],['Keep responsibility visible','Consequential decisions belong to authorised people. Make ownership, review and approval clear.'],['Leave a record people can follow','Connect actions to the sources, decisions and evidence behind them, so the work can be explained later.'],['Design for the operating context','Build around local workflows, mobile use and practical constraints. Nigeria is our starting point.']].map((x,i)=>`<div class="principle"><span>0${i+1}</span><div><h3>${x[0]}</h3><p>${x[1]}</p></div></div>`).join('')}</div></div></section><section class="editorial-split wrap"><h2>Local context is<br>product context.</h2><div><p>Currency, communication habits, connectivity and operating requirements change how software needs to behave. Nigeria is our starting point. Each additional market deserves the same attention.</p><p>We treat these as product decisions to work through with organisations, rather than assuming one configuration fits everyone.</p></div></section><section class="editorial-split wrap"><h2>Start with one<br>important workflow.</h2><div><p>Choose a defined problem, understand the people involved and agree what a useful outcome looks like. Evaluate the product against that work, including the controls, integrations and support your organisation requires.</p>${textLink('Explore the products','#/products')}</div></section>${closing()}`;}
function company(){return `<section class="inner-hero wrap"><span class="eyebrow">About Brewling</span><h1>Ambitious software.<br>Practical purpose.</h1><p>Brewling is building a family of AI-powered products for the work that keeps organisations moving.</p></section><section class="company-block wrap"><p class="manifesto">Good work depends on people having the information, tools and authority to take the next step.<br><em>We’re building around that belief.</em></p></section><section class="editorial-split wrap"><h2>Five products.<br>Clear responsibilities.</h2><div><p>Databrew focuses on enterprise AI. Dealbrew follows commercial transactions. Hirebrew supports people operations. Ledgerbrew brings control to finance operations. Propbrew serves estate and property teams.</p><p>Each has its own audience and a distinct job to do. Brewling provides the shared identity and product philosophy behind the family.</p>${textLink('Meet the products','#/products')}</div></section><section class="editorial-split wrap"><h2>Starting with<br>the work around us.</h2><div><p>Our starting context is Nigeria, with a broader African ambition. We want to understand the details of how organisations operate before making promises about what software should change.</p><p>We welcome conversations with teams who can help shape that work around real needs.</p></div></section>${closing('Help shape what better work looks like.')}`;}
function contact(selected,solutionFocus){const selectedSolution=solutions.find(s=>s.id===solutionFocus);return `<section class="contact-layout wrap"><div><span class="eyebrow">Talk to Brewling</span><h1>Let’s start with<br>your work.</h1><p>Tell us where time is lost, decisions stall or information goes missing. We’ll explore which product fits and what your organisation needs.</p><div class="contact-aside"><h3 id="enquiry-intent-title">A useful first conversation.</h3><p id="enquiry-intent">Share the workflow you want to improve, who uses it and the systems your team works with today. You don’t need to have a product in mind.</p></div></div><form class="form" id="enquiry-form" method="post" action="/api/enquiries" aria-describedby="enquiry-privacy"${selectedSolution?` data-solution="${selectedSolution.id}"`:""}>${selectedSolution?`<div class="enquiry-solution"><span class="eyebrow">Your solution enquiry</span><strong>${selectedSolution.label}</strong><a href="${solutionURL(selectedSolution)}">Review this solution ↗</a></div>`:""}<label for="enquiry-name">Your name</label><input id="enquiry-name" name="name" autocomplete="name" required maxlength="100"><label for="enquiry-email">Work email</label><input id="enquiry-email" name="email" type="email" autocomplete="email" required maxlength="150"><label for="enquiry-company">Organisation</label><input id="enquiry-company" name="company" autocomplete="organization" required maxlength="150"><label for="enquiry-product">What would you like to explore?</label><select id="enquiry-product" name="product"><option value="Not sure yet">Help me find the right product</option>${products.map(p=>`<option value="${p.name}"${p.id===selected?' selected':''}>${p.name} / ${p.category}</option>`).join('')}</select><label for="enquiry-context">What would you like to improve?</label><p class="field-help" id="enquiry-context-help"></p><textarea id="enquiry-context" name="context" aria-describedby="enquiry-context-help" required maxlength="2000"></textarea><div class="enquiry-honeypot" aria-hidden="true"><label for="enquiry-website">Website</label><input id="enquiry-website" name="website" type="text" tabindex="-1" autocomplete="off" maxlength="200"></div><p class="form-note" id="enquiry-privacy">We use your details to respond to this enquiry. Please don’t include passwords or sensitive documents.</p><button type="submit" class="button"><span class="enquiry-submit-label">Send enquiry</span><span aria-hidden="true">↗</span></button><div id="enquiry-result" class="confirmation" role="status" aria-live="polite" aria-atomic="true" tabindex="-1" hidden></div></form></section>`;}
const titles={'/':'Brewling | Make room for better work','/products':'Our Products | Brewling','/solutions':'Solutions | Brewling','/why-brewling':'The Brewling Standard | Why Brewling','/company':'Company | Brewling','/contact':'Talk to Brewling'};
function closeMenus(closeMobile=true){
 document.querySelectorAll('[data-dropdown]').forEach(b=>{b.setAttribute('aria-expanded','false');document.getElementById(b.getAttribute('aria-controls')).hidden=true;});
 if(closeMobile){document.querySelector('#main-nav').classList.remove('is-open');document.querySelector('.menu-toggle').setAttribute('aria-expanded','false');}
}
function openDropdown(id){closeMenus(false);document.querySelector(`#${id}-menu-button`).setAttribute('aria-expanded','true');document.querySelector(`#${id}-menu`).hidden=false;}
function render(){
 disposeEnquiryForm?.();disposeEnquiryForm=null;
 const route=location.hash.slice(1)||'/';const [path,query]=route.split('?');const params=new URLSearchParams(query||'');
 const p=products.find(p=>path==='/products/'+p.id);const selectedSolution=path==='/solutions'?solutions.find(s=>s.id===params.get('focus')):null;
 closeMenus();document.title=p?`${p.name} | ${p.category} | Brewling`:selectedSolution?`${selectedSolution.label} Solutions | Brewling`:(titles[path]||'Page not found | Brewling');
 main.innerHTML=p?productPage(p):path==='/'?home():path==='/products'?directory(params.get('audience')):path==='/solutions'?solutionsPage(params.get('focus')):path==='/why-brewling'?why():path==='/company'?company():path==='/contact'?contact(params.get('product'),params.get('solution')):`<div class="not-found wrap"><h1>Let’s get you<br>back to better work.</h1>${button('Explore products','#/products')}</div>`;
 document.querySelectorAll('#main-nav>a').forEach(a=>{if(a.getAttribute('href')==='#'+path)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 document.querySelectorAll('[data-dropdown]').forEach(b=>{if(path==='/'+b.dataset.dropdown||path.startsWith('/'+b.dataset.dropdown+'/'))b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');});
 document.querySelectorAll('#solutions-menu a').forEach(a=>{if(selectedSolution&&a.getAttribute('href')===solutionURL(selectedSolution))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 bindPage();const section=params.get('section');if(['workflow','industries','teams','organisations'].includes(section)){document.getElementById(section)?.scrollIntoView({behavior:'auto'});}else window.scrollTo({top:0,behavior:'instant'});
}
function selectProduct(id,focus=false){const p=products.find(x=>x.id===id);const panel=document.querySelector('#product-panel');if(!p||!panel)return;document.querySelectorAll('.product-option').forEach(b=>{const active=b.dataset.product===id;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;if(active&&focus)b.focus();});panel.innerHTML=processArt(p);panel.setAttribute('aria-labelledby','tab-'+id);}
const enquiryPrompts={
  databrew:'Describe the knowledge workflow, information boundaries and deployment requirements.',
  dealbrew:'Describe the transaction, counterparties, milestones and approval needs.',
  hirebrew:'Describe your hiring or employee-service workflow and the systems your team uses.',
  ledgerbrew:'Describe your accounting system and invoice, collection or reconciliation process.',
  propbrew:'Describe the estates, operating team and resident or maintenance workflow.'
};
function updateEnquiryContext(){
  const select=document.querySelector('#enquiry-product');if(!select)return;
  const p=products.find(p=>p.name===select.value);
  document.querySelector('#enquiry-intent-title').textContent=p?p.ctaLabel:'A useful first conversation.';
  document.querySelector('#enquiry-intent').textContent=p?p.enquiryIntent:'Share the workflow you want to improve, who uses it and the systems your team works with today. You don’t need to have a product in mind.';
  document.querySelector('#enquiry-context-help').textContent=p?enquiryPrompts[p.id]:'Describe the workflow, who uses it and where work gets held up.';
}
function newEnquiryKey(){
 if(crypto.randomUUID)return crypto.randomUUID();
 const bytes=crypto.getRandomValues(new Uint8Array(16));bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
 const hex=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
 return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}
function bindEnquiryForm(form){
 const result=form.querySelector('#enquiry-result');
 const submit=form.querySelector('button[type="submit"]');
 const submitLabel=submit.querySelector('.enquiry-submit-label');
 const fields=['name','email','company','product','context'];
 const controls=Array.from(form.querySelectorAll('input,select,textarea'));
 let pending=false,sent=false,disposed=false,key='',lastPayload='',controller=null,timer=null;
 const active=()=>!disposed&&form.isConnected;
 function clearFieldErrors(){
  form.querySelectorAll('.field-error').forEach(el=>el.remove());
  fields.forEach(name=>{const field=form.elements.namedItem(name);field.removeAttribute('aria-invalid');const described=(field.getAttribute('aria-describedby')||'').split(' ').filter(id=>id&&id!==`enquiry-${name}-error`);if(described.length)field.setAttribute('aria-describedby',described.join(' '));else field.removeAttribute('aria-describedby');});
 }
 function showStatus(kind,title,message){
  result.replaceChildren();result.hidden=false;result.dataset.state=kind;
  result.setAttribute('role',kind==='error'?'alert':'status');result.setAttribute('aria-live',kind==='error'?'assertive':'polite');
  const heading=document.createElement('h3');heading.textContent=title;result.append(heading);
  const text=document.createElement('p');text.textContent=message;result.append(text);
 }
 function setPending(value){
  pending=value;form.setAttribute('aria-busy',String(value));controls.forEach(field=>{field.disabled=value;});
  submit.disabled=value||sent;submitLabel.textContent=value?'Sending…':sent?'Enquiry sent':'Send enquiry';
 }
 function edited(){
  if(pending)return;
  key='';lastPayload='';sent=false;submit.disabled=false;submitLabel.textContent='Send enquiry';
  clearFieldErrors();result.hidden=true;result.replaceChildren();
 }
 form.addEventListener('input',edited);form.addEventListener('change',edited);
 form.querySelector('#enquiry-product').addEventListener('change',updateEnquiryContext);
 disposeEnquiryForm=()=>{disposed=true;clearTimeout(timer);controller?.abort();};
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(pending||sent||!form.reportValidity())return;
  clearFieldErrors();
  const data=new FormData(form);
  const payload=JSON.stringify({name:String(data.get('name')||''),email:String(data.get('email')||''),company:String(data.get('company')||''),product:String(data.get('product')||'Not sure yet'),context:String(data.get('context')||''),solution:form.dataset.solution||'',website:String(data.get('website')||'')});
  if(!key||payload!==lastPayload){key=newEnquiryKey();lastPayload=payload;}
  controller=new AbortController();let timedOut=false;
  timer=setTimeout(()=>{timedOut=true;controller.abort();},20000);
  setPending(true);showStatus('pending','Sending your enquiry','Please wait while we send your details.');
  let focusTarget=null;
  try{
   const response=await fetch('/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':key},body:payload,signal:controller.signal,credentials:'same-origin'});
   const body=await response.json();if(!active())return;
   if(response.ok&&body?.ok===true&&typeof body.reference==='string'&&body.reference.trim()){
    sent=true;showStatus('success','Your enquiry has been received',`Reference: ${body.reference}`);focusTarget=result;
   }else{
    const message=typeof body?.error==='string'&&body.error.trim()?body.error.slice(0,1000):'We couldn’t confirm your enquiry. Your details are still here. Please try again.';
    showStatus('error','Your enquiry needs attention',message);
    if(body?.fields&&typeof body.fields==='object')fields.forEach(name=>{
     if(typeof body.fields[name]!=='string'||!body.fields[name].trim())return;
     const field=form.elements.namedItem(name);const error=document.createElement('p');error.id=`enquiry-${name}-error`;error.className='field-error';error.textContent=body.fields[name].slice(0,500);field.insertAdjacentElement('afterend',error);field.setAttribute('aria-invalid','true');field.setAttribute('aria-describedby',`${field.getAttribute('aria-describedby')||''} ${error.id}`.trim());if(!focusTarget)focusTarget=field;
    });
    focusTarget=focusTarget||result;
   }
  }catch(error){
   if(!active())return;
   showStatus('error','We couldn’t confirm your enquiry',timedOut?'The request took too long. Your details are still here. Please try again.':'There was a connection problem. Your details are still here. Please try again.');focusTarget=result;
  }finally{
   clearTimeout(timer);controller=null;
   if(active()){setPending(false);focusTarget?.focus({preventScroll:true});if(focusTarget)focusTarget.scrollIntoView({behavior:'auto',block:'nearest'});}
  }
 });
}
function bindPage(){
 updateEnquiryContext();
 document.querySelectorAll('.product-option').forEach((b,i)=>{b.addEventListener('click',()=>selectProduct(b.dataset.product));b.addEventListener('keydown',e=>{let n=i;if(e.key==='ArrowDown')n=(i+1)%products.length;else if(e.key==='ArrowUp')n=(i+products.length-1)%products.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=products.length-1;else return;e.preventDefault();selectProduct(products[n].id,true);});});
 const form=document.querySelector('#enquiry-form');if(form)bindEnquiryForm(form);
}
document.querySelector('#products-menu').innerHTML=`<div class="mega-top"><h3>Find a better way to work.</h3><a href="#/products">See all products ↗</a></div><div class="mega-groups"><section><a class="mega-group-heading" href="#/products?audience=institutions">Institutions & enterprises ↗</a><div class="mega-list">${products.filter(p=>p.id==='databrew').map(p=>`<a href="${productURL(p)}" style="${theme(p)}"><b>${p.name}</b><small>${p.category}</small></a>`).join('')}</div></section><section><a class="mega-group-heading" href="#/products?audience=teams">Operating teams ↗</a><div class="mega-list">${products.filter(p=>p.id!=='databrew').map(p=>`<a href="${productURL(p)}" style="${theme(p)}"><b>${p.name}</b><small>${p.category}</small></a>`).join('')}</div></section></div>`;
document.querySelector('#solutions-menu').innerHTML=solutionMenu();
document.querySelector('#footer-products').innerHTML=products.map(p=>`<a href="${productURL(p)}">${p.name}</a>`).join('');
document.querySelectorAll('[data-dropdown]').forEach(b=>{
 b.addEventListener('click',()=>{if(b.getAttribute('aria-expanded')==='true')closeMenus(false);else openDropdown(b.dataset.dropdown);});
 b.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();openDropdown(b.dataset.dropdown);document.getElementById(b.getAttribute('aria-controls')).querySelector('a').focus();}});
});
document.querySelector('.menu-toggle').addEventListener('click',e=>{const b=e.currentTarget;const expanded=b.getAttribute('aria-expanded')==='true';if(expanded)closeMenus();else{b.setAttribute('aria-expanded','true');document.querySelector('#main-nav').classList.add('is-open');}});
document.addEventListener('click',e=>{
 const link=e.target.closest('a[href^="#/"]');
 if(link&&link.getAttribute('href')===location.hash){
  e.preventDefault();closeMenus();
  const section=new URLSearchParams(location.hash.split('?')[1]||'').get('section');
  if(['workflow','industries','teams','organisations'].includes(section))document.getElementById(section)?.scrollIntoView({behavior:'auto'});
  else window.scrollTo({top:0,behavior:'instant'});
  main.focus({preventScroll:true});
 }else if(!e.target.closest('.site-header'))closeMenus();
});
document.addEventListener('focusin',e=>{if(!e.target.closest('.site-header'))closeMenus();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const openButton=document.querySelector('[data-dropdown][aria-expanded="true"]');const mobileOpen=document.querySelector('#main-nav').classList.contains('is-open');const toggle=document.querySelector('.menu-toggle');closeMenus();if(mobileOpen&&getComputedStyle(toggle).display!=='none')toggle.focus();else openButton?.focus();}});
document.querySelector('.skip').addEventListener('click',e=>{e.preventDefault();main.focus({preventScroll:true});main.scrollIntoView({behavior:'auto'});});
window.addEventListener('hashchange',()=>{render();main.focus({preventScroll:true});});
render();
