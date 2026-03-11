/**
 * DARK PATTERN CASE #2: LinkedIn "Add Connections" Email Harvesting
 * ──────────────────────────────────────────────────────────────────
 * Legal Action  : Perkins v. LinkedIn Corp. (2015) — $13M settlement
 * Pattern Types : hidden-subscription, trick-question, visual-interference, roach-motel
 * Source        : Case No. 13-cv-04303-LHK (N.D. Cal.) | molfar.io/blog/dark-patterns
 *
 * LinkedIn imported users' email contacts without clear disclosure,
 * then sent repeated invitation emails to those contacts.
 * Dark Patterns annotated with: [DP: <type>] comments
 */

import { useState } from "react";

export default function LinkedInAddConnections() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState("import"); // import | contacts | sent
  const [selectAll, setSelectAll] = useState(true); // [DP: trick-question] pre-checked by default

  const mockContacts = [
    { name: "Rahul Sharma", email: "rahul.sharma@example.com" },
    { name: "Priya Nair", email: "priya.nair@example.com" },
    { name: "David Wilson", email: "d.wilson@example.com" },
    { name: "Sunita Patel", email: "sunita.patel@example.com" },
    { name: "James O'Brien", email: "jobrien@example.com" },
    { name: "Chen Wei", email: "chenwei@example.com" },
  ];

  if (step === "sent") {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.liLogo}>in</div>
          <h2 style={{ color: "#0077b5", fontSize: 20, margin: "12px 0 8px" }}>
            Invitations sent!
          </h2>
          {/* [DP: hidden-subscription] — User never explicitly approved sending emails to all contacts */}
          <p style={{ fontSize: 14, color: "#444" }}>
            We've sent invitations to{" "}
            <strong>{mockContacts.length} people</strong> from your address book
            on your behalf.
          </p>
          {/* [DP: roach-motel] — No undo option presented here */}
          <p style={{ fontSize: 12, color: "#888", marginTop: 8 }}>
            They may receive up to 2 reminder emails if they haven't joined yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.liLogo}>in</div>

        {/* ── STEP: Email import prompt ─────────────────────────────── */}
        {step === "import" && (
          <div>
            <h2 style={styles.heading}>
              See who you already know on LinkedIn
            </h2>
            <p style={styles.subtext}>
              Use your email address book to find people you know on LinkedIn.
            </p>
            {/* [DP: visual-interference] — Input resembles standard login; users don't realise they're granting contact access */}
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Email password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
            {/* [DP: hidden-subscription] — Fine print about importing ALL contacts is below the fold */}
            <button
              style={styles.primaryBtn}
              onClick={() => setStep("contacts")}
            >
              Continue
            </button>
            {/* [DP: visual-interference] — Disclosure is tiny and below the action button */}
            <p style={styles.finePrint}>
              By clicking Continue, you agree that LinkedIn may use your email
              address to import your address book and send invitations on your
              behalf to connect with your contacts.{" "}
              <span style={{ textDecoration: "underline", cursor: "pointer" }}>
                Learn more
              </span>
            </p>
          </div>
        )}

        {/* ── STEP: Contacts pre-selected ──────────────────────────── */}
        {step === "contacts" && (
          <div>
            <h2 style={styles.heading}>{mockContacts.length} contacts found</h2>
            {/* [DP: trick-question] — "Select All" is checked by default; users must actively deselect */}
            <label style={styles.selectAllRow}>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={(e) => setSelectAll(e.target.checked)}
                style={{ marginRight: 8 }}
              />
              <strong>Select All ({mockContacts.length})</strong>
            </label>
            <div style={styles.contactList}>
              {mockContacts.map((c) => (
                <label key={c.email} style={styles.contactRow}>
                  {/* [DP: trick-question] — Individual checkboxes are also pre-checked and read-only */}
                  <input
                    type="checkbox"
                    checked={selectAll}
                    readOnly
                    style={{ marginRight: 8 }}
                  />
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: 13 }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: 12, color: "#888" }}>{c.email}</div>
                  </div>
                </label>
              ))}
            </div>
            {/* [DP: visual-interference] — "Add Connections" is large and dominant */}
            <button
              style={styles.primaryBtn}
              onClick={() => setStep("sent")}
            >
              Add Connections
            </button>
            {/* [DP: roach-motel] — Skip is visually deprioritized as a tiny link below the main button */}
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <span style={styles.skipLink} role="button">
                Skip this step
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
    fontFamily: "'Source Sans Pro', Arial, sans-serif",
    background: "#f3f2ef",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: "28px 32px",
    width: 400,
    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
  },
  liLogo: {
    background: "#0077b5",
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    width: 44,
    height: 44,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  heading: { fontSize: 20, fontWeight: "bold", color: "#000", margin: "14px 0 8px" },
  subtext: { fontSize: 14, color: "#555", marginBottom: 16 },
  input: {
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: 4,
    padding: "10px 12px",
    fontSize: 14,
    marginBottom: 10,
    boxSizing: "border-box",
  },
  // [DP: visual-weight] — Large blue button draws all visual attention
  primaryBtn: {
    width: "100%",
    background: "#0077b5",
    color: "#fff",
    border: "none",
    borderRadius: 24,
    padding: "12px 0",
    fontSize: 15,
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: 4,
  },
  // [DP: visual-interference] — Fine print is 11px and easy to miss
  finePrint: { fontSize: 11, color: "#999", marginTop: 10, lineHeight: 1.5 },
  selectAllRow: {
    display: "flex",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #eee",
    cursor: "pointer",
    fontSize: 14,
    marginBottom: 8,
  },
  contactList: { maxHeight: 200, overflowY: "auto", marginBottom: 14 },
  contactRow: {
    display: "flex",
    alignItems: "center",
    padding: "6px 0",
    borderBottom: "1px solid #f0f0f0",
    cursor: "pointer",
  },
  skipLink: { fontSize: 13, color: "#888", textDecoration: "underline", cursor: "pointer" },
};
