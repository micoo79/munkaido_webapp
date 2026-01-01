<!doctype html>
<html lang="hu">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
  <title>VMKK KultÓra – Évváltás manual</title>
  <style>
    :root{
      --bg:#0b0c10;
      --panel:#12141a;
      --text:#f2f3f5;
      --muted:#c9cbd1;
      --accent:#ff8a00;
      --codebg:#0f1117;
      --border:rgba(255,255,255,.10);
      --ok:#7CFF9B;
      --warn:#ffd08a;
      --err:#ff6b6b;
    }
    *{box-sizing:border-box;}
    html,body{height:100%; margin:0; background:var(--bg); color:var(--text); font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;}
    .wrap{max-width:980px; margin:0 auto; padding:22px 14px 40px;}
    .card{
      background:var(--panel);
      border:1px solid var(--border);
      border-radius:18px;
      padding:18px 18px 10px;
      box-shadow:0 10px 30px rgba(0,0,0,.25);
    }
    h1{margin:0 0 10px; font-size:22px; letter-spacing:.2px;}
    .subtitle{color:var(--muted); font-size:14px; line-height:1.3; margin:0 0 18px;}
    h2{margin:18px 0 8px; font-size:18px;}
    h3{margin:14px 0 8px; font-size:15px; color:var(--text);}
    p{margin:8px 0; color:var(--text); line-height:1.45;}
    .note, .warnbox, .okbox{
      border:1px solid var(--border);
      border-radius:14px;
      padding:10px 12px;
      margin:10px 0;
      background:rgba(255,255,255,.04);
    }
    .warnbox{border-color:rgba(255,208,138,.35);}
    .okbox{border-color:rgba(124,255,155,.25);}
    .note b{color:var(--accent);}
    .warnbox b{color:var(--warn);}
    .okbox b{color:var(--ok);}
    code, pre{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;}
    pre{
      background:var(--codebg);
      border:1px solid rgba(255,255,255,.08);
      border-radius:14px;
      padding:12px;
      overflow:auto;
      margin:10px 0 12px;
      font-size:13px;
      line-height:1.35;
    }
    .kbd{border:1px solid rgba(255,255,255,.16); border-bottom-color:rgba(255,255,255,.28); padding:1px 6px; border-radius:8px; font-size:12px; color:var(--text); background:rgba(255,255,255,.05);}
    ol{margin:8px 0 10px 20px; padding:0;}
    ul{margin:8px 0 10px 18px; padding:0;}
    li{margin:6px 0; line-height:1.45;}
    hr{border:0; border-top:1px solid var(--border); margin:16px 0;}
    .small{color:var(--muted); font-size:13px;}
    .chip{display:inline-block; padding:2px 8px; border-radius:999px; border:1px solid var(--border); background:rgba(255,255,255,.04); font-size:12px; color:var(--muted);}
    .footer{margin-top:16px; color:var(--muted); font-size:12px; text-align:center;}
    a{color:#9ad1ff; text-decoration:none;}
    a:hover{text-decoration:underline;}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <h1>VMKK KultÓra – Évváltás manual</h1>
     

      <div class="warnbox">
        CSV export (mentés) → régi év adatainak törlése → új év naptárnapjainak feltöltése → HTML-ekben fix évszám átírása → deploy → teszt.
      </div>

      <hr/>

      <h2>0) Mit fogsz csinálni, röviden</h2>
      <ol>
        <li><b>Belépsz</b> Supabase-be (adatbázis). <a href="https://supabase.com/dashboard/project/yxtkxiyyddsuzxcqvypb/editor/17493?schema=app"> Link </a></li>
        <li><b>Exportálod CSV-be</b> a fontos táblákat (biztonsági mentés).</li>
        <li><b>Törlöd</b> a régi év adatait (<code>entries</code> + <code>calendar_days</code>).</li>
        <li><b>Létrehozod</b> az új év naptárnapjait (H–P munkanap, Szo-V pihenő; ünnepnapok később managerből).</li>
        <li><b>Kódban átírod</b> a fix évszámokat (app.html + adatlap.html + manager.html, ha van benne).</li>
        <li><b>Deployolod</b> (GitHub → Cloudflare Pages). <a href="https://github.com/micoo79/munkaido_webapp/tree/main"> GitHub </a> , <a href="https://dash.cloudflare.com/e01c7d59f65ca2564d68d0a79462b002/pages/view/munkaido-webapp"> Cloudflare </a>  </li>
        <li><b>Ellenőrzöd</b>, hogy minden működik (belépés, naptár, összesítő, manager).</li>
      </ol>

      <hr/>

      <h2>1) Előkészületek (fontos!)</h2>

      <h3>1.1 Mikor csináld?</h3>
      <ul>
        <li>Ideálisan <b>december vége / január eleje</b> környékén, amikor biztos, hogy már nem kell a régi évbe rögzíteni.</li>
      </ul>

      <h3>1.2 Mit fogsz elveszíteni?</h3>
      <ul>
        <li>A webappban <b>nem lesz visszanézhető</b> a régi év rögzítése.</li>
        <li>Viszont a CSV exportból később bármikor elővehető.</li>
      </ul>

      <h3>1.3 Mi kell hozzá?</h3>
      <ul>
        <li><b>Supabase</b> projekt (Dashboard / Table Editor / SQL Editor)</li>
        <li><b>GitHub</b> repo (ahol a html fájlok vannak)</li>
        <li><b>Cloudflare Pages</b> (ahol fut az oldal)</li>
      </ul>
    

      <hr/>

      <h2>2) Supabase: biztonsági mentés (CSV export)</h2>

      <h3>2.1 Belépés Supabase-be</h3>
      <ol>
        <li>Nyisd meg a Supabase Dashboardot (bookmark vagy keresés: “Supabase dashboard”).</li>
        <li>Jelentkezz be.</li>
        <li>Válaszd ki a projektet</li>
      </ol>

      <h3>2.2 Táblák exportálása</h3>
      <ol>
        <li>Menü: <b>Table Editor</b></li>
        <li>Exportáld CSV-be ezeket (legalább):
          <ul>
            <li><code>app.entries</code></li>
            <li><code>app.calendar_days</code></li>
            <li><code>app.profiles</code></li>
            <li><code>app.user_invites</code> (ha használod)</li>
          </ul>
        </li>
        <li>Mentsd egy mappába pl.: <code>KultOra_backup_2026_YYYY-MM-DD/</code></li>
        <li>Fájlnév javaslat:
          <ul>
            <li><code>entries_2026_backup.csv</code></li>
            <li><code>calendar_days_2026_backup.csv</code></li>
            <li><code>profiles_backup.csv</code></li>
            <li><code>user_invites_backup.csv</code></li>
          </ul>
        </li>
      </ol>

      <div class="note">
        <b>Tipp:</b> export után nyiss meg 1–2 CSV-t, hogy biztosan nem üresek.
      </div>

      <hr/>

      <h2>3) Supabase: évváltás adatbázis oldalon (törlés + új naptár)</h2>

      <h3>3.1 SQL Editor megnyitása</h3>
      <ol>
        <li>Supabase Dashboard → <b>SQL Editor</b></li>
        <li><b>New query</b> / “+ New”</li>
      </ol>

      <h3>3.2 Régi év adatainak törlése (entries, calendar_days)</h3>
      <div class="warnbox">
        <b>FONTOS:</b> először <code>entries</code>, utána <code>calendar_days</code>. És csak akkor, ha a CSV mentés már megvan.
      </div>

      <p>Példa: 2026 törlése (2026-01-01…2027-01-01)</p>
      <pre><code>-- 1) 2026-os rögzítések törlése
delete from app.entries
where date >= '2026-01-01'::date
  and date <  '2027-01-01'::date;

-- 2) 2026-os naptárnapok törlése
delete from app.calendar_days
where date >= '2026-01-01'::date
  and date <  '2027-01-01'::date;</code></pre>

      <p>Ellenőrzés:</p>
      <pre><code>select count(*) as entries_2026
from app.entries
where date >= '2026-01-01'::date and date < '2027-01-01'::date;

select count(*) as cal_2026
from app.calendar_days
where year = 2026;</code></pre>

      <p>Elvárt eredmény:</p>
      <ul>
        <li><code>entries_2026 = 0</code></li>
        <li><code>cal_2026 = 0</code></li>
      </ul>

      <h3>3.3 Új év (pl. 2027) alaprend naptár beszúrás</h3>
      <p>Ez feltölti az év minden napját, alap munkarenddel:</p>
      <ul>
        <li>H–P: <code>is_workday = true</code></li>
        <li>Szombat–Vasárnap: <code>is_workday = false</code></li>
        <li>Ünnepnapok/dolgozós szombat: manager állítja be később</li>
      </ul>

      <pre><code>insert into app.calendar_days (date, year, is_workday, holiday_name, special_workday)
select
  d::date as date,
  2027 as year,
  case when extract(isodow from d) in (6,7) then false else true end as is_workday,
  null::text as holiday_name,
  false as special_workday
from generate_series('2027-01-01'::date, '2027-12-31'::date, interval '1 day') d;</code></pre>

      <p>Ellenőrzés:</p>
      <pre><code>select count(*) as cal_2027
from app.calendar_days
where year = 2027;

select min(date), max(date)
from app.calendar_days
where year = 2027;</code></pre>

      <p>Elvárt:</p>
      <ul>
        <li><code>cal_2027 = 365</code> (szökőévben 366)</li>
        <li>min: <code>2027-01-01</code>, max: <code>2027-12-31</code></li>
      </ul>

      <hr/>

      <h2>4) Kódban átírni az évet (HTML-ek)</h2>

      <h3>4.1 Hol vannak a fájlok?</h3>
      <p>Repo gyökérben tipikusan:</p>
      <ul>
        <li><code>index.html</code> (belépés)</li>
        <li><code>app.html</code> (napi rögzítés naptár)</li>
        <li><code>adatlap.html</code> (összesítő / éves mini naptár)</li>
        <li><code>manager.html</code> (manager felület)</li>
        <li><code>manifest.webmanifest</code>, <code>icons/</code>, <code>kult_logo.png</code> (PWA ikonok)</li>
      </ul>

      <h3>4.2 GitHub szerkesztés (ha elfelejted)</h3>
      <ol>
        <li>Nyisd meg GitHub → repo → fájl lista.</li>
        <li>Kattints a fájlra (pl. <code>app.html</code>).</li>
        <li>“Edit” (ceruza ikon).</li>
        <li>Módosíts.</li>
        <li>Lent: “Commit changes” → commit üzenet pl.: <code>Year rollover to 2027</code></li>
      </ol>

      <hr/>

      <h2>5) app.html – mit kell átírni</h2>
      <p>Keresés: <span class="kbd">Ctrl</span> + <span class="kbd">F</span> → <code>2026</code></p>

      <p><b>Fixen átírandók:</b></p>
      <ol>
        <li><code>let curYear = 2026;</code> → <code>let curYear = 2027;</code></li>
        <li><code>if(nav.y!==2026) return;</code> → <code>if(nav.y!==2027) return;</code></li>
        <li><code>qy === 2026</code> → <code>qy === 2027</code></li>
        
      </ol>

      

      <hr/>

      <h2>6) adatlap.html – mit kell átírni</h2>
      <p>Keresés: <code>2026</code></p>
      <ol>
        <li><code>const YEAR = 2026;</code> → <code>const YEAR = 2027;</code></li>
 
        <li>Ha bárhol szövegben is szerepel 2026, azt is cseréld.</li>
      </ol>

      <hr/>

      <h2>7) manager.html – mit kell átírni (ha van benne év)</h2>
    
      <ol>
        <li>Ha van <code>const YEAR = 2026;</code> → <code>2027</code></li>
        <li>Ha van lekérés: <code>.eq('year', 2026)</code> → <code>.eq('year', 2027)</code></li>
        <li>Ha van dátumtartomány fixen:
          <ul>
            <li><code>'2026-01-01' … '2027-01-01'</code> → <code>'2027-01-01' … '2028-01-01'</code></li>
          </ul>
        </li>
        <li>Keress rá: <code>2026</code> és mindent nézz végig.</li>
      </ol>

      <hr/>

      <h2>8) index.html – kell-e itt bármit átírni?</h2>
      <p>Általában <b>nem</b>, mert a belépés évfüggetlen.</p>
      <ul>
        <li>DEV / teszt dolgok ne maradjanak benne.</li>
        <li>PWA meta/manifest maradhat.</li>
      </ul>

      <hr/>

      <h2>9) Deploy: Cloudflare Pages (hogy élesben frissüljön)</h2>

      <h3>9.1 Cloudflare Pages működés</h3>
      <p>Tipikusan: GitHub commit a megfelelő branch-en → Cloudflare Pages automatikusan build+deploy.</p>

      <h3>9.2 Hogyan ellenőrzöd, hogy deployolt-e?</h3>
      <ol>
        <li>Cloudflare Dashboard</li>
        <li><b>Pages</b></li>
        <li>Projekt kiválasztása</li>
        <li><b>Deployments</b> fül</li>
        <li>Legfrissebb deploy legyen <b>Success</b></li>
      </ol>

      <div class="note">
        <b>Ha nem frissül:</b> nézd meg a deployment logot, és ellenőrizd, hogy a Pages azt a branch-et figyeli, ahova commitoltál.
      </div>

      <hr/>

      <h2>10) Utóellenőrzés (nagyon fontos lista)</h2>

      <h3>10.1 Belépés</h3>
      <ul>
        <li><code>index.html</code> → email → kód → belépés</li>
      </ul>

      <h3>10.2 app.html (rögzítés)</h3>
      <ul>
        <li>Ellenőrizd, hogy az év már az új (pl. 2027)</li>
        <li>Kattints egy napra → ments → frissüljön</li>
      </ul>

      <h3>10.3 adatlap.html (összesítő)</h3>
      <ul>
        <li>A mini naptár az új évre mutat</li>
        <li>Szabi / túlóra számok nem hibáznak</li>
        <li>Hiányzó jelölések logikája oké</li>
      </ul>

      <h3>10.4 manager.html</h3>
      <ul>
        <li>Tudsz ünnepet felvinni az új évben</li>
        <li>Tudsz dolgozós szombatot felvinni</li>
        <li>Mentés után app/adatlap is azt látja</li>
      </ul>

      <hr/>

      <h2>11) Gyakori hibák + gyors megoldás</h2>

      <h3>„Üres a naptár”</h3>
      <p>Ok: nincs feltöltve <code>calendar_days</code> az új évre, vagy rossz évre ment.</p>
      <pre><code>select count(*) from app.calendar_days where year=2027;</code></pre>

      <h3>„Még mindig 2026-ot mutat”</h3>
      <p>Ok: maradt fix 2026 a kódban.</p>
      <ul>
        <li>GitHub keresés: <code>2026</code></li>
        <li><code>app.html</code> + <code>adatlap.html</code> + <code>manager.html</code> átnéz</li>
      </ul>

      <h3>„Furcsa mai nap / számítások”</h3>
      <p>Ok: DEV_TODAY bekapcsolva.</p>
      <ul>
        <li>Legyen: <code>const DEV_TODAY = '';</code></li>
      </ul>

      <h3>„Nem frissül mobilon”</h3>
      <p>Ok: cache / PWA cache.</p>
      <ul>
        <li>Android: Chrome → webhelyadatok törlése / uninstall PWA → újratelepítés</li>
        <li>iOS: Safari cache törlés → újra hozzáadás a főképernyőhöz</li>
      </ul>

      <hr/>

      <h2>12) „Sablon” évváltás – csak a számokat cseréled</h2>
      <p>Ha 2027→2028:</p>

      <h3>SQL-ben</h3>
      <ul>
        <li>Törlés: <code>2027-01-01 … 2028-01-01</code></li>
        <li>Insert: <code>year=2028</code>, dátum <code>2028-01-01 … 2028-12-31</code></li>
      </ul>

      <h3>Kódban</h3>
      <ul>
        <li><code>app.html</code>: <code>curYear</code>, nav limit, query check → 2028</li>
        <li><code>adatlap.html</code>: <code>YEAR</code> → 2028</li>
        <li><code>manager.html</code>: minden fix év → 2028</li>
      </ul>

      <hr/>

      <h2>Extra: mindent egy helyen „Year change” checklist</h2>
      <ol>
        <li>Supabase: CSV export (<code>entries</code>, <code>calendar_days</code>, <code>profiles</code>, <code>user_invites</code>)</li>
        <li>Supabase SQL:
          <ul>
            <li>delete entries (régi év)</li>
            <li>delete calendar_days (régi év)</li>
            <li>insert calendar_days (új év alaprend)</li>
          </ul>
        </li>
        <li>GitHub: évszám csere:
          <ul>
            <li><code>app.html</code></li>
            <li><code>adatlap.html</code></li>
            <li><code>manager.html</code></li>
            
          </ul>
        </li>
        <li>Cloudflare Pages: deploy success</li>
        <li>Teszt: belépés → rögzítés → összesítő → manager</li>
      </ol>

      <div class="footer">
     
      </div>
    </div>
  </div>
</body>
</html>
