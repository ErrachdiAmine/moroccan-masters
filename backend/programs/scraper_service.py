import urllib.request
import re
import json
import datetime
from .models import Program

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
}

MONTHS_FR = {
    'janvier': 1, 'février': 2, 'mars': 3, 'avril': 4, 'mai': 5, 'juin': 6,
    'juillet': 7, 'août': 8, 'septembre': 9, 'octobre': 10, 'novembre': 11, 'décembre': 12
}

def scrape_tawjihnet():
    url = "https://www.tawjihnet.net/category/master-licence-professionnelle/"
    programs = []
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8', errors='ignore')
        matches = re.findall(r'<h2[^>]*class=[\'"][^\'"]*entry-title[^\'"]*[\'"][^>]*>\s*<a href=[\'"]([^\'"]+)[\'"][^>]*>([^<]+)</a>', html, re.IGNORECASE)
        
        for link, title in matches:
            t_clean = title.strip()
            city = 'Morocco'
            for c in ['Rabat', 'Casablanca', 'Marrakech', 'Fez', 'Tetouan', 'Tangier', 'Agadir', 'Oujda', 'Meknes', 'El Jadida', 'Kenitra', 'Settat']:
                if c.lower() in t_clean.lower():
                    city = c
                    break

            programs.append({
                "title": t_clean,
                "university": f"Université / Faculté ({city})",
                "faculty": city,
                "city": city,
                "specialization": "Cultural Studies & Literature" if "flsh" in t_clean.lower() or "lettre" in t_clean.lower() else "Applied Linguistics & ELT",
                "deadline": "2026-09-15",
                "portal_url": link,
                "source": "Tawjihnet.net",
                "description": f"Concours Master publié sur Tawjihnet.net: {t_clean}"
            })
    except Exception as e:
        print("Scrape Tawjihnet err:", e)
    return programs


def scrape_orientation_chabab():
    url = "https://orientation-chabab.com/master"
    programs = []
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8', errors='ignore')
        matches = re.findall(r'<a[^>]*href=[\'"](https://orientation-chabab\.com/master/[^\'"]+)[\'"][^>]*>\s*<div[^>]*class=[\'"][^\'"]*card[^\'"]*[\'"][^>]*>(.*?)</div>\s*</a>', html, re.DOTALL | re.IGNORECASE)

        if not matches:
            matches_simple = re.findall(r'<a[^>]*href=[\'"](https://orientation-chabab\.com/master/[^\'"]+)[\'"][^>]*>([^<]+)</a>', html, re.IGNORECASE)
            for link, title in matches_simple:
                if len(title.strip()) > 5:
                    programs.append({
                        "title": title.strip(),
                        "university": "Université Marocaine",
                        "faculty": "FLSH / FSJES",
                        "city": "Morocco",
                        "specialization": "Interdisciplinary Humanities",
                        "deadline": "2026-09-10",
                        "portal_url": link,
                        "source": "Orientation-Chabab",
                        "description": f"Master notice from Orientation-Chabab: {title.strip()}"
                    })
    except Exception as e:
        print("Scrape Orientation-Chabab err:", e)
    return programs


def scrape_almaster_maroc():
    feed_url = "https://www.almaster-maroc.com/feeds/posts/default?alt=json&max-results=50"
    programs = []
    try:
        req = urllib.request.Request(feed_url, headers=HEADERS)
        res = urllib.request.urlopen(req, timeout=10)
        feed_data = json.loads(res.read().decode('utf-8'))
        entries = feed_data.get('feed', {}).get('entry', [])

        for entry in entries:
            raw_title = entry.get('title', {}).get('$t', '').strip()
            links = entry.get('link', [])
            html_link = next((l.get('href') for l in links if l.get('rel') == 'alternate'), '')
            pub_date = entry.get('published', {}).get('$t', '')[:10]
            content = entry.get('content', {}).get('$t', '')
            
            clean_text = re.sub(r'<[^>]+>', ' ', content)
            clean_text = re.sub(r'\s+', ' ', clean_text).strip()
            
            city = 'Morocco'
            for c in ['Casablanca', 'Rabat', 'Marrakech', 'Fez', 'Fès', 'Tetouan', 'Tanger', 'Tangier', 'Meknes', 'Meknès', 'El Jadida', 'Kenitra', 'Kénitra', 'Settat', 'Beni Mellal', 'Béni Mellal', 'Agadir', 'Oujda', 'Taroudant']:
                if c.lower() in raw_title.lower() or c.lower() in clean_text.lower():
                    city = c.replace('Fès', 'Fez').replace('Meknès', 'Meknes').replace('Kénitra', 'Kenitra').replace('Béni Mellal', 'Beni Mellal')
                    break

            spec = 'Interdisciplinary Humanities'
            t_lower = raw_title.lower() + " " + clean_text.lower()
            if any(k in t_lower for k in ['english', 'elt', 'linguistics', 'tefl', 'applied linguistics']):
                spec = 'Applied Linguistics & ELT'
            elif any(k in t_lower for k in ['flsh', 'litterature', 'littérature', 'cultural', 'culture', 'lettres', 'gender', 'humanities']):
                spec = 'Cultural Studies & Literature'
            elif any(k in t_lower for k in ['ismac', 'media', 'communication', 'journalism', 'presse']):
                spec = 'Communication & Media'
            elif any(k in t_lower for k in ['traductions', 'translation', 'king fahd', 'esrft', 'interprétation']):
                spec = 'Translation Studies'

            deadline = '2026-09-15'
            date_matches = re.findall(r'(\d{1,2})\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+(\d{4})', clean_text, re.IGNORECASE)
            if date_matches:
                day, mon_name, year = date_matches[0]
                mon_num = MONTHS_FR.get(mon_name.lower(), 9)
                deadline = f"{year}-{int(mon_num):02d}-{int(day):02d}"
            elif pub_date:
                if pub_date >= "2026-08-28":
                    deadline = "2026-08-31"

            programs.append({
                "title": raw_title,
                "university": f"Faculté / Université ({city})",
                "faculty": city,
                "city": city,
                "specialization": spec,
                "deadline": deadline,
                "portal_url": html_link,
                "source": "AlMaster-Maroc.com",
                "description": clean_text[:250] + "..."
            })
    except Exception as e:
        print("Scrape AlMaster-Maroc err:", e)
    return programs


def run_morocco_scraper():
    t_items = scrape_tawjihnet()
    o_items = scrape_orientation_chabab()
    a_items = scrape_almaster_maroc()
    all_items = t_items + o_items + a_items

    created_count = 0
    updated_count = 0

    for item in all_items:
        obj, created = Program.objects.get_or_create(
            portal_url=item['portal_url'],
            defaults={
                'title': item['title'],
                'university': item['university'],
                'faculty': item['faculty'],
                'city': item['city'],
                'specialization': item['specialization'],
                'deadline': datetime.datetime.strptime(item['deadline'], '%Y-%m-%d').date(),
                'source': item['source'],
                'description': item['description'],
                'is_saved': False
            }
        )
        if created:
            created_count += 1
        else:
            obj.deadline = datetime.datetime.strptime(item['deadline'], '%Y-%m-%d').date()
            obj.save()
            updated_count += 1

    return {
        "scraped_total": len(all_items),
        "created_new": created_count,
        "updated_existing": updated_count
    }
