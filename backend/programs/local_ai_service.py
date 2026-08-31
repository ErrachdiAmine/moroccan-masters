import urllib.request
import urllib.parse
import json
import re

OMNIROUTE_URL = "http://localhost:20128/v1/chat/completions"
OMNIROUTE_API_KEY = "sk-ab88b368f9f17068-b66fb2-664ebfc2"
OMNIROUTE_MODEL = "Alucard"

def query_omniroute_alucard(system_prompt, user_prompt):
    payload = {
        "model": OMNIROUTE_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.7
    }
    try:
        req = urllib.request.Request(
            OMNIROUTE_URL,
            headers={
                "Authorization": f"Bearer {OMNIROUTE_API_KEY}",
                "Content-Type": "application/json"
            },
            data=json.dumps(payload).encode('utf-8')
        )
        res = urllib.request.urlopen(req, timeout=25)
        data = json.loads(res.read().decode('utf-8'))
        return data['choices'][0]['message']['content'].strip()
    except Exception as e:
        print(f"[Omniroute Alucard Error]: {e}")
        return None

def ai_chat_assistant(user_message):
    system_prompt = (
        "You are Alucard, an elite AI Academic Advisor specializing in Moroccan Master's degree opportunities "
        "for English Studies graduates (Applied Linguistics, Cultural Studies, TEFL/ELT, Translation, Gender Studies, Media). "
        "Provide direct, concise, practical guidance regarding preselection requirements, S1-S6 score formulas, written exam topics, "
        "and legalized document checklists for Moroccan faculties (FLSH Rabat, FLSH Ain Chock Casablanca, FLSH Marrakech, USMBA Fez, etc.)."
    )
    
    # Try Omniroute Alucard first
    resp = query_omniroute_alucard(system_prompt, user_message)
    if resp:
        return resp
        
    # Local fallback
    msg_lower = user_message.lower()
    if "formula" in msg_lower or "score" in msg_lower or "calcul" in msg_lower:
        return ("Pre-selection score formula commonly used across Moroccan faculties:\n\n"
                "S = [(M_S1 + M_S2 + M_S3 + M_S4 + M_S5 + M_S6) / 6] + (Mentions * 0.5) - (Retakes * 1.0)\n\n"
                "• Minimum threshold for pre-selection usually ranges between 12.00/20 and 13.50/20.")
    elif "sop" in msg_lower or "letter" in msg_lower or "lettre" in msg_lower:
        return ("Key components for a winning Statement of Purpose (SOP):\n\n"
                "1. Academic background in English Studies\n"
                "2. Specific research interest (e.g. TEFL Methodologies, Sociolinguistics)\n"
                "3. Why this specific faculty/master program fits your goals\n"
                "4. Future research/career aspirations.")
    else:
        return f"Regarding your question ('{user_message}'): Entrance to Moroccan English Master's programs requires a Licence en Études Anglaises (or DEUG + 1 year), strong S1-S6 grades, and clearing a written exam and oral jury interview."

def ai_generate_sop(candidate_name, program_title, university, research_interest):
    system_prompt = (
        "You are Alucard, an expert academic advisor. Write a professional, compelling 4-paragraph Statement of Purpose (SOP) "
        "in English for a Moroccan student applying to a Master program."
    )
    user_prompt = (
        f"Candidate Name: {candidate_name or 'Applicant'}\n"
        f"Target Master Program: {program_title}\n"
        f"University / Faculty: {university}\n"
        f"Primary Research Focus: {research_interest}\n\n"
        "Generate a formal 4-paragraph SOP suitable for university admission in Morocco."
    )
    
    # Try Omniroute Alucard first
    sop_text = query_omniroute_alucard(system_prompt, user_prompt)
    if sop_text:
        return sop_text
        
    # Fallback template
    c_name = candidate_name if candidate_name else "Applicant"
    p_title = program_title if program_title else "Master in Applied Linguistics & ELT"
    uni = university if university else "FLSH Rabat / UM5"
    focus = research_interest if research_interest else "Applied Linguistics and TEFL Pedagogy"

    return f"""Dear Members of the Admissions Committee,

I am writing to express my strong interest in applying for the {p_title} at {uni}. Having completed my Bachelor’s degree in English Studies (Licence en Études Anglaises), I have developed a deep passion for {focus}.

Throughout my undergraduate coursework, I maintained academic rigor across core modules including Linguistics, Discourse Analysis, and Research Methodology. My academic trajectory has equipped me with the analytical mindset necessary for advanced postgraduate research.

My primary research interest lies in {focus}. The specialized curriculum offered by {uni} provides the ideal academic environment for me to deepen my knowledge, collaborate with esteemed faculty members, and contribute to contemporary scholarly discourse in Morocco.

Upon completion of this Master's degree, I intend to pursue doctoral research and contribute to academic and professional development in language education and research. Thank you for considering my application.

Sincerely,
{c_name}"""

def ai_evaluate_eligibility(gpa, mentions, retakes, program_title, university):
    try:
        gpa = float(gpa)
        mentions = int(mentions)
        retakes = int(retakes)
    except (ValueError, TypeError):
        gpa = 12.0
        mentions = 0
        retakes = 0

    calculated_score = round(gpa + (mentions * 0.5) - (retakes * 1.0), 2)
    
    # Try querying Omniroute Alucard for a personalized evaluation summary
    system_prompt = "You are Alucard, an academic admissions advisor for Moroccan Master's programs."
    user_prompt = (
        f"Evaluate admission odds for candidate with S1-S6 GPA: {gpa}/20, Mentions: {mentions}, Retake Years: {retakes}. "
        f"Target Master: {program_title} at {university}. "
        f"Calculated Score: {calculated_score}/20. Provide a 2-sentence concise summary."
    )
    
    summary = query_omniroute_alucard(system_prompt, user_prompt)
    
    if calculated_score >= 14.0:
        status = "HIGH PROBABILITY (Favorable Pre-selection)"
        color = "emerald"
        if not summary:
            summary = f"With an estimated pre-selection score of {calculated_score}/20, your profile is competitive for shortlisting at {university}."
    elif calculated_score >= 12.0:
        status = "MEDIUM PROBABILITY (Target Written Exam Preparation)"
        color = "amber"
        if not summary:
            summary = f"With a score of {calculated_score}/20, you stand a solid chance of pre-selection. Focus heavily on preparing for the written concours exam."
    else:
        status = "LOW / BORDERLINE PROBABILITY (Backup Programs Recommended)"
        color = "rose"
        if not summary:
            summary = f"Your calculated score ({calculated_score}/20) is near the threshold. We recommend applying to multiple universities to maximize admission chances."

    return {
        "calculated_score": calculated_score,
        "eligibility_status": status,
        "badge_color": color,
        "summary": summary,
        "model_used": "Omniroute Alucard (Local AI)"
    }
