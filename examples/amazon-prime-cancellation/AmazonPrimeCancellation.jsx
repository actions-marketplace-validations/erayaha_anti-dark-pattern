/**
 * DARK PATTERN CASE #1: Amazon Prime "Iliad Flow" Cancellation
 * ─────────────────────────────────────────────────────────────
 * Legal Action  : FTC v. Amazon.com, Inc. (2023) → $2.5B settlement (Sep 2025)
 * Pattern Types : confirm-shaming, roach-motel, misdirection, forced-continuity
 * Source        : FTC Complaint — CIV-23-0932 | ftc.gov/news-events/news/press-releases/2023/06
 *
 * Dark Patterns annotated with: [DP: <type>] comments
 */

import { useState } from "react";

const steps = [
  "membership-benefits",
  "special-offer",
  "reason-survey",
  "confirm-cancel",
];

export default function AmazonPrimeCancellation() {
  const [step, setStep] = useState(0);
  const [cancelled, setCancelled] = useState(false);

  if (cancelled) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <p style={{ color: "#c0392b", fontWeight: "bold" }}>
            Your Prime membership has been cancelled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Progress bar is intentionally hidden — [DP: roach-motel] user doesn't know how many steps remain */}
      <div style={styles.card}>
        <div style={styles.primeHeader}>
          <span style={styles.primeLogo}>prime</span>
          <span style={styles.primeTagline}>Membership Management</span>
        </div>

        {/* ── STEP 0: Benefits reminder with misdirection ─────────────── */}
        {step === 0 && (
          <div>
            <h2 style={styles.heading}>
              Are you sure you want to cancel Prime?
            </h2>
            <p style={styles.subtext}>You'll immediately lose access to:</p>
            {/* [DP: misdirection] — Lengthy benefits list anchors attention on losses, not the cancel action */}
            <ul style={styles.benefitsList}>
              {[
                "FREE Same-Day Delivery",
                "Prime Video (10,000+ titles)",
                "Prime Music (100M+ songs)",
                "FREE unlimited photo storage",
                "Prime Reading — 1,000+ eBooks",
              ].map((b) => (
                <li key={b} style={styles.benefitItem}>
                  <span style={styles.checkmark}>✓</span> {b}
                </li>
              ))}
            </ul>
            {/* [DP: confirm-shaming] — Primary CTA keeps membership; cancel is self-deprecating gray text */}
            <button style={styles.primaryBtn} onClick={() => setStep(-1)}>
              Keep My Benefits
            </button>
            <div style={{ marginTop: 10 }}>
              {/* [DP: confirm-shaming] — User must say "I don't want free delivery" to proceed */}
              <span
                style={styles.confirmShameLink}
                onClick={() => setStep(1)}
                role="button"
              >
                No thanks, I don't want FREE delivery and other benefits
              </span>
            </div>
          </div>
        )}

        {/* ── STEP 1: Surprise retention offer ────────────────────────── */}
        {step === 1 && (
          <div>
            <h2 style={styles.heading}>Wait — a special offer just for you</h2>
            {/* [DP: misdirection] — Interrupts the cancel flow with an unasked-for offer */}
            <div style={styles.offerBox}>
              <p style={{ fontSize: 15, fontWeight: "bold" }}>
                Pause your membership for 1 month — FREE
              </p>
              <p style={{ fontSize: 13, color: "#555" }}>
                Your benefits continue. Resume anytime. No charge.
              </p>
            </div>
            <button style={styles.primaryBtn} onClick={() => setStep(-1)}>
              Pause My Membership
            </button>
            <div style={{ marginTop: 10 }}>
              <span
                style={styles.confirmShameLink}
                onClick={() => setStep(2)}
                role="button"
              >
                Continue to cancel
              </span>
            </div>
          </div>
        )}

        {/* ── STEP 2: Survey before letting user cancel ────────────────── */}
        {step === 2 && (
          <div>
            {/* [DP: roach-motel] — Forces interaction with a mandatory form before cancellation */}
            <h2 style={styles.heading}>Before you go, tell us why you're leaving</h2>
            <p style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>
              This helps us improve Prime for other customers. (Required)
            </p>
            {[
              "Too expensive",
              "Don't use it enough",
              "Moving abroad",
              "Prefer another service",
              "Other",
            ].map((r) => (
              <label key={r} style={styles.radioRow}>
                <input type="radio" name="reason" style={{ marginRight: 8 }} />
                {r}
              </label>
            ))}
            <button
              style={{ ...styles.primaryBtn, marginTop: 16 }}
              onClick={() => setStep(3)}
            >
              Next
            </button>
          </div>
        )}

        {/* ── STEP 3: Final confirm — still asymmetric ─────────────────── */}
        {step === 3 && (
          <div>
            <h2 style={styles.heading}>Confirm cancellation</h2>
            <p style={styles.subtext}>
              Your benefits end on{" "}
              <strong>
                {new Date(Date.now() + 30 * 864e5).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </strong>
              .
            </p>
            {/* [DP: forced-continuity] — Buries the actual cancel action below a prominent "keep" button */}
            <button style={styles.primaryBtn} onClick={() => setStep(-1)}>
              Keep My Prime Membership
            </button>
            <div style={{ marginTop: 12 }}>
              {/* [DP: confirm-shaming] — Cancel is visually deprioritized as a small gray link */}
              <span
                style={{ ...styles.confirmShameLink, fontSize: 12 }}
                onClick={() => setCancelled(true)}
                role="button"
              >
                Cancel membership and lose all benefits
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    background: "#f3f3f3",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: 4,
    padding: "28px 32px",
    width: 420,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  primeHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  primeLogo: {
    background: "#00a8e1",
    color: "#fff",
    fontStyle: "italic",
    fontWeight: "bold",
    fontSize: 18,
    padding: "2px 8px",
    borderRadius: 3,
  },
  primeTagline: { fontSize: 13, color: "#555" },
  heading: { fontSize: 18, fontWeight: "bold", color: "#111", marginBottom: 10 },
  subtext: { fontSize: 14, color: "#444", marginBottom: 12 },
  benefitsList: { listStyle: "none", padding: 0, margin: "0 0 16px 0" },
  benefitItem: { fontSize: 14, padding: "5px 0", color: "#222" },
  checkmark: { color: "#00a8e1", marginRight: 8, fontWeight: "bold" },
  // [DP: visual-weight] — Primary button is large, bright, and unmissable
  primaryBtn: {
    width: "100%",
    background: "#f0c14b",
    border: "1px solid #a88734",
    borderRadius: 3,
    padding: "10px 0",
    fontSize: 14,
    fontWeight: "bold",
    cursor: "pointer",
    color: "#111",
  },
  // [DP: confirm-shaming] — Cancel action is small, gray, underlined only on hover
  confirmShameLink: {
    fontSize: 13,
    color: "#777",
    textDecoration: "underline",
    cursor: "pointer",
    display: "block",
    textAlign: "center",
  },
  offerBox: {
    background: "#fffbec",
    border: "1px solid #f0c14b",
    borderRadius: 4,
    padding: "14px 16px",
    marginBottom: 16,
  },
  radioRow: {
    display: "block",
    fontSize: 14,
    marginBottom: 8,
    cursor: "pointer",
  },
};
