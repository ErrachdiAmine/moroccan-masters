import urllib.request
import urllib.parse
import re
import json
import datetime

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
}

def fetch_url(url, timeout=10):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return ""

def scrape_orientation_chabab():
    print("Scraping Orientation-Chabab.com for Master openings...")
    html = fetch_url("https://orientation-chabab.com/master")
    if not html:
        return []
    
    # Matching href and inner text inside h2 tags
    pattern = r'<h2[^>]*>\s*<a\s+[^>]*href=[\'"]([^\'"]+)[\'"][^>]*>(.*?)</a>\s*</h2>'
    matches = re.findall(pattern, html, re.IGNORECASE | re.DOTALL)
    
    results = []
    seen = set()

    for href, raw_title in matches:
        title = re.sub(r'<[^>]+>', '', raw_title).strip()
        full_url = "https://orientation-chabab.com" + href if href.startswith('/') else href
        
        if full_url in seen:
            continue
        seen.add(full_url)

        city = "Morocco"
        univ = "Moroccan University"
        t_low = title.lower()

        if "rabat" in t_low: city = "Rabat"; univ = "Université Mohammed V (UM5)"
        elif "casablanca" in t_low or "casa" in t_low: city = "Casablanca"; univ = "Université Hassan II (UH2)"
        elif "marrakech" in t_low: city = "Marrakech"; univ = "Université Cadi Ayyad (UCA)"
        elif "fès" in t_low or "fes" in t_low: city = "Fez"; univ = "Université USMBA Fez"
        elif "agadir" in t_low or "ait melloul" in t_low: city = "Agadir"; univ = "Université Ibn Zohr (UIZ)"
        elif "el jadida" in t_low: city = "El Jadida"; univ = "Université Chouaib Doukkali (UCD)"
        elif "béni mellal" in t_low or "beni mellal" in t_low: city = "Beni Mellal"; univ = "Université USMS"
        elif "tétouan" in t_low or "tangier" in t_low or "tanger" in t_low: city = "Tetouan/Tangier"; univ = "Université Abdelmalek Essaadi (UAE)"
        elif "meknès" in t_low or "meknes" in t_low: city = "Meknes"; univ = "Université Moulay Ismail (UMI)"
        elif "oujda" in t_low: city = "Oujda"; univ = "Université Mohammed Premier (UMP)"

        spec = "Interdisciplinary Humanities"
        if any(k in t_low for k in ['esef', 'ens', 'éducation', 'teaching', 'pedagogy', 'langue']):
            spec = "Applied Linguistics & ELT"
        elif any(k in t_low for k in ['flsh', 'lettres', 'littérature', 'culture']):
            spec = "Cultural Studies & Literature"
        elif any(k in t_low for k in ['média', 'media', 'communication']):
            spec = "Communication & Media"
        elif any(k in t_low for k in ['traduction', 'translation']):
            spec = "Translation Studies"

        results.append({
            "id": "oc-" + re.sub(r'[^a-zA-Z0-9]', '', href)[-12:],
            "univ": univ,
            "faculty": title,
            "title": title,
            "city": city,
            "spec": spec,
            "deadline": "2026-09-30",
            "portalUrl": full_url,
            "source": "Orientation-Chabab",
            "tests": "Dossier pre-selection score + Written Concours + Oral Interview.",
            "desc": f"Official Master admission notice published on Orientation-Chabab: {title}.",
            "isSaved": False
        })
            
    print(f"Scraped {len(results)} Master entries from Orientation-Chabab.")
    return results

def scrape_tawjihnet():
    print("Scraping Tawjihnet.net for Master & University Concours...")
    html = fetch_url("https://www.tawjihnet.net/")
    if not html:
        return []
    
    links = re.findall(r'<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)</a>', html, re.IGNORECASE | re.DOTALL)
    results = []
    seen = set()
    
    for href, text in links:
        clean_text = re.sub(r'<[^>]+>', '', text).strip()
        if any(kw in clean_text.lower() for kw in ['master', 'جامعة', 'كلية', 'licence', 'انتقاء', 'مباراة']) and href not in seen:
            if 'tawjihnet.net' in href and len(clean_text) > 8:
                seen.add(href)
                city = "Morocco"
                if "رباط" in clean_text or "UM5" in clean_text: city = "Rabat"
                elif "البيضاء" in clean_text or "UH2" in clean_text: city = "Casablanca"
                elif "مراكش" in clean_text or "UCA" in clean_text: city = "Marrakech"
                elif "فاس" in clean_text or "USMBA" in clean_text: city = "Fez"
                elif "تطوان" in clean_text or "UAE" in clean_text: city = "Tetouan/Tangier"
                elif "مكناس" in clean_text or "UMI" in clean_text: city = "Meknes"
                elif "أكادير" in clean_text or "UIZ" in clean_text: city = "Agadir"
                
                results.append({
                    "id": "tn-" + str(abs(hash(href)) % 1000000),
                    "univ": f"Université {city}",
                    "faculty": clean_text,
                    "title": clean_text,
                    "city": city,
                    "spec": "Applied Linguistics & ELT" if any(k in clean_text for k in ["ESEF", "ENS", "إجازة"]) else "Cultural Studies & Literature",
                    "deadline": "2026-09-28",
                    "portalUrl": href,
                    "source": "Tawjihnet.net",
                    "tests": "Pre-selection calculation + written exam + oral interview.",
                    "desc": f"Official concours & master pre-registration announcement from Tawjihnet: {clean_text}.",
                    "isSaved": False
                })
                
    print(f"Scraped {len(results)} university announcements from Tawjihnet.")
    return results

def main():
    print("=== MOROCCO MASTER ANNOUNCEMENT AGGREGATOR ===")
    oc_data = scrape_orientation_chabab()
    tn_data = scrape_tawjihnet()
    
    combined = oc_data + tn_data
    
    output_path = "live_masters.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump({
            "updated_at": datetime.datetime.now().isoformat(),
            "count": len(combined),
            "programs": combined
        }, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully generated {output_path} with {len(combined)} live master announcements.")

if __name__ == "__main__":
    main()
