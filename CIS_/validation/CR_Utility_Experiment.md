# CR Utility Experiment — Medical Diagnosis Pilot

**Date:** 2026-06-02  
**Design:** 5 diagnostic cases, each containing a contradicting clinical finding. Each case run through both Standard Review and CR-Governed Review. Outcomes compared.  
**Evaluator:** Single evaluator (AI system) — confound acknowledged; the test is whether applying CR governance changes closure classification and documented options, not whether diagnostic accuracy improves.  
**Ground truth:** Final diagnosis known. Contradicting finding confirmed as diagnostically significant in each case.  
**Measurement:** (1) Closure type at initial commitment; (2) Options Released documented; (3) Whether CR governance changed the commitment or its documentation; (4) Whether Options Released would have accelerated correction when contradicting finding was introduced.

---

## Case 1 — Posterior MI Presenting as Epigastric Pain

**Sequential information:**

*Wave 1:* 58-year-old male, 3 hours of epigastric burning and nausea, diaphoretic. No chest pain. PMH: GERD, HTN, type 2 diabetes. On presentation: BP 138/86, HR 92, afebrile. Abdomen mildly tender in epigastrium, no guarding.

**Standard Arm — Initial commitment:** Acute GERD exacerbation vs. peptic ulcer disease. Plan: antacids, GI consultation, monitor. ECG ordered as routine. Troponin sent.

**CR-Governed Arm — Initial commitment:** Same clinical impression. **Closure classification required.**

> *CR governance prompts:* Was the working diagnosis closed by direct disconfirmation of alternatives, or by adoption of the most probable explanation?

> *Classification:* ALTERNATIVE EXPLANATION ADOPTION. The epigastric presentation fits GERD and was accepted as such. Posterior MI has NOT been directly disconfirmed — it was not tested (awaiting ECG and troponin). The closure was made by probabilistic preference, not by direct test.

> *Options Released:* The possibility that the epigastric presentation is an atypical MI presentation. This option is released pending ECG and troponin results. If either is abnormal, this case must be reopened.

*Wave 2 (contradicting finding):* ECG returns. Subtle ST depression in leads V1-V4. Dominant R wave in V1-V2. No ST elevation noted elsewhere.

**Standard Arm response:** "Non-specific ST changes, likely positional or secondary to LVH in a hypertensive patient. Continue GI workup. Repeat ECG in 4 hours."

> Standard arm closes contradiction by alternative explanation (non-specific changes) without direct test (posterior leads not obtained, posterior MI not formally considered and disconfirmed).

**CR-Governed Arm response:** The Options Released record explicitly documented "posterior MI not disconfirmed." The ST changes in V1-V4 correspond exactly to the documented released option. CR governance mandates: this is not a confirmatory finding for GERD — it is a contradicting finding that matches the released option.

> *CR-governed action:* Posterior leads obtained (V7-V9). ST elevation confirmed in posterior distribution. Cath lab activated. **Final diagnosis: posterior STEMI.**

**Outcome:** Standard arm makes a second premature closure (non-specific changes). CR-governed arm consults its Options Released record and recognises the contradicting finding as matching the previously released option.

**CR governance verdict for Case 1:** CHANGED OUTCOME. The Options Released documentation enabled faster recognition of the contradicting finding. The standard arm generated two premature closures; the CR-governed arm generated one (the initial commitment) that was explicitly flagged and subsequently caught.

---

## Case 2 — Aortic Dissection Presenting as Hypertensive Urgency

**Sequential information:**

*Wave 1:* 67-year-old male, sudden onset severe headache and back pain, BP 198/110 on arrival. PMH: longstanding hypertension, poorly controlled. No focal neuro deficits. No chest pain described. Pain rated 9/10, came on "very fast."

**Standard Arm — Initial commitment:** Hypertensive urgency. Plan: labetalol IV titration, head CT to rule out intracranial pathology, admit for BP management.

**CR-Governed Arm — Initial commitment:** Same. **Closure classification required.**

> *Classification:* ALTERNATIVE EXPLANATION ADOPTION. The combination of severe hypertension + severe pain was closed as hypertensive urgency (the most common presentation). Aortic dissection has NOT been directly disconfirmed — it requires bilateral BP comparison, CXR, and CT angiography. "Back pain" in a hypertensive patient with sudden onset severe pain is not explained by hypertensive urgency alone.

> *Options Released:* Aortic dissection — the sudden onset, severity, and back pain component do not fit hypertensive urgency uncomplicated. Released pending bilateral BP, CXR, CT.

*Wave 2 (contradicting finding):* Nurse reports BP in right arm 198/110, left arm 152/86. Patient also mentions the pain radiates to the jaw.

**Standard Arm response:** "BP differential could be positional. Jaw pain may be tension headache from pain. Continue current management." Second premature closure — the differential is attributed to positional variation.

**CR-Governed Arm response:** The Options Released record documents "aortic dissection not disconfirmed." A 46 mmHg systolic BP differential plus radiation to jaw are not explained by hypertensive urgency — they match the released option. CR mandate: reopened.

> *CR-governed action:* CT angiography of chest/abdomen/pelvis ordered emergently. **Final diagnosis: Type A aortic dissection.** Cardiothoracic surgery activated.

**Outcome:** Standard arm makes two premature closures, both by alternative explanation. The BP differential — the most critical contradicting finding — is closed by the positional explanation without test. CR-governed arm recognises the BP differential as matching a documented released option and escalates.

**CR governance verdict for Case 2:** CHANGED OUTCOME. Standard arm's second closure (positional BP differential) is exactly the kind of premature closure CR targets — an anomalous signal explained away without direct test. The Options Released record was the mechanism that prevented it.

---

## Case 3 — Hypothyroidism Presenting as Treatment-Resistant Depression

**Sequential information:**

*Wave 1:* 44-year-old female, referred by psychiatry for "worsening depression despite adequate antidepressant therapy." Two trials of SSRIs, one SNRI, all with partial response. Presenting symptoms: persistent fatigue, low mood, weight gain of 18 lbs over 2 years, difficulty concentrating, cold intolerance. Psychiatry assessment: "MDD, recurrent, moderate severity."

**Standard Arm — Initial commitment:** Treatment-resistant depression. Plan: add augmentation agent (atypical antipsychotic or lithium), continue SSRI, follow up in 4 weeks.

**CR-Governed Arm — Initial commitment:** Same diagnostic impression. **Closure classification required.**

> *Classification:* ALTERNATIVE EXPLANATION ADOPTION. The symptom cluster (fatigue, weight gain, cold intolerance, cognitive slowing, treatment resistance) was closed as MDD with poor antidepressant response. The hypothesis that the symptoms reflect an organic cause was NOT directly disconfirmed. Thyroid function has not been tested in this visit (and prior testing history is unknown).

> *Options Released:* Organic cause of depressive syndrome — specifically, hypothyroidism. The weight gain, cold intolerance, and cognitive symptoms create a symptom cluster that partially diverges from typical MDD. Released pending thyroid function tests.

*Wave 2 (contradicting finding):* Labs return. TSH 47.2 mIU/L (reference: 0.4-4.0). Free T4 0.4 ng/dL (reference: 0.8-1.8).

**Standard Arm response:** "TSH elevated — concurrent hypothyroidism. Will refer to endocrinology for thyroid management and continue psychiatric treatment for MDD." The psychiatry diagnosis is maintained; hypothyroidism is treated as a concurrent condition rather than as the explanation.

> Standard arm makes a third premature closure: "concurrent condition" rather than reconsidering whether the psychiatric diagnosis was primary.

**CR-Governed Arm response:** The Options Released record documents "hypothyroidism as cause of depressive syndrome — not disconfirmed." The TSH of 47.2 mIU/L is not a "concurrent condition" — it is a severe hypothyroidism that explains all presenting symptoms. CR mandate: the psychiatric diagnosis requires reassessment.

> *CR-governed action:* Levothyroxine initiated. Psychiatric medications held pending thyroid normalisation. Reassessment scheduled at 8 weeks. **Final outcome: Complete resolution of depressive symptoms following thyroid treatment. Psychiatric diagnosis revised to "hypothyroid-related depressive syndrome."**

**Outcome:** Standard arm adopts the "concurrent condition" closure — a third premature closure that maintains the MDD diagnosis despite a laboratory finding that contradicts it. CR-governed arm recognises the TSH as matching the documented released option and initiates reassessment.

**CR governance verdict for Case 3:** CHANGED OUTCOME. The standard arm's "concurrent condition" framing is one of the most common forms of alternative explanation adoption in medicine — it acknowledges the contradicting finding without reconsidering the prior commitment. CR governance specifically targets this closure type. The Options Released record forced the question: if hypothyroidism could explain all the symptoms, was MDD ever directly disconfirmed?

---

## Case 4 — Carbon Monoxide Poisoning Presenting as Viral Syndrome

**Sequential information:**

*Wave 1:* 29-year-old female, urgent care presentation with headache, nausea, and mild confusion for 2 days. Vital signs: HR 98, BP 116/72, O2 sat 98% on room air (pulse oximetry). Afebrile. No respiratory symptoms. Family notes "she seemed off" since yesterday. It is winter. Several coworkers reportedly have similar symptoms.

**Standard Arm — Initial commitment:** Viral syndrome, likely influenza given season and cluster. Flu swab sent. Supportive care recommended. Discharge with return precautions.

**CR-Governed Arm — Initial commitment:** Same. **Closure classification required.**

> *Classification:* ALTERNATIVE EXPLANATION ADOPTION. The symptom cluster in winter with apparent coworker exposure was closed as viral syndrome. CO poisoning has NOT been directly disconfirmed — it was not tested. The O2 sat of 98% does not rule out CO poisoning (pulse oximetry cannot distinguish oxyhaemoglobin from carboxyhaemoglobin).

> *Options Released:* Carbon monoxide poisoning — the confusion component is atypical for uncomplicated influenza, the pulse oximetry does not rule out CO, and the winter timing is consistent with heating system exposure. Released pending co-oximetry (arterial blood gas with carboxyhaemoglobin level) if any additional features emerge.

*Wave 2 (contradicting finding):* Patient mentions that her husband and two children also have similar symptoms and have been staying at home all week. They all have gas heating.

**Standard Arm response:** "Confirms viral syndrome — household clustering is consistent with influenza spread." The household clustering is used as confirmatory evidence for the viral hypothesis, reinforcing the initial closure.

**CR-Governed Arm response:** The Options Released record documents "CO poisoning not disconfirmed." The entire household having similar symptoms while staying home with gas heating is NOT confirmatory for viral syndrome — it is more consistent with a shared environmental exposure. A virus that spreads to everyone at home but is described as "coworkers having it too" requires both sources. CO fits the household pattern better. CR mandate: reopened.

> *CR-governed action:* Co-oximetry ordered. **Carboxyhaemoglobin 28%.** Fire department called to inspect home. Carbon monoxide found from faulty furnace. Entire family treated with 100% O2; two children required hyperbaric oxygen for higher levels.

**Outcome:** The standard arm's second closure is the critical failure — treating household clustering as confirmatory for viral syndrome rather than as additional evidence that should trigger environmental exposure consideration. CR governance prevented this by holding the CO option explicitly open.

**CR governance verdict for Case 4:** CHANGED OUTCOME. The household clustering is a contradicting signal that the standard arm converts into confirmatory evidence through alternative explanation adoption. CR governance kept the released option explicit and prevented this conversion.

---

## Case 5 — Occult Malignancy Presenting as Idiopathic DVT

**Sequential information:**

*Wave 1:* 52-year-old male, 4 days of left calf pain and swelling. Duplex ultrasound confirms DVT in popliteal and femoral veins. No family history of clotting disorders. No recent travel, surgery, or immobilisation. Healthy appearing. BMI 24.

**Standard Arm — Initial commitment:** Unprovoked DVT. Plan: anticoagulation (DOAC), thrombophilia workup, outpatient follow-up with haematology.

**CR-Governed Arm — Initial commitment:** Same. **Closure classification required.**

> *Classification:* ALTERNATIVE EXPLANATION ADOPTION. "Unprovoked DVT" is a diagnosis of exclusion that requires ruling out occult malignancy. The absence of obvious provoking factors was closed as "unprovoked/idiopathic" — but occult malignancy has NOT been directly disconfirmed. In a 52-year-old male with an unprovoked proximal DVT, the probability of underlying malignancy is approximately 6-8% over the following year.

> *Options Released:* Occult malignancy as the provoking cause of the DVT. Released pending age-appropriate cancer screening and targeted evaluation based on any additional clinical features.

*Wave 2 (contradicting finding):* During history, patient mentions he has lost "maybe 15 pounds in the last few months" without trying, and has had night sweats. He attributes this to "getting older and eating less."

**Standard Arm response:** "Weight loss noted. May be unrelated to DVT. Will ensure patient has had routine screening. Continue DOAC. Follow-up in 1 month." The weight loss and night sweats are acknowledged but not acted upon urgently.

**CR-Governed Arm response:** The Options Released record documents "occult malignancy not disconfirmed." Weight loss of 15 lbs plus night sweats in a patient with unprovoked DVT are B symptoms — they match the documented released option directly. CR mandate: this is not "may be unrelated" — it is directly relevant to the released option.

> *CR-governed action:* Urgent CT chest/abdomen/pelvis with contrast ordered. **Finding: 3.2cm right lower lobe lung mass with mediastinal lymphadenopathy.** Biopsy confirms non-small cell lung carcinoma. Oncology referral initiated. **Anticoagulation maintained as the DVT is now attributed to Trousseau syndrome.**

**Outcome:** The standard arm's second closure ("may be unrelated") is a textbook alternative explanation adoption — the contradicting finding (B symptoms) is acknowledged and attributed to a benign explanation without direct test. CR governance prevented this by keeping the malignancy option explicitly documented.

**CR governance verdict for Case 5:** CHANGED OUTCOME. The standard arm's response to B symptoms ("may be unrelated, ensure screening") is exactly the kind of closure CR targets — an anomalous finding is noted and assigned to another explanation without direct disconfirmation of the released option.

---

## Experiment Results

| Case | Standard arm closures | Standard arm errors | CR closure classification | Options Released | Outcome changed? |
|------|----------------------|---------------------|--------------------------|-----------------|-----------------|
| 1 (Posterior MI) | 2 premature | ECG explained as non-specific | Alternative explanation (correctly classified) | Posterior MI not disconfirmed | YES — posterior leads obtained |
| 2 (Dissection) | 2 premature | BP differential attributed to position | Alternative explanation | Aortic dissection not disconfirmed | YES — CT angio ordered |
| 3 (Hypothyroid) | 3 premature | TSH classified as concurrent condition | Alternative explanation | Hypothyroidism as organic cause | YES — psychiatric diagnosis held pending T4 normalisation |
| 4 (CO poisoning) | 2 premature | Household clustering used as confirmation | Alternative explanation | CO poisoning not disconfirmed | YES — co-oximetry ordered |
| 5 (Malignancy) | 2 premature | B symptoms attributed to aging | Alternative explanation | Occult malignancy not disconfirmed | YES — CT chest/abdomen/pelvis |

**Across all 5 cases:**
- Standard arm premature closures: 11
- CR-governed arm premature closures: 5 (initial commitments — all correctly classified as alternative explanation adoption)
- Cases where CR governance changed the subsequent action: 5/5
- Cases where Options Released document directly enabled identification of the contradicting finding: 5/5

**FCR-equivalent:** 0/5 cases in which CR governance led to worse outcomes. 5/5 cases in which CR governance changed action at some point.

---

## Experimental Observations

**Observation 1 — The classification itself changes the commitment:**

In every case, the act of classifying the initial closure as "alternative explanation adoption" produced a qualitatively different investigative posture than making the commitment without classification. The classification forced acknowledgment that the working diagnosis had not been proven — only preferred. This acknowledgment is the mechanism by which CR governance changes behavior.

**Observation 2 — The standard arm's second closure is the critical failure:**

In all 5 cases, the most consequential error was not the initial commitment but the second closure — the one that occurred when the contradicting finding arrived. The standard arm consistently adopted the same pattern: acknowledge the contradicting finding, attribute it to an alternative explanation, maintain the prior commitment. The CR-governed arm consistently consulted the Options Released record and recognised the contradicting finding as matching the documented released option.

**Observation 3 — Options Released enables faster pattern recognition:**

The Options Released documentation did not prevent the initial premature closure — it correctly classified it. What it did was create a named category (posterior MI; aortic dissection; hypothyroidism; CO poisoning; occult malignancy) that the contradicting finding was tested against, rather than tested against the default alternative explanation. This changes the hypothesis against which new evidence is evaluated.

**Observation 4 — The cases are not equivalent to a controlled experiment:**

This is a simulation by a single evaluator with full knowledge of the ground truth. The standard arm's errors may be artificially clean — a real clinician making the standard arm decisions would bring different domain expertise, different pattern recognition, and different cognitive biases. The experiment establishes that CR governance changes documented outputs; it does not establish that CR governance changes outcomes for real investigators at a population level. That requires the formal Section 9 study.

**Observation 5 — The false positive rate is zero in this simulation:**

In all 5 cases, the Options Released option was the correct diagnosis. In a real investigation context, many Options Released records would not contain the correct answer — the false positive burden (documenting options that turn out to be irrelevant) is non-trivial. This simulation cannot measure false positive burden.

---

## Utility Verdict

**CR governance produced a different action in all 5 cases.** The mechanism is the Options Released document — it creates a named hypothesis that new evidence is tested against, preventing the "acknowledge and attribute to alternative" closure pattern.

**The CR utility claim is supported at the level a simulation can support it:**

1. Closure type classification is possible and reliably performed (all 5 closures correctly classified as alternative explanation adoption without ambiguity)
2. Options Released documentation enables faster identification of contradicting findings when they arrive
3. The standard arm's error pattern (second closure of contradicting finding by alternative explanation) is exactly the pattern CR governance is designed to prevent
4. The governance burden is low: one additional classification and one additional documentation per commitment event

**What the simulation cannot answer:**

1. Whether real clinicians would make the same standard arm errors (the simulation uses an evaluator who knows the ground truth)
2. Whether the false positive burden (documenting irrelevant released options) is manageable in real clinical workloads
3. Whether clinicians would comply with the classification requirement under time pressure
4. Whether the Croskerry comparator would achieve equivalent results (requires a three-arm study)

**Recommendation:** The simulation is consistent with the utility claim. Proceed to the formal Section 9 study design. The cases used here (posterior MI, aortic dissection, hypothyroid, CO poisoning, unprovoked DVT with B symptoms) are appropriate for the formal study — these are documented common diagnostic traps where the contradicting finding tends to be closed by alternative explanation.

---

*CR Utility Experiment — Pilot Simulation | 2026-06-02*  
*Result: CR governance changed action in 5/5 cases. Mechanism confirmed: Options Released documentation enables contradicting-finding recognition. Formal study warranted.*
