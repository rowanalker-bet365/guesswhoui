Hackathon Solution Document — Guess Who: Identity Under Fire
1) Overview

Students build a small app (CLI or simple UI) that repeatedly solves a “Guess Who” round by identifying a hidden target from a randomly generated board.

Each round is a fresh API session with:

    64 candidates (the “board”)
    64 trait questions available to ask about the hidden target
    Some answers returned as encrypted payloads
    Some endpoints behaving flakily (scheduled/probabilistic) to reward resilience

Teams are encouraged to automate after their first successful solve and compete on speed and number of successful rounds over the day.
2) Participant Objective (what they build)

A program that can:

    Start a new round (session)
    Load the candidate board (64 generated candidates + trait cards)
    Ask trait questions about the hidden target
    Handle encrypted answers via a decode endpoint
    Maintain an elimination set locally and choose the next question
    Submit a final guess
    Repeat (automation loop) to maximize solves/hour and minimize time/questions

3) Game Rules (per session)

    The board contains 64 fictional/generated candidates (no real student data).
    Teams can ask any of the 64 trait questions. Each question returns the target’s trait answer (sometimes encrypted).
    Teams eliminate candidates locally using the returned answer.
    Guess submissions are limited per session (recommended: 1 guess; optionally allow up to 3 with heavy penalty).
    Rate limits apply to discourage brute force (see section 8).

4) Milestones (reward partial progress)

Milestones can be awarded automatically from API telemetry (recommended) and/or manually.

    M1 — First Round Started: create session + download board
    M2 — First Successful Question: ask one trait and display/use answer
    M3 — Elimination Working: reduce candidate set based on answers
    M4 — First Correct Solve: submit correct guess
    M5 — Encrypted Answer Handled: decode at least one encrypted answer and apply it

Stretch milestones

    S1 — Efficiency: solve with ≤ N questions (e.g., 8–10)
    S2 — Automation: ≥ 5 consecutive successful solves within a X minute period
    S3 — Resilience: continue progress during a failure window (e.g., 5 valid answers during chaos)

5) Scoring (supports “many solves over the day”)

Example model (tune as desired):

    Milestone: +1000
    Stretch Milestone: +2000
    Correct solve: +500
    Time bonus: timeBonus(t is elapsedSeconds) = max(0, 120 - t)
    Question efficiency: qBonus = max(0, 300 - 20*questionsAsked)
    Reliability penalty: reliabilityPenalty(400 api returns): -50
    Automation penalty: 10xfailed sessions = -100
    Wrong guess (if allowed): −200 (session ends after 3rd incorrect guess)

Leaderboard fields (recommended)

    totalScore, solves, bestSolveTime, avgQuestions, successRate, bestStreak

6) Session Randomization (repeatable + fair)

    Each session creates a fresh board and a new hidden target.
    Server creates sessionId and internal seed.
    Use the seed to generate:
        64 candidates with trait values
        a unique hidden target candidateId
        a chaos/failure profile
    Return the candidate cards to the client (so elimination is done locally).

Fairness controls

    Avoid identical/near-identical trait vectors (regen collisions).
    Keep trait distributions meaningful (avoid traits that are always true/false).

7) Trait Catalogue (64 traits)

Each trait corresponds to a question teams can ask about the hidden target. Candidate cards include trait values so teams can eliminate locally.

Legend: Type = boolean / enum / numeric-range; Tier = Basic / Encrypted / Flaky (can overlap); Cost = for optional scoring/budgeting.
A) Appearance (12)
T01	hair_color	Hair color?	enum	black,brown,blonde,red	Basic	1
T02	hair_length	Hair length?	enum	short,medium,long	Basic	1
T03	eye_color	Eye color?	enum	brown,blue,green,gray	Basic	1
T04	wears_glasses	Wearing glasses?	boolean	true/false	Basic	1
T05	has_beard	Has beard?	boolean	true/false	Basic	1
T06	has_moustache	Has moustache?	boolean	true/false	Basic	1
T07	has_freckles	Has freckles?	boolean	true/false	Basic	1
T08	has_dimples	Has dimples?	boolean	true/false	Basic	1
T09	skin_tone	Skin tone category?	enum	A,B,C,D (abstract)	Basic	1
T10	face_shape	Face shape?	enum	oval,round,square,heart	Basic	1
T11	eyebrow_style	Eyebrow style?	enum	straight,arched,thick,thin	Basic	1
T12	smile	Smiling in photo?	boolean	true/false	Basic	1
B) Clothing (10)
T13	top_color	Top color?	enum	black,white,blue,green,red,gray	Basic	1
T14	wears_hoodie	Wearing hoodie?	boolean	true/false	Basic	1
T15	wears_jacket	Wearing jacket?	boolean	true/false	Basic	1
T16	wears_shirt_collar	Collar visible?	boolean	true/false	Basic	1
T17	bottom_type	Bottom type?	enum	jeans,chinos,shorts,skirt	Basic	1
T18	shoe_type	Shoe type?	enum	trainers,boots,formal,sandals	Basic	1
T19	hat_type	Wearing a hat?	enum	none,cap,beanie	Basic	1
T20	pattern	Clothing pattern?	enum	plain,striped,checked	Basic	1
T21	primary_style	Style?	enum	casual,sporty,smart,alt	Basic	1
T22	wears_uniform	Wearing uniform?	boolean	true/false	Basic	1
C) Accessories (8)
T23	wears_watch	Wearing watch?	boolean	true/false	Basic	1
T24	wears_ring	Wearing ring?	boolean	true/false	Basic	1
T25	wears_necklace	Wearing necklace?	boolean	true/false	Basic	1
T26	wears_earrings	Wearing earrings?	boolean	true/false	Basic	1
T27	carries_backpack	Has backpack?	boolean	true/false	Basic	1
T28	carries_laptop	Has laptop?	boolean	true/false	Basic	1
T29	phone_os	Phone OS?	enum	iOS,Android,other	Encrypted	2
T30	headphone_type	Headphones?	enum	none,in_ear,over_ear	Basic	1
D) University / Academic (12)
T31	year_group	Year group?	enum	1,2,3,4	Basic	1
T32	faculty	Faculty?	enum	Eng,Sci,Biz,Arts	Basic	1
T33	timetable_morning	Has morning class today?	boolean	true/false	Basic	1
T34	lab_user	Has a lab module?	boolean	true/false	Basic	1
T35	group_project	In a group project?	boolean	true/false	Basic	1
T36	preferred_editor	Preferred editor?	enum	VSCode,IntelliJ,Vim,Other	Encrypted	2
T37	os_primary	Primary OS?	enum	Windows,macOS,Linux	Encrypted	2
T38	attends_society	In a society?	boolean	true/false	Basic	1
T39	commute_type	Commute type?	enum	walk,bike,bus,train,car	Basic	1
T40	library_frequency	Library use?	enum	low,medium,high	Basic	1
T41	caffeine	Drinks caffeine?	boolean	true/false	Basic	1
T42	part_time_job	Has part-time job?	boolean	true/false	Basic	1
E) Tech Preferences / Habits (8)
T43	favorite_language	Favorite language?	enum	Python,JS,Java,C#,Other	Encrypted	2
T44	git_user	Uses git daily?	boolean	true/false	Basic	1
T45	cloud_interest	Interested in cloud?	boolean	true/false	Basic	1
T46	ai_interest	Interested in AI?	boolean	true/false	Basic	1
T47	gaming	Plays games weekly?	boolean	true/false	Basic	1
T48	keyboard_layout	Keyboard layout?	enum	QWERTY,AZERTY,Other	Encrypted	2
T49	two_factor	Uses 2FA?	boolean	true/false	Flaky	3
T50	password_manager	Uses password manager?	boolean	true/false	Flaky	3
F) Lifestyle / Preferences (10)
T51	sport	Plays a sport?	boolean	true/false	Basic	1
T52	music_genre	Music genre?	enum	pop,rock,hiphop,jazz,edm,other	Basic	1
T53	food_pref	Food preference?	enum	veg,nonveg,vegan,other	Basic	1
T54	sleep_pattern	Sleep pattern?	enum	early,normal,nightowl	Basic	1
T55	pet_person	Likes pets?	boolean	true/false	Basic	1
T56	coffee_order	Coffee order?	enum	latte,americano,tea,none	Encrypted	2
T57	weekend_style	Weekend style?	enum	chill,study,outdoors,work	Basic	1
T58	travel	Traveled this year?	boolean	true/false	Basic	1
T59	reading	Reads books monthly?	boolean	true/false	Basic	1
T60	social_media	Uses social daily?	boolean	true/false	Basic	1
G) Security / Verification (4) — designed to be flaky

These traits explicitly drive resilience/error-handling and can depend on an intentionally flaky upstream.
T61	training_provider	Training provider?	enum	A,B,C,D	Flaky + Encrypted	4
T62	id_verified	Identity verified?	boolean	true/false	Flaky	4
T63	eligibility	Eligible for withdrawal?	boolean	true/false	Flaky	4
T64	risk_band	Risk band?	enum	low,medium,high	Flaky + Encrypted	4
8) API Specification (minimal but complete)
Authentication

    Header: X-Team-Id: <provided_on_the_day>
    Optional: X-Api-Key: <provided_on_the_day>

Rate limits (recommended)

    /v1/sessions/start: 10/min/team
    /v1/sessions/{sessionId}/ask: 5 req/sec/team burst, 60 req/min/team
    /v1/sessions/{sessionId}/guess: 1 per session (or max 3/session with penalties)

Endpoints
8.1 Start a session

POST /v1/sessions/start
{ "boardSize": 64, "difficulty": "standard" }

Response
{ "sessionId": "s_2f1c...", "boardSize": 64, "traitsAvailable": 64, "guessLimit": 1, "chaosProfile": { "mode": "scheduled", "windowSeconds": 90 } }
8.2 Fetch the board (candidate “cards”)

GET /v1/sessions/{sessionId}/board
{ "sessionId": "s_2f1c...", "candidates": [ { "candidateId": "c_001", "displayName": "Candidate 001", "traits": { "hair_color": "brown", "wears_glasses": true, "year_group": 2 } } ], "traitDefinitions": [ { "traitKey": "hair_color", "type": "enum", "values": ["black","brown","blonde","red"] } ] }
8.3 List questions (optional)

GET /v1/sessions/{sessionId}/questions
{ "questions": [ { "questionId": "T01", "traitKey": "hair_color", "type": "enum", "cost": 1, "tier": "basic" }, { "questionId": "T43", "traitKey": "favorite_language", "type": "enum", "cost": 2, "tier": "encrypted" } ] }
8.4 Ask a question about the target

POST /v1/sessions/{sessionId}/ask
{ "questionId": "T04" }

Plain response
{ "questionId": "T04", "traitKey": "wears_glasses", "answer": true }

Encrypted response
{ "questionId": "T43", "traitKey": "favorite_language", "encrypted": "b64:UEFZTE9BRDo6SlM=", "cipher": "base64", "keyHintId": "hint_1" }

Flaky/degraded response (example)
{ "questionId": "T61", "traitKey": "training_provider", "status": "degraded", "retryAfterMs": 800 }
8.5 Decode encrypted answers

POST /v1/decode
{ "sessionId": "s_2f1c...", "cipher": "base64", "encrypted": "b64:UEFZTE9BRDo6SlM=", "keyHintId": "hint_1" }

Response
{ "decoded": "JS", "quality": "good" }
8.6 Submit final guess

POST /v1/sessions/{sessionId}/guess
{ "candidateId": "c_017", "evidence": [ { "questionId": "T04", "observedAnswer": true }, { "questionId": "T01", "observedAnswer": "brown" } ] }

Response
{ "correct": true, "score": 1320, "breakdown": { "base": 1000, "timeBonus": 220, "questionBonus": 140, "reliabilityPenalty": 40 }, "stats": { "timeSeconds": 380, "questionsAsked": 8, "failedRequests": 6 } }
8.7 Leaderboard

GET /v1/leaderboard
{ "entries": [ { "teamId": "team7", "solves": 18, "avgTimeSeconds": 210, "avgQuestions": 7.2, "score": 22150 } ] }
9) Failure Injection (“Scheduled disasters”)

To keep it fair, chaos should be tied to session start time.

Recommended model

    Each session has a repeating chaos window every X minutes (e.g., every 4 minutes) lasting Y seconds (e.g., 60–90s).
    During chaos:
        /ask for traits marked Flaky has elevated failure rate (timeouts/503)
        Occasional malformed-but-parseable payloads (missing optional fields, nulls)
        Optional: increased latency

Important: do not return incorrect trait answers as “truth”. If simulating bad data, do it via explicit status: degraded and require retry.
10) Implementation Notes (for organisers)

    Candidate generation:
        Avoid duplicate/near-duplicate trait vectors (regen collisions)
        Keep trait distributions balanced enough to be useful
    Telemetry for scoring:
        questions asked, failures, decode calls, time to solve
    Keep payloads small and consistent; the challenge should be logic + resilience, not heavy parsing.

11) What “good” student solutions look like
Beginner

    Start → board → ask basics → decode once → guess

Intermediate

    Maintains elimination set + automatically chooses next question that best splits remaining candidates

Advanced

    Full automation loop across many sessions
    Robust retry/backoff + timeouts + circuit breaker
    Minimizes cost/questions and maximizes solves/hour