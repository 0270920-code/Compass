
import seed from "./seed.json" with { type: "json" };
import { formatMxn, parseMxnToCents, sumCents } from "./money.mjs";

// Educational demo profiles ONLY. This is not secure authentication.
// Anyone using this browser can switch profiles and access its local data.
const STORAGE_KEY = "compass-demo-profiles-v1";
const LEGACY_KEY = "brujula-demo-v1";

const app = document.querySelector("#app");
const resetButton = document.querySelector("#reset-demo");
let store = { profiles: [], activeProfileId: null };

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]
  );
}

function makeId(prefix) {
  const unique = globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${unique}`;
}

function currentProfile() {
  return store.profiles.find(
    (profile) => profile.id === store.activeProfileId
  ) ?? null;
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    return true;
  } catch {
    renderStorageError();
    return false;
  }
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed || !Array.isArray(parsed.profiles)) {
        throw new Error("Invalid demo data");
      }

      store = {
        profiles: parsed.profiles.filter((p) =>
          p &&
          typeof p.id === "string" &&
          typeof p.displayName === "string" &&
          Array.isArray(p.contributions)
        ),
        activeProfileId:
          typeof parsed.activeProfileId === "string"
            ? parsed.activeProfileId
            : null,
      };
    } else {
      // Preserve the previous Alex demo.
      let previous = null;

      try {
        const legacy = localStorage.getItem(LEGACY_KEY);
        if (legacy) previous = JSON.parse(legacy);
      } catch {
        // Start a fresh demo if old data is damaged.
      }

      store.profiles = [{
        id: seed.user.id,
        displayName: seed.user.displayName,
        goal: previous?.goal ?? null,
        contributions: Array.isArray(previous?.contributions)
          ? previous.contributions
          : [],
      }];

      store.activeProfileId = null;
      if (!saveState()) return false;
    }

    if (!currentProfile()) {
      store.activeProfileId = null;
    }

    return true;
  } catch {
    renderStorageError();
    return false;
  }
}

function getBalanceCents() {
  const profile = currentProfile();

  return sumCents(
    (profile?.contributions ?? []).map(
      (item) => item.amountCents
    )
  ) ?? 0;
}

function getProgressPercent(balanceCents) {
  const target = currentProfile()?.goal?.targetCents;

  return target > 0
    ? Math.min((balanceCents * 100) / target, 100)
    : 0;
}

function createFolio() {
  return `SIM-${Date.now().toString(36).toUpperCase()}-${Math.floor(
    Math.random() * 1000
  ).toString().padStart(3, "0")}`;
}

function setResetVisibility(visible) {
  resetButton.hidden = !visible;
  resetButton.textContent = "Reset my demo";
}

function renderWelcome() {
  setResetVisibility(false);
  store.activeProfileId = null;
  saveState();

  app.innerHTML = `
    <section class="screen" aria-labelledby="welcome-title">
      <p class="eyebrow">Give your money direction</p>

      <h1 id="welcome-title">Save for what’s next.</h1>

      <p class="lede">
        Create a demo profile, set a savings goal,
        and track fictional contributions.
      </p>

      <div class="card" style="margin-bottom:20px">
        <h3 style="margin-top:0">Sign in · demo profiles</h3>

        <p class="hint" style="margin-bottom:16px">
          Choose a profile saved in this browser.
          No password or real account is used.
        </p>

        ${
          store.profiles.length
            ? store.profiles.map((profile) => `
                <div class="history-row">
                  <div>
                    <strong>${escapeHtml(profile.displayName)}</strong>
                    <span>Local demo profile</span>
                  </div>

                  <button
                    class="secondary"
                    type="button"
                    data-signin="${escapeHtml(profile.id)}"
                  >
                    Sign in
                  </button>
                </div>
              `).join("")
            : `<p class="hint">No demo profiles yet.</p>`
        }
      </div>

      <button id="create-profile" class="primary" type="button">
        Create demo profile
      </button>

      <p class="hint" style="margin-top:14px">
        Educational simulation only. Profiles are not secure accounts
        and data is not shared between devices.
      </p>
    </section>
  `;

  document.querySelector("#create-profile")
    .addEventListener("click", renderCreateProfile);

  document.querySelectorAll("[data-signin]").forEach((button) => {
    button.addEventListener("click", () => {
      const selected = store.profiles.find(
        (p) => p.id === button.dataset.signin
      );

      if (!selected) return;

      store.activeProfileId = selected.id;

      if (saveState()) renderHome();
    });
  });
}

function renderCreateProfile() {
  setResetVisibility(false);

  app.innerHTML = `
    <section class="screen" aria-labelledby="profile-title">
      <p class="eyebrow">Create a local demo profile</p>

      <h2 id="profile-title">What should we call you?</h2>

      <p class="lede">
        This is a demonstration profile, not a real account.
        Do not enter sensitive information.
      </p>

      <form id="profile-form" class="card" novalidate>
        <div class="field">
          <label for="profile-name">Display name</label>

          <input
            id="profile-name"
            type="text"
            maxlength="40"
            placeholder="e.g. Sofia"
            autocomplete="off"
            required
          />
        </div>

        <p id="profile-error" class="error" role="alert"></p>

        <div class="form-actions">
          <button id="cancel-profile" class="secondary" type="button">
            Cancel
          </button>

          <button class="primary" type="submit">
            Create demo profile
          </button>
        </div>
      </form>
    </section>
  `;

  document.querySelector("#cancel-profile")
    .addEventListener("click", renderWelcome);

  document.querySelector("#profile-form")
    .addEventListener("submit", (event) => {
      event.preventDefault();

      const displayName = document
        .querySelector("#profile-name")
        .value.trim();

      const error = document.querySelector("#profile-error");

      if (!displayName) {
        error.textContent = "Enter a display name.";
        return;
      }

      if (store.profiles.some(
        (p) => p.displayName.toLowerCase() === displayName.toLowerCase()
      )) {
        error.textContent =
          "That demo profile already exists. Choose another name or sign in.";
        return;
      }

      const profile = {
        id: makeId("demo"),
        displayName,
        goal: null,
        contributions: [],
      };

      store.profiles.push(profile);
      store.activeProfileId = profile.id;

      if (saveState()) renderGoalForm();
    });
}

function profileBar() {
  const profile = currentProfile();

  return `
    <div
      class="name-chip"
      style="display:flex;justify-content:space-between;gap:18px"
    >
      <span>
        <span
          class="avatar"
          aria-hidden="true"
          style="display:inline-grid;margin-right:8px"
        >
          ${escapeHtml(profile.displayName[0].toUpperCase())}
        </span>

        ${escapeHtml(profile.displayName)} · demo
      </span>

      <button id="sign-out" class="text-button" type="button">
        Log out
      </button>
    </div>
  `;
}

function wireSignOut() {
  document.querySelector("#sign-out")
    ?.addEventListener("click", renderWelcome);
}

function renderHome() {
  if (!currentProfile()) return renderWelcome();

  if (currentProfile().goal) {
    renderGoalSaved();
  } else {
    renderGoalForm();
  }
}

function renderGoalForm() {
  if (!currentProfile()) return renderWelcome();

  setResetVisibility(true);

  app.innerHTML = `
    <section class="screen" aria-labelledby="goal-title">
      ${profileBar()}

      <p class="eyebrow">Step 1 of 5 · Your first goal</p>

      <h2 id="goal-title">What are you saving for?</h2>

      <p class="lede">
        Name a goal and set a target in MXN.
        All amounts are simulated.
      </p>

      <form id="goal-form" class="card" novalidate>
        <div class="field">
          <label for="goal-name">Goal name</label>

          <input
            id="goal-name"
            type="text"
            maxlength="60"
            placeholder="e.g. Summer trip"
            autocomplete="off"
            required
          />
        </div>

        <div class="field">
          <label for="target-amount">Target</label>

          <p class="hint">
            Enter a positive amount in Mexican pesos.
          </p>

          <div class="input-wrap">
            <span class="currency">MXN</span>

            <input
              id="target-amount"
              inputmode="decimal"
              placeholder="0.00"
              autocomplete="off"
              required
            />
          </div>
        </div>

        <p id="goal-error" class="error" role="alert"></p>

        <div class="form-actions">
          <button id="cancel-goal" class="secondary" type="button">
            Cancel
          </button>

          <button class="primary" type="submit">
            Save goal
          </button>
        </div>
      </form>
    </section>
  `;

  wireSignOut();

  document.querySelector("#cancel-goal")
    .addEventListener("click", renderWelcome);

  document.querySelector("#goal-form")
    .addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document
        .querySelector("#goal-name")
        .value.trim();

      const targetCents = parseMxnToCents(
        document.querySelector("#target-amount").value
      );

      const error = document.querySelector("#goal-error");

      if (!name) {
        error.textContent = "Enter a name for your goal.";
        return;
      }

      if (targetCents === null) {
        error.textContent =
          "Enter a target greater than MXN 0.00, with no more than two decimals.";
        return;
      }

      const profile = currentProfile();

      profile.goal = {
        id: makeId("goal"),
        userId: profile.id,
        name,
        targetCents,
        createdAt: new Date().toISOString(),
      };

      profile.contributions = [];

      if (saveState()) renderGoalSaved();
    });
}

function renderGoalSaved() {
  const profile = currentProfile();

  if (!profile) return renderWelcome();
  if (!profile.goal) return renderGoalForm();

  setResetVisibility(true);

  const balanceCents = getBalanceCents();

  const remainingCents = Math.max(
    profile.goal.targetCents - balanceCents,
    0
  );

  const progressPercent = getProgressPercent(balanceCents);

  const history = [...profile.contributions].reverse();

  app.innerHTML = `
    <section class="screen" aria-labelledby="saved-title">
      ${profileBar()}

      <p class="eyebrow">Your savings goal</p>

      <h2 id="saved-title">
        ${escapeHtml(profile.goal.name)}
      </h2>

      <div class="card summary-card">
        <div class="balance-line">
          <span>Simulated balance</span>
          <strong>${formatMxn(balanceCents)}</strong>
        </div>

        <div
          class="progress-track"
          aria-label="${progressPercent.toFixed(1)} percent of goal complete"
        >
          <span style="width: ${progressPercent}%"></span>
        </div>

        <div class="progress-meta">
          <span>${progressPercent.toFixed(1)}% complete</span>
          <span>${formatMxn(remainingCents)} left</span>
        </div>

        <p class="hint">
          Target: ${formatMxn(profile.goal.targetCents)}
          · No fees · No interest
        </p>
      </div>

      <div class="section-heading">
        <h3>Contribution history</h3>
        <span>
          ${history.length}
          ${history.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      ${
        history.length
          ? `<div class="history-list">
              ${history.map(renderContribution).join("")}
            </div>`
          : `<div class="card empty-state">
              <p>No contributions yet.</p>
              <p class="hint">
                Add a simulated contribution to see your progress.
              </p>
            </div>`
      }

      <button id="add-contribution" class="primary" type="button">
        Add simulated contribution
      </button>
    </section>
  `;

  wireSignOut();

  document.querySelector("#add-contribution")
    .addEventListener("click", renderContributionForm);
}

function renderContribution(contribution) {
  return `
    <div class="history-row">
      <div>
        <strong>${formatMxn(contribution.amountCents)}</strong>

        <span>
          ${new Date(contribution.createdAt).toLocaleString("en-MX", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </span>
      </div>

      <span class="status-pill">Simulated</span>
    </div>
  `;
}

function renderContributionForm() {
  if (!currentProfile()?.goal) return renderHome();

  setResetVisibility(true);

  app.innerHTML = `
    <section class="screen" aria-labelledby="contribution-title">
      ${profileBar()}

      <p class="eyebrow">Step 2 of 5 · Add to your goal</p>

      <h2 id="contribution-title">Make a little progress.</h2>

      <p class="lede">
        Enter a simulated contribution.
        Review it before confirming.
      </p>

      <form id="contribution-form" class="card" novalidate>
        <div class="field">
          <label for="contribution-amount">
            Contribution amount
          </label>

          <p class="hint">
            This is a simulation. No money moves.
          </p>

          <div class="input-wrap">
            <span class="currency">MXN</span>

            <input
              id="contribution-amount"
              inputmode="decimal"
              placeholder="0.00"
              autocomplete="off"
              required
            />
          </div>
        </div>

        <p id="contribution-error" class="error" role="alert"></p>

        <div class="form-actions">
          <button
            id="cancel-contribution"
            class="secondary"
            type="button"
          >
            Cancel
          </button>

          <button class="primary" type="submit">
            Review contribution
          </button>
        </div>
      </form>
    </section>
  `;

  wireSignOut();

  document.querySelector("#cancel-contribution")
    .addEventListener("click", renderGoalSaved);

  document.querySelector("#contribution-form")
    .addEventListener("submit", (event) => {
      event.preventDefault();

      const amountCents = parseMxnToCents(
        document.querySelector("#contribution-amount").value
      );

      const projectedBalance = amountCents === null
        ? null
        : getBalanceCents() + amountCents;

      if (
        amountCents === null ||
        !Number.isSafeInteger(projectedBalance)
      ) {
        document.querySelector("#contribution-error").textContent =
          "Enter an amount greater than MXN 0.00, with no more than two decimals.";
        return;
      }

      renderContributionReview(
        amountCents,
        projectedBalance
      );
    });
}

function renderContributionReview(amountCents, projectedBalance) {
  if (!currentProfile()?.goal) return renderHome();

  setResetVisibility(true);

  app.innerHTML = `
    <section class="screen" aria-labelledby="review-title">
      ${profileBar()}

      <p class="eyebrow">Step 3 of 5 · Review</p>

      <h2 id="review-title">Ready to add this?</h2>

      <div class="card review-card">
        <div class="review-row">
          <span>Contribution</span>
          <strong>${formatMxn(amountCents)}</strong>
        </div>

        <div class="review-row">
          <span>Current balance</span>
          <strong>${formatMxn(getBalanceCents())}</strong>
        </div>

        <div class="review-row total">
          <span>New simulated balance</span>
          <strong>${formatMxn(projectedBalance)}</strong>
        </div>

        <div class="review-row">
          <span>Fees</span>
          <strong>MXN 0.00</strong>
        </div>

        <p class="hint">
          This is a fictional local simulation.
          No bank account or transfer is involved.
        </p>
      </div>

      <div class="form-actions">
        <button id="cancel-review" class="secondary" type="button">
          Cancel
        </button>

        <button
          id="confirm-contribution"
          class="primary"
          type="button"
        >
          Confirm simulation
        </button>
      </div>

      <p id="review-error" class="error" role="alert"></p>
    </section>
  `;

  wireSignOut();

  let confirmed = false;

  document.querySelector("#cancel-review")
    .addEventListener("click", renderContributionForm);

  document.querySelector("#confirm-contribution")
    .addEventListener("click", (event) => {
      if (confirmed) return;

      confirmed = true;

      event.currentTarget.disabled = true;
      event.currentTarget.textContent = "Processing…";

      const profile = currentProfile();

      const contribution = {
        id: createFolio(),
        goalId: profile.goal.id,
        amountCents,
        createdAt: new Date().toISOString(),
        status: "simulated",
      };

      if (!profile.contributions.some(
        (item) => item.id === contribution.id
      )) {
        profile.contributions.push(contribution);

        if (saveState()) {
          renderContributionSuccess(contribution);
        }
      }
    });
}

function renderContributionSuccess(contribution) {
  if (!currentProfile()?.goal) return renderHome();

  setResetVisibility(true);

  const balanceCents = getBalanceCents();
  const progressPercent = getProgressPercent(balanceCents);

  app.innerHTML = `
    <section class="screen" aria-labelledby="success-title">
      ${profileBar()}

      <p class="eyebrow">Step 4 of 5 · Confirmed</p>

      <h2 id="success-title">Contribution simulated.</h2>

      <p class="lede">
        Your fictional contribution of
        <strong>${formatMxn(contribution.amountCents)}</strong>
        was added once.
      </p>

      <div class="card success-card">
        <span class="success-mark" aria-hidden="true">✓</span>

        <p class="hint">Simulated folio</p>

        <strong>${escapeHtml(contribution.id)}</strong>

        <div class="balance-line">
          <span>New balance</span>
          <strong>${formatMxn(balanceCents)}</strong>
        </div>

        <div
          class="progress-track"
          aria-label="${progressPercent.toFixed(1)} percent of goal complete"
        >
          <span style="width: ${progressPercent}%"></span>
        </div>

        <p class="hint">
          ${progressPercent.toFixed(1)}% of your goal · no money moved
        </p>
      </div>

      <button id="view-goal" class="primary" type="button">
        View goal and history
      </button>
    </section>
  `;

  wireSignOut();

  document.querySelector("#view-goal")
    .addEventListener("click", renderGoalSaved);
}

function renderStorageError() {
  app.innerHTML = `
    <section class="screen">
      <div class="card">
        <p class="error">
          Local storage is unavailable or corrupted.
          Enable it or clear site data to continue.
        </p>
      </div>
    </section>
  `;
}

resetButton.addEventListener("click", () => {
  const profile = currentProfile();

  if (!profile) return renderWelcome();

  if (!confirm(
    `Reset the savings goal and simulated contributions for ${profile.displayName}?`
  )) {
    return;
  }

  profile.goal = null;
  profile.contributions = [];

  if (saveState()) renderGoalForm();
});

if (loadState()) {
  if (currentProfile()) {
    renderHome();
  } else {
    renderWelcome();
  }
}

export { parseMxnToCents, formatMxn };
