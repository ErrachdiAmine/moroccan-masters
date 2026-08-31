import os
import django
import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from programs.models import Program, ChecklistItem
from programs.scraper_service import run_morocco_scraper

def seed():
    print("Seeding initial Checklist Items...")
    checklist_items = [
        ('c1', 'Baccalaureate Diploma (Original + Legalized Copies)', True, 1),
        ('c2', 'Licence Diploma / Attestation de Réussite', True, 2),
        ('c3', 'Official Transcripts S1, S2, S3, S4, S5, S6 (Relevés de notes)', True, 3),
        ('c4', 'National Identity Card (CIN Legalized Copy)', False, 4),
        ('c5', 'Statement of Purpose / Motivation Letter (Customized for ELT/Lit)', False, 5),
        ('c6', 'Academic CV in English', True, 6),
        ('c7', 'Recommendation Letters (2 Professors from English Dept)', False, 7),
    ]

    for code, label, done, order in checklist_items:
        ChecklistItem.objects.get_or_create(
            code=code,
            defaults={'label': label, 'is_completed': done, 'order': order}
        )

    print("Seeding Curated English Studies Master Programs...")
    curated = [
        {
            "title": "Master in Applied Linguistics and ELT",
            "university": "Université Mohammed V (UM5)",
            "faculty": "FLSH Rabat",
            "city": "Rabat",
            "specialization": "Applied Linguistics & ELT",
            "deadline": datetime.date(2026, 9, 28),
            "portal_url": "https://emaster.um5.ac.ma",
            "source": "University Portal",
            "tests_info": "S1-S6 score + Written Concours + Oral Interview.",
            "description": "Focuses on second language acquisition, curriculum development, and discourse analysis.",
            "is_saved": True
        },
        {
            "title": "Master in Literature and Cultural Studies",
            "university": "Université Mohammed V (UM5)",
            "faculty": "FLSH Rabat",
            "city": "Rabat",
            "specialization": "Cultural Studies & Literature",
            "deadline": datetime.date(2026, 9, 30),
            "portal_url": "https://emaster.um5.ac.ma",
            "source": "University Portal",
            "tests_info": "Academic record + Written literary essay + Oral defense.",
            "description": "Specialized in postcolonial studies, Moroccan Anglophone literature, and cultural theory.",
            "is_saved": False
        },
        {
            "title": "Master in Cultural Studies: Cultures in Contact",
            "university": "Université Hassan II (UH2)",
            "faculty": "FLSH Ben M'Sik Casablanca",
            "city": "Casablanca",
            "specialization": "Cultural Studies & Literature",
            "deadline": datetime.date(2026, 10, 5),
            "portal_url": "http://candidature.univh2c.ma",
            "source": "University Portal",
            "tests_info": "Written test on cultural theory + Oral exam.",
            "description": "Cultural hybridity, identity, media representation, and migration narratives.",
            "is_saved": True
        },
        {
            "title": "Master in Applied Linguistics & TEFL",
            "university": "Université Hassan II (UH2)",
            "faculty": "FLSH Aïn Chock Casablanca",
            "city": "Casablanca",
            "specialization": "Applied Linguistics & ELT",
            "deadline": datetime.date(2026, 9, 25),
            "portal_url": "http://candidature.univh2c.ma",
            "source": "University Portal",
            "tests_info": "Transcript review + Written entrance exam + Oral interview.",
            "description": "English teaching methodology, syllabus design, and educational research.",
            "is_saved": False
        },
        {
            "title": "Master in Applied Linguistics and Language Teaching",
            "university": "Université Cadi Ayyad (UCA)",
            "faculty": "FLSH Marrakech",
            "city": "Marrakech",
            "specialization": "Applied Linguistics & ELT",
            "deadline": datetime.date(2026, 9, 22),
            "portal_url": "https://candidature.uca.ma",
            "source": "University Portal",
            "tests_info": "Transcripts formula + Written exam on English pedagogy.",
            "description": "Sociolinguistics, psycholinguistics, and language assessment.",
            "is_saved": False
        },
        {
            "title": "Master in Cultural Studies: Cultures, Identities & Nationhood",
            "university": "Université Sidi Mohamed Ben Abdellah (USMBA)",
            "faculty": "FLSH Dhar El Mahraz Fez",
            "city": "Fez",
            "specialization": "Cultural Studies & Literature",
            "deadline": datetime.date(2026, 10, 2),
            "portal_url": "https://master.usmba.ac.ma",
            "source": "University Portal",
            "tests_info": "Written exam on critical theory + Oral defense.",
            "description": "Explores nationalism, gender, postcolonial literature, and subaltern studies.",
            "is_saved": True
        },
        {
            "title": "Master in Translation & Interpretation (English-Arabic-French)",
            "university": "King Fahd School of Translation (ESRFT / UAE)",
            "faculty": "ESRFT Tangier",
            "city": "Tetouan/Tangier",
            "specialization": "Translation Studies",
            "deadline": datetime.date(2026, 9, 18),
            "portal_url": "https://candidature.uae.ac.ma",
            "source": "University Portal",
            "tests_info": "Competitive Concours: Written translation + Oral sight translation.",
            "description": "Morocco's premier specialized institute for translation and interpretation.",
            "is_saved": False
        }
    ]

    for p in curated:
        Program.objects.get_or_create(
            title=p["title"],
            university=p["university"],
            defaults=p
        )

    print("Running Live Master Scraper to populate DB...")
    res = run_morocco_scraper()
    print(f"Done! DB now contains {Program.objects.count()} total Master programs.")

if __name__ == "__main__":
    seed()
