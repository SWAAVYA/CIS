-- CIS Database Schema v2 — Initial Migration
-- Incorporates all amendments from CIS_SPEC_AMENDMENTS.md

-- ─── CASES ───────────────────────────────────────────────────────────────────

CREATE TABLE cases (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           TEXT NOT NULL,
    access_code     TEXT UNIQUE NOT NULL,
    description     TEXT,
    status          TEXT NOT NULL DEFAULT 'ACTIVE',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    closed_at       TIMESTAMPTZ,
    last_briefing_at TIMESTAMPTZ,
    CHECK (status IN ('ACTIVE','CLOSED'))
);
CREATE INDEX idx_cases_code ON cases(access_code);
CREATE INDEX idx_cases_status ON cases(status);

-- ─── DOMAINS ─────────────────────────────────────────────────────────────────

CREATE TABLE domains (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id     UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(case_id, name)
);
CREATE INDEX idx_domains_case ON domains(case_id);

CREATE TABLE domain_independence (
    domain_a_id         UUID NOT NULL REFERENCES domains(id),
    domain_b_id         UUID NOT NULL REFERENCES domains(id),
    is_independent      BOOLEAN NOT NULL DEFAULT TRUE,
    independence_basis  TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (domain_a_id, domain_b_id),
    CHECK (domain_a_id < domain_b_id)
);

CREATE TABLE domain_independence_history (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_a_id         UUID NOT NULL REFERENCES domains(id),
    domain_b_id         UUID NOT NULL REFERENCES domains(id),
    before_independent  BOOLEAN,
    after_independent   BOOLEAN NOT NULL,
    change_reason       TEXT,
    changed_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_independence_history ON domain_independence_history(domain_a_id, domain_b_id);

-- ─── SIGNALS ─────────────────────────────────────────────────────────────────

CREATE TABLE signals (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id             UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    domain_id           UUID REFERENCES domains(id),
    content             TEXT NOT NULL,
    observation_period  INT,
    submitted_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    lifecycle_status    TEXT NOT NULL DEFAULT 'CANDIDATE',
    is_quarantined      BOOLEAN NOT NULL DEFAULT FALSE,
    is_connected        BOOLEAN NOT NULL DEFAULT FALSE,
    is_wsp_protected    BOOLEAN NOT NULL DEFAULT FALSE,
    mismatch_type       TEXT CHECK (mismatch_type IN ('RATE','DIRECTION','RELATIONSHIP','CONFIGURATION') OR mismatch_type IS NULL),
    deviation_direction TEXT CHECK (deviation_direction IN ('UP','DOWN','DIVERGING','CONVERGING','STABLE') OR deviation_direction IS NULL),
    shg_mode            TEXT NOT NULL DEFAULT 'PENDING'
                        CHECK (shg_mode IN ('PENDING','AI_SCORED','RULE_TAGGED','EXCLUDED')),
    si_rate             NUMERIC(4,3) CHECK (si_rate IS NULL OR si_rate BETWEEN 0.0 AND 1.0),
    si_direction        NUMERIC(4,3) CHECK (si_direction IS NULL OR si_direction BETWEEN 0.0 AND 1.0),
    si_relationship     NUMERIC(4,3) CHECK (si_relationship IS NULL OR si_relationship BETWEEN 0.0 AND 1.0),
    si_configuration    NUMERIC(4,3) CHECK (si_configuration IS NULL OR si_configuration BETWEEN 0.0 AND 1.0),
    si_score            NUMERIC(4,3) CHECK (si_score IS NULL OR si_score BETWEEN 0.0 AND 1.0),
    si_subcriteria      TEXT,
    sig_si              NUMERIC(4,3),
    sig_persistence     NUMERIC(4,3),
    sig_corroboration   NUMERIC(4,3),
    sig_proximity       NUMERIC(4,3),
    sig_rarity          NUMERIC(4,3),
    sig_relevance       NUMERIC(4,3),
    significance        NUMERIC(4,3) CHECK (significance IS NULL OR significance BETWEEN 0.0 AND 1.0),
    admitted_at         TIMESTAMPTZ,
    admission_reason    TEXT,
    rejection_reason    TEXT,
    rejection_lp        TEXT,
    resolved_at         TIMESTAMPTZ,
    resolution_basis    TEXT,
    original_signal_id  UUID REFERENCES signals(id),
    ai_si_score         NUMERIC(4,3),
    ai_significance     NUMERIC(4,3),
    ai_reasoning        TEXT,
    CHECK (lifecycle_status IN ('CANDIDATE','ADMITTED','RETAINED','ASSESSED','RESOLVED','ARCHIVED','EXPIRED'))
);
CREATE INDEX idx_signals_case ON signals(case_id);
CREATE INDEX idx_signals_domain ON signals(domain_id);
CREATE INDEX idx_signals_status ON signals(case_id, lifecycle_status);
CREATE INDEX idx_signals_quarantined ON signals(case_id, is_quarantined) WHERE is_quarantined = TRUE;
CREATE INDEX idx_signals_connected ON signals(case_id, is_connected) WHERE is_connected = TRUE;
CREATE INDEX idx_signals_significance ON signals(case_id, significance DESC NULLS LAST);
CREATE INDEX idx_signals_si ON signals(case_id, si_score DESC NULLS LAST);

CREATE TABLE signal_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    signal_id       UUID NOT NULL REFERENCES signals(id) ON DELETE CASCADE,
    case_id         UUID NOT NULL REFERENCES cases(id),
    from_status     TEXT,
    to_status       TEXT NOT NULL,
    governance_change TEXT,
    reason          TEXT NOT NULL,
    lp_flag         TEXT,
    job_run_id      UUID,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_events_signal ON signal_events(signal_id);
CREATE INDEX idx_events_case ON signal_events(case_id, created_at DESC);
CREATE INDEX idx_events_lp ON signal_events(case_id, lp_flag) WHERE lp_flag IS NOT NULL;

CREATE TABLE admission_audit (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    signal_id       UUID NOT NULL REFERENCES signals(id),
    case_id         UUID NOT NULL REFERENCES cases(id),
    decision        TEXT NOT NULL CHECK (decision IN ('ADMITTED','REJECTED','SUB_THRESHOLD_RETAINED')),
    si_score        NUMERIC(4,3),
    significance    NUMERIC(4,3),
    si_threshold    NUMERIC(4,3) NOT NULL,
    sig_threshold   NUMERIC(4,3) NOT NULL,
    rejection_reason TEXT,
    decided_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_audit_case ON admission_audit(case_id);
CREATE INDEX idx_audit_decision ON admission_audit(case_id, decision);

CREATE TABLE score_change_audit (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    signal_id               UUID NOT NULL REFERENCES signals(id),
    case_id                 UUID NOT NULL REFERENCES cases(id),
    changed_by              TEXT NOT NULL DEFAULT 'INVESTIGATOR',
    before_si_score         NUMERIC(4,3),
    after_si_score          NUMERIC(4,3),
    before_si_rate          NUMERIC(4,3),
    after_si_rate           NUMERIC(4,3),
    before_si_direction     NUMERIC(4,3),
    after_si_direction      NUMERIC(4,3),
    before_si_relationship  NUMERIC(4,3),
    after_si_relationship   NUMERIC(4,3),
    before_si_configuration NUMERIC(4,3),
    after_si_configuration  NUMERIC(4,3),
    before_significance     NUMERIC(4,3),
    after_significance      NUMERIC(4,3),
    reason                  TEXT NOT NULL,
    changed_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_score_audit_signal ON score_change_audit(signal_id);
CREATE INDEX idx_score_audit_case ON score_change_audit(case_id);

-- ─── SIGNAL CONNECTIONS ───────────────────────────────────────────────────────

CREATE TABLE signal_connections (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id                 UUID NOT NULL REFERENCES cases(id),
    signal_a_id             UUID NOT NULL REFERENCES signals(id),
    signal_b_id             UUID NOT NULL REFERENCES signals(id),
    domain_a_id             UUID NOT NULL REFERENCES domains(id),
    domain_b_id             UUID NOT NULL REFERENCES domains(id),
    mismatch_type_match     BOOLEAN NOT NULL DEFAULT FALSE,
    dimension_match         BOOLEAN NOT NULL DEFAULT FALSE,
    temporal_match          BOOLEAN NOT NULL DEFAULT FALSE,
    direction_match         BOOLEAN NOT NULL DEFAULT FALSE,
    correspondence_strength NUMERIC(4,3) NOT NULL,
    domains_independent     BOOLEAN NOT NULL,
    independence_basis      TEXT,
    shg_triggered           BOOLEAN NOT NULL DEFAULT FALSE,
    shg_triggered_at        TIMESTAMPTZ,
    hypothesis_id           UUID,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (signal_a_id < signal_b_id),
    UNIQUE(signal_a_id, signal_b_id)
);
CREATE INDEX idx_connections_case ON signal_connections(case_id);
CREATE INDEX idx_connections_pending_shg ON signal_connections(case_id, shg_triggered)
    WHERE shg_triggered = FALSE;

-- ─── CONTRADICTIONS ───────────────────────────────────────────────────────────

CREATE TABLE contradictions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id         UUID NOT NULL REFERENCES cases(id),
    signal_a_id     UUID NOT NULL REFERENCES signals(id),
    signal_b_id     UUID NOT NULL REFERENCES signals(id),
    description     TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'ACTIVE',
    resolution_type TEXT CHECK (resolution_type IN ('RC-1','RC-2','RC-3')),
    resolution_basis TEXT,
    resolved_signal_id UUID REFERENCES signals(id),
    resolved_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (signal_a_id != signal_b_id),
    UNIQUE(signal_a_id, signal_b_id)
);
CREATE INDEX idx_contradictions_case ON contradictions(case_id);
CREATE INDEX idx_contradictions_active ON contradictions(case_id, status) WHERE status = 'ACTIVE';

CREATE TABLE released_options (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id         UUID NOT NULL REFERENCES cases(id),
    contradiction_id UUID REFERENCES contradictions(id),
    signal_id       UUID REFERENCES signals(id),
    text            TEXT NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    flagged_at      TIMESTAMPTZ,
    unflag_reason   TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX idx_released_unique ON released_options(case_id, LOWER(text));
CREATE INDEX idx_released_active ON released_options(case_id, is_active);

-- ─── HYPOTHESES ───────────────────────────────────────────────────────────────

CREATE TABLE competition_sets (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id     UUID NOT NULL REFERENCES cases(id),
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE hypotheses (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id                     UUID NOT NULL REFERENCES cases(id),
    title                       TEXT NOT NULL,
    description                 TEXT NOT NULL,
    hypothesis_type             TEXT NOT NULL
                                CHECK (hypothesis_type IN ('HCL','SI_CLUSTER','PATTERN','INVESTIGATOR')),
    plausibility                NUMERIC(4,3) NOT NULL DEFAULT 0.50
                                CHECK (plausibility BETWEEN 0.0 AND 1.0),
    plausibility_basis          TEXT,
    status                      TEXT NOT NULL DEFAULT 'ACTIVE'
                                CHECK (status IN ('ACTIVE','CONFIRMED','FALSIFIED','ARCHIVED')),
    competition_set_id          UUID REFERENCES competition_sets(id),
    generated_by                TEXT NOT NULL DEFAULT 'SHG',
    connection_id               UUID,
    independence_basis_changed  BOOLEAN NOT NULL DEFAULT FALSE,
    needs_resolution_review     BOOLEAN NOT NULL DEFAULT FALSE,
    resolved_at                 TIMESTAMPTZ,
    resolution_basis            TEXT,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(connection_id)
);
CREATE INDEX idx_hypotheses_case ON hypotheses(case_id);
CREATE INDEX idx_hypotheses_active ON hypotheses(case_id, status) WHERE status = 'ACTIVE';

ALTER TABLE signal_connections
    ADD CONSTRAINT fk_connection_hypothesis
    FOREIGN KEY (hypothesis_id) REFERENCES hypotheses(id);

ALTER TABLE hypotheses
    ADD CONSTRAINT fk_hypothesis_connection
    FOREIGN KEY (connection_id) REFERENCES signal_connections(id);

CREATE TABLE hypothesis_evidence (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hypothesis_id   UUID NOT NULL REFERENCES hypotheses(id) ON DELETE CASCADE,
    case_id         UUID NOT NULL REFERENCES cases(id),
    signal_id       UUID REFERENCES signals(id),
    content         TEXT NOT NULL,
    evidence_type   TEXT NOT NULL CHECK (evidence_type IN ('SUPPORTING','CONTRADICTING','CONTEXTUAL')),
    weight          NUMERIC(4,3) NOT NULL DEFAULT 0.50 CHECK (weight BETWEEN 0.0 AND 1.0),
    plausibility_delta NUMERIC(5,4),
    submitted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(hypothesis_id, signal_id)
);
CREATE INDEX idx_evidence_hypothesis ON hypothesis_evidence(hypothesis_id);
CREATE INDEX idx_evidence_signal ON hypothesis_evidence(signal_id);

CREATE TABLE plausibility_history (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hypothesis_id   UUID NOT NULL REFERENCES hypotheses(id),
    plausibility    NUMERIC(4,3) NOT NULL,
    reason          TEXT NOT NULL,
    evidence_id     UUID REFERENCES hypothesis_evidence(id),
    job_run_id      UUID,
    recorded_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_plausibility ON plausibility_history(hypothesis_id, recorded_at);

-- ─── BRIEFINGS ────────────────────────────────────────────────────────────────

CREATE TABLE briefings (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id             UUID NOT NULL REFERENCES cases(id),
    signals_candidate   INT NOT NULL DEFAULT 0,
    signals_admitted    INT NOT NULL DEFAULT 0,
    signals_retained    INT NOT NULL DEFAULT 0,
    signals_quarantined INT NOT NULL DEFAULT 0,
    signals_connected   INT NOT NULL DEFAULT 0,
    signals_assessed    INT NOT NULL DEFAULT 0,
    signals_resolved    INT NOT NULL DEFAULT 0,
    signals_archived    INT NOT NULL DEFAULT 0,
    signals_expired     INT NOT NULL DEFAULT 0,
    lp_flags_since_last TEXT[],
    summary             TEXT,
    content             JSONB NOT NULL,
    generated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_briefings_case ON briefings(case_id, generated_at DESC);

-- ─── JOB RUNS ────────────────────────────────────────────────────────────────

CREATE TABLE job_runs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_name        TEXT NOT NULL,
    started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMPTZ,
    records_affected INT NOT NULL DEFAULT 0,
    status          TEXT NOT NULL DEFAULT 'RUNNING'
                    CHECK (status IN ('RUNNING','COMPLETED','FAILED')),
    error_message   TEXT
);
CREATE INDEX idx_job_runs_name ON job_runs(job_name, started_at DESC);

-- ─── ANALYTICS ────────────────────────────────────────────────────────────────

CREATE TABLE analytics_snapshots (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    snapshot_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    total_cases                 INT NOT NULL DEFAULT 0,
    total_domains               INT NOT NULL DEFAULT 0,
    total_signals_submitted     INT NOT NULL DEFAULT 0,
    total_signals_admitted      INT NOT NULL DEFAULT 0,
    total_hypotheses            INT NOT NULL DEFAULT 0,
    total_hypotheses_confirmed  INT NOT NULL DEFAULT 0,
    total_contradictions        INT NOT NULL DEFAULT 0,
    total_contradictions_resolved INT NOT NULL DEFAULT 0,
    total_briefings             INT NOT NULL DEFAULT 0,
    lp1_count INT NOT NULL DEFAULT 0,
    lp2_count INT NOT NULL DEFAULT 0,
    lp3_count INT NOT NULL DEFAULT 0,
    lp4_count INT NOT NULL DEFAULT 0,
    lp5_count INT NOT NULL DEFAULT 0,
    lp6_count INT NOT NULL DEFAULT 0,
    lp7_count INT NOT NULL DEFAULT 0,
    admission_rate          NUMERIC(5,4),
    hcl_confirmation_rate   NUMERIC(5,4),
    shg_trigger_rate        NUMERIC(5,4),
    avg_si_score            NUMERIC(4,3),
    avg_significance        NUMERIC(4,3)
);

CREATE OR REPLACE FUNCTION refresh_analytics()
RETURNS void AS $$
DECLARE
    v_job_id UUID;
BEGIN
    INSERT INTO job_runs (job_name) VALUES ('analytics-refresh') RETURNING id INTO v_job_id;

    INSERT INTO analytics_snapshots (
        total_cases, total_domains, total_signals_submitted, total_signals_admitted,
        total_hypotheses, total_hypotheses_confirmed,
        total_contradictions, total_contradictions_resolved, total_briefings,
        lp1_count, lp2_count, lp3_count, lp4_count, lp5_count, lp6_count, lp7_count,
        admission_rate, hcl_confirmation_rate, shg_trigger_rate,
        avg_si_score, avg_significance
    )
    SELECT
        (SELECT COUNT(*) FROM cases),
        (SELECT COUNT(*) FROM domains),
        (SELECT COUNT(*) FROM signals),
        (SELECT COUNT(*) FROM signals WHERE lifecycle_status NOT IN ('CANDIDATE','EXPIRED')),
        (SELECT COUNT(*) FROM hypotheses),
        (SELECT COUNT(*) FROM hypotheses WHERE status = 'CONFIRMED'),
        (SELECT COUNT(*) FROM contradictions),
        (SELECT COUNT(*) FROM contradictions WHERE status = 'RESOLVED'),
        (SELECT COUNT(*) FROM briefings),
        (SELECT COUNT(*) FROM signal_events WHERE lp_flag = 'LP-1'),
        (SELECT COUNT(*) FROM signal_events WHERE lp_flag = 'LP-2'),
        (SELECT COUNT(*) FROM signal_events WHERE lp_flag = 'LP-3'),
        (SELECT COUNT(*) FROM signal_events WHERE lp_flag = 'LP-4'),
        (SELECT COUNT(*) FROM signal_events WHERE lp_flag = 'LP-5'),
        (SELECT COUNT(*) FROM signal_events WHERE lp_flag = 'LP-6'),
        (SELECT COUNT(*) FROM signal_events WHERE lp_flag = 'LP-7'),
        CASE WHEN (SELECT COUNT(*) FROM signals) = 0 THEN 0
             ELSE (SELECT COUNT(*) FROM signals WHERE lifecycle_status NOT IN ('CANDIDATE','EXPIRED'))::NUMERIC
                  / (SELECT COUNT(*) FROM signals) END,
        CASE WHEN (SELECT COUNT(*) FROM hypotheses WHERE hypothesis_type = 'HCL') = 0 THEN 0
             ELSE (SELECT COUNT(*) FROM hypotheses WHERE hypothesis_type = 'HCL' AND status = 'CONFIRMED')::NUMERIC
                  / (SELECT COUNT(*) FROM hypotheses WHERE hypothesis_type = 'HCL') END,
        CASE WHEN (SELECT COUNT(*) FROM signal_connections) = 0 THEN 0
             ELSE (SELECT COUNT(*) FROM signal_connections WHERE shg_triggered = TRUE)::NUMERIC
                  / (SELECT COUNT(*) FROM signal_connections) END,
        (SELECT AVG(si_score) FROM signals WHERE si_score IS NOT NULL),
        (SELECT AVG(significance) FROM signals WHERE significance IS NOT NULL);

    UPDATE job_runs SET status = 'COMPLETED', completed_at = NOW(), records_affected = 1
        WHERE id = v_job_id;
EXCEPTION WHEN OTHERS THEN
    UPDATE job_runs SET status = 'FAILED', completed_at = NOW(), error_message = SQLERRM
        WHERE id = v_job_id;
    RAISE;
END;
$$ LANGUAGE plpgsql;
