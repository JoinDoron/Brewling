/* Brewling product-page content.
 * Source: supplied product PRDs and existing copy deck.
 * Stage labels describe documented baselines, not independently verified releases.
 * Evidence and AI sections describe product design; they are not live-service claims.
 */
window.BREWLING_ENHANCEMENTS = {
  databrew: {
    stageLabel: "Deployment-dependent",
    stageDetail: "Working application and demo flows. Each production deployment requires its own identity, source connections, infrastructure and acceptance checks.",
    ctaLabel: "Request a briefing",
    enquiryIntent: "Discuss an institutional briefing, information boundaries and deployment requirements for Databrew.",
    aiAssists: "Find authorised information, prepare source-linked responses and draft follow-up work.",
    humanDecides: "Set access and action boundaries, review the result and approve consequential external actions.",
    evidenceTitle: "See the work behind the answer.",
    evidenceIntro: "Databrew is designed to connect an answer to its sources and the activity that produced it, giving reviewers a clear record to inspect.",
    evidenceItems: [
      "Source references and citations behind the response.",
      "The agent’s plan, tool activity and completion state.",
      "Policy checks, approvals and a record of authorised actions."
    ],
    faqs: [
      {
        question: "Who is Databrew designed for?",
        answer: "Enterprises, public institutions and regulated organisations with complex information needs. The workspace can be shaped around sector vocabulary, roles and defined workflows."
      },
      {
        question: "Can AI see information a user cannot access?",
        answer: "It should not. Databrew’s design applies organisation, role and source permissions before information is retrieved or used. Those controls must be verified with each deployment’s actual identity and source systems."
      },
      {
        question: "Can Databrew run in our own environment?",
        answer: "Private and air-gapped environments are part of the deployment design. Suitability, infrastructure and effective isolation need to be assessed and verified for the specific installation."
      },
      {
        question: "Does Databrew replace our existing business systems?",
        answer: "No. Databrew helps people use organisational knowledge and carry out bounded AI work. Existing business systems remain the records of authority for the work they own."
      }
    ]
  },
  dealbrew: {
    stageLabel: "Sandbox",
    stageDetail: "A working sandbox foundation. Live verification, approved signing and partner-backed money flows still require provider, operational and release approvals.",
    ctaLabel: "Discuss a sandbox walkthrough",
    enquiryIntent: "Explore a Dealbrew sandbox walkthrough and the requirements of a specific commercial transaction.",
    aiAssists: "Summarise agreements with sources, compare versions and suggest obligations, milestones and follow-up work.",
    humanDecides: "Approve terms, sign agreements, authorise releases or refunds and determine dispute outcomes through the agreed process.",
    evidenceTitle: "Keep the complete transaction story.",
    evidenceIntro: "The closing pack is designed to bring the agreement, performance and settlement evidence together, so the transaction can be understood after it ends.",
    evidenceItems: [
      "Counterparty and authority evidence, agreement versions and signing records.",
      "Milestone submissions, acceptance decisions and approved changes.",
      "Partner money references, dispute outcomes and the transaction history."
    ],
    faqs: [
      {
        question: "Is Dealbrew a sales CRM?",
        answer: "No. Dealbrew focuses on commercial commitments, from counterparty review and agreements to performance and settlement. Sales pipelines and general customer relationship management sit outside that focus."
      },
      {
        question: "Does Dealbrew hold our money?",
        answer: "No. The intended model uses approved partners to hold and move funds. Current transaction flows are sandbox-based; live escrow requires the relevant partner, legal structure and release approvals."
      },
      {
        question: "Does the transaction end when an agreement is signed?",
        answer: "No. Dealbrew’s scope continues through milestones, delivery evidence, acceptance, payment conditions, exceptions and the final closing record."
      },
      {
        question: "Can AI sign or release money for us?",
        answer: "No. AI can prepare explanations and suggestions. Signatures, authority changes, payments, refunds and dispute decisions require authorised people and the appropriate controls."
      }
    ]
  },
  hirebrew: {
    stageLabel: "Prototype",
    stageDetail: "A high-fidelity prototype with connected demo workflows and a backend foundation. Production identity, integrations and operating controls remain part of release preparation.",
    ctaLabel: "Discuss a product walkthrough",
    enquiryIntent: "Explore a Hirebrew prototype walkthrough and discuss the people workflows a potential pilot would need to cover.",
    aiAssists: "Draft roles, explain candidate-match suggestions, prepare interview material and summarise routine people workflows.",
    humanDecides: "Make hiring, promotion, pay, disciplinary and exit decisions, with the reasoning and supporting context recorded.",
    evidenceTitle: "Keep the context behind people decisions.",
    evidenceIntro: "Hirebrew is designed to retain the conversations, inputs and decisions behind a candidate or employee journey, with access appropriate to each role.",
    evidenceItems: [
      "Candidate stages, structured scorecards and the final decision rationale.",
      "AI suggestions, reviewer corrections and the accountable human decision.",
      "Employee requests, approvals, replies and resolution history."
    ],
    faqs: [
      {
        question: "Is Hirebrew only for recruitment?",
        answer: "No. Its scope spans the people lifecycle, including onboarding, employee services, manager workflows, performance, learning and workforce insight."
      },
      {
        question: "Does Hirebrew replace our payroll engine?",
        answer: "No. Payroll-related workflows and payroll-history visibility are part of the product direction. Existing payroll providers and the connections they require must be considered during implementation."
      },
      {
        question: "Is Hirebrew a public jobs marketplace?",
        answer: "No. It is designed for organisations managing their own hiring and people operations. A candidate experience supports that organisation’s recruitment process."
      },
      {
        question: "Does AI choose who gets hired?",
        answer: "No. AI can assist preparation and review, with supporting context and a correction path. People remain responsible for employment decisions."
      }
    ]
  },
  ledgerbrew: {
    stageLabel: "Prototype",
    stageDetail: "A clickable prototype and product baseline. Its records and AI responses are examples; partner connections and end-to-end finance workflows still need to be implemented and validated.",
    ctaLabel: "Discuss a design-partner pilot",
    enquiryIntent: "Discuss Ledgerbrew design-partner requirements, finance controls and the scope of a potential pilot.",
    aiAssists: "Extract invoice fields with source references, suggest bank matches and draft collection reminders.",
    humanDecides: "Release payments, approve tax rules, resolve exceptions and authorise customer escalations.",
    evidenceTitle: "Bring the period’s evidence together.",
    evidenceIntro: "The period evidence pack is designed to connect an invoice to its approvals, tax evidence, payment, bank match and accounting entry.",
    evidenceItems: [
      "Source invoices, review decisions and e-invoice clearance responses.",
      "Payment events, receipt matches and reconciliation decisions.",
      "Balanced journal batches, posting receipts and the approval trail."
    ],
    faqs: [
      {
        question: "Is Ledgerbrew a general ledger?",
        answer: "No. It is designed to operate above the customer’s existing general ledger, handling invoice, approval, collection and reconciliation workflows and preparing the resulting journals."
      },
      {
        question: "Can Ledgerbrew clear live e-invoices today?",
        answer: "The current product is a prototype. E-invoice clearance is a planned workflow through an accredited partner, with live capability dependent on partner selection, integration and acceptance checks."
      },
      {
        question: "Does Ledgerbrew file our tax returns?",
        answer: "No. The initial scope supports schedules, source evidence and review. The organisation remains responsible for its tax positions and filings."
      },
      {
        question: "Does Ledgerbrew hold or move funds itself?",
        answer: "It does not hold client funds. The intended model uses licensed banks or payment partners for execution, with Ledgerbrew providing the approval, preparation and reconciliation workflow."
      }
    ]
  },
  propbrew: {
    stageLabel: "Pilot preparation",
    stageDetail: "The initial scope targets a Lagos operator pilot. Infrastructure, acceptance testing and client sign-off must be completed before production launch.",
    ctaLabel: "Discuss a Lagos pilot",
    enquiryIntent: "Discuss the requirements of a potential Propbrew pilot for a Lagos estate or property operator.",
    aiAssists: "Triage resident requests, suggest maintenance actions, find documents and draft communications.",
    humanDecides: "Approve schedule changes, financial adjustments, permissions, security actions and outbound messages.",
    evidenceTitle: "Keep a useful history of estate operations.",
    evidenceIntro: "Propbrew is designed to keep requests, field evidence and financial decisions tied to the estate, asset, resident or vendor involved.",
    evidenceItems: [
      "Work-order ownership, field evidence and completion verification.",
      "Invoice references, verified payment events and reconciliation approvals.",
      "State changes, communications decisions and AI review history."
    ],
    faqs: [
      {
        question: "Is Propbrew a property listing marketplace?",
        answer: "No. Its main job is running estates and property operations: facilities, resident services, billing, collections and the daily work of the operator."
      },
      {
        question: "Can field teams work with intermittent connectivity?",
        answer: "Offline reads, queued updates and visible sync states are part of the requirements. They need to pass acceptance testing on the operator’s devices and deployment before being relied on."
      },
      {
        question: "Is Propbrew already running a live Lagos pilot?",
        answer: "Propbrew is in pilot preparation. Live use depends on completing infrastructure, operational testing and client sign-off."
      },
      {
        question: "Does the initial scope include deep construction management?",
        answer: "The first focus is estate and facility operations. Deeper construction delivery is an expansion area to scope separately from the initial workflows."
      }
    ]
  }
};
